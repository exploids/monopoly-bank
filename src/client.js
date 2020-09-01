import Emitter from "events"
import { struct } from "superstruct"

export const PLAYER = 0
export const BANK = 1
export const FREE_PARKING = 2

export const BANK_ID = -1
export const FREE_PARKING_ID = -2

export const UNCONNECTED = 0
export const CONNECTING = 1
export const CONNECTED = 2
export const JOINING = 3
export const JOINED = 4

const stateStruct = struct({
  joined: "boolean",
  info: "object"
})

const infoStruct = struct({
  id: "string",
  secret: "string"
})

export class Client extends Emitter {
  constructor(host) {
    super()
    this.host = host
    this.privateState = {
      connected: false,
      joined: false,
      status: UNCONNECTED,
      match: undefined,
      playerId: undefined,
      playerSecret: undefined
    }
  }

  get state() {
    return this.privateState
  }

  set state(newState) {
    this.privateState = newState
    this.emit("stateChange", newState)
  }

  async join(id, name) {
    await this.prepareHandshake()
    this.sendCommand({
      name: "join",
      parameters: { id, name }
    })
    await resolveOnEvent(this, "handshakeSuccess", "error")
  }

  async create(name) {
    await this.prepareHandshake()
    this.sendCommand({
      name: "create",
      parameters: { name }
    })
    await resolveOnEvent(this, "handshakeSuccess", "error")
  }

  async rejoin(id, secret) {
    await this.prepareHandshake()
    this.sendCommand({
      name: "rejoin",
      parameters: { id, secret }
    })
    await resolveOnEvent(this, "handshakeSuccess", "error")
  }

  async prepareHandshake() {
    if (!this.state.connected) {
      await this.connect()
    }
    if (this.state.joined) {
      this.sendCommand({ name: "leave", parameters: {} })
    }
    this.state = {
      ...this.state,
      status: JOINING
    }
  }

  async rejoinIfPossible() {
    const data = this.loadMatchInfo()
    if (data.joined) {
      await this.rejoin(data.info.id, data.info.secret)
    }
  }

  sendCommand(command) {
    const serialized = JSON.stringify(command)
    console.log("sending", serialized)
    this.socket.send(serialized)
  }

  connect() {
    if (!this.connectingPromise) {
      this.connectingPromise = this.connectUnsafe().catch(e => {
        this.connectingPromise = undefined
        throw e
      })
    }
    return this.connectingPromise
  }

  async connectUnsafe() {
    this.state = {
      ...this.state,
      status: CONNECTING
    }
    try {
      this.socket = await openSocket(this.host, "egg")
      this.state = {
        ...this.state,
        status: CONNECTED,
        joined: false
      }
    } catch (e) {
      this.state = {
        ...this.state,
        status: UNCONNECTED,
        joined: false
      }
      throw e
    }

    this.socket.addEventListener("close", () => {
      this.socket = undefined
      this.connectingPromise = undefined
      this.state = {
        ...this.state,
        status: UNCONNECTED,
        joined: false
      }
    })

    this.socket.addEventListener("message", event => {
      const command = JSON.parse(event.data)
      this.handleMessage(command)
    })
  }

  handleMessage(message) {
    console.log("receiving", JSON.stringify(message))
    if (this.state.joined) {
      this.handleCommand(message)
    } else {
      this.handleHandshake(message)
    }
  }

  handleHandshake(handshake) {
    const { name, parameters } = handshake
    switch (name) {
      case "ok":
        console.log("handshake success")
        this.state = {
          ...this.state,
          match: parameters.match,
          playerId: parameters.playerId,
          playerSecret: parameters.playerSecret,
          status: JOINED,
          joined: true
        }
        this.storeMatchInfo()
        this.emit("handshakeSuccess", this)
        break
      case "error":
        this.state = {
          ...this.state,
          status: CONNECTED,
          joined: false
        }
        this.emit("error", new Error(parameters.message))
        break
      default:
        this.state = {
          ...this.state,
          status: CONNECTED,
          joined: false
        }
        this.emit("error", new Error("weird handshake: " + name))
    }
  }

  handleCommand(command) {
    const { name, parameters } = command
    switch (name) {
      case "absent":
        const players = this.state.match.players.slice()
        players[parameters.id] = {
          ...players[parameters.id],
          absent: parameters.value
        }
        this.state = {
          ...this.state,
          match: {
            ...this.state.match,
            players
          }
        }
        break
      case "join":
        this.state = {
          ...this.state,
          match: {
            ...this.state.match,
            players: this.state.match.players.concat([parameters])
          }
        }
        break
      case "begin":
        this.state = {
          ...this.state,
          match: {
            ...this.state.match,
            stage: "playing",
            players: this.state.match.players.map(player => ({
              ...player,
              balance: this.state.match.rules.initialBalance
            }))
          }
        }
        break
      case "pay":
        this.handlePay(parameters)
        break
      case "left":
        this.state = {
          ...this.state,
          status: CONNECTED,
          joined: false,
          match: undefined,
          playerId: undefined,
          playerSecret: undefined
        }
        break
      case "error":
        console.warn("command failed", parameters)
        this.emit("error", new Error(parameters.message))
        break
      default:
        console.warn("unknown command", name)
        this.emit("error", new Error("weird command: " + name))
    }
  }

  handlePay(parameters) {
    const players = this.state.match.players.slice()
    if (parameters.from >= 0) {
      players[parameters.from] = {
        ...players[parameters.from],
        balance: players[parameters.from].balance - parameters.amount
      }
    }
    if (parameters.to >= 0) {
      players[parameters.to] = {
        ...players[parameters.to],
        balance: players[parameters.to].balance + parameters.amount
      }
    }
    const history = this.state.match.history.concat([{
      from: parameters.from,
      to: parameters.to,
      amount: parameters.amount
    }])
    this.state = {
      ...this.state,
      match: {
        ...this.state.match,
        stage: "playing",
        players,
        history
      }
    }
  }

  close() {
    try {
      this.socket.close()
    } catch (e) {
      console.warn(`error while closing socket: ${e}`)
    }
    this.socket = null
    this.emit("close")
  }

  storeMatchInfo() {
    let data
    if (this.state.status === JOINED) {
      data = {
        joined: true,
        info: {
          id: this.state.match.id,
          secret: this.state.playerSecret,
        }
      }
    } else {
      data = { joined: false }
    }
    localStorage.setItem("state", JSON.stringify(data))
  }

  loadMatchInfo() {
    const item = localStorage.getItem("state")
    if (typeof item !== "string") {
      throw TypeError("item not present")
    }
    const data = JSON.parse(item)
    stateStruct(data)
    if (data.joined) {
      infoStruct(data.info)
    }
    return data
  }
}

export function openSocket(url, protocol) {
  return new Promise((resolve, reject) => {
    let socket
    try {
      socket = new WebSocket(url, protocol)
    } catch (e) {
      reject(e)
    }
    socket.onopen = () => {
      resolve(socket)
      socket.onerror = undefined
      socket.onclose = undefined
    }
    socket.onerror = e => {
      reject(e)
    }
    socket.onclose = () => {
      reject(new Error("closed"))
    }
  })
}

export function resolveOnEvent(target, resolveName, rejectName) {
  return new Promise((resolve, reject) => {
    const listeners = [
      value => {
        resolve(value)
        target.off(resolveName, listeners[0])
        target.off(rejectName, listeners[1])
      },
      value => {
        reject(value)
        target.off(resolveName, listeners[0])
        target.off(rejectName, listeners[1])
      }
    ]
    target.on(resolveName, listeners[0])
    target.on(rejectName, listeners[1])
  })
}
