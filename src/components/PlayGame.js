import React from "react"
import { Route, Link } from "react-router-dom"
import { UNCONNECTED, CONNECTED, CONNECTING, JOINING } from "../client"
import ActionButton from "./core/ActionButton"
import ButtonBox from "./core/ButtonBox"
import PlayerItem from "./PlayerItem"
import BalanceDisplay from "./BalanceDisplay"
import QrCode from "./QrCode"
import MenuBar from "./MenuBar"

import Overview from "./match/Overview"
import Player from "./match/Player"
import Bank from "./match/Bank"
import FreeParking from "./match/FreeParking"
import History from "./match/History"

import styles from "./PlayGame.css"
import LinkButton from "./core/LinkButton"
import { MdArrowBack, MdRefresh, MdWarning, MdDone, MdShare } from "react-icons/md"

class PlayGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPlayerId: undefined,
      showHistory: false,
      bankPlayer: {
        id: -1,
        name: "Bank",
        bank: true,
        absent: false,
        balance: 420420
      },
      payAmount: "",
      takeAmount: ""
    }
  }

  begin() {
    this.runCommand({
      name: "begin",
      parameters: {}
    })
  }

  pay() {
    this.runCommand({
      name: "pay",
      parameters: {
        to: this.state.selectedPlayerId,
        amount: parseInt(this.state.payAmount)
      }
    })
  }

  take() {
    this.runCommand({
      name: "take",
      parameters: {
        amount: parseInt(this.state.takeAmount)
      }
    })
  }

  share() {
    const { app } = this.props
    const { messages } = app
    const { match } = app.client
    if (navigator.share) {
      navigator.share({
        title: messages.get(["app", "name"]),
        text: messages.get(["preparing", "inviteText"], { id: match.id }),
        url: this.computeJoinUrl()
      })
        .then(() => {})
        .catch(e => console.error("share failed:", e))
    } else {
      alert("Cannot share from this browser.")
    }
  }

  runCommand(command) {
    this.props.onCommand(command)
  }

  otherPlayers() {
    return this.props.app.client.match.players
      .filter(player => player.id !== this.props.app.client.playerId)
      .sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
  }

  changePayAmount(event) {
    const payAmount = event.target.value
    this.setState(state => ({ ...state, payAmount }))
  }

  changeTakeAmount(event) {
    const takeAmount = event.target.value
    this.setState(state => ({ ...state, takeAmount }))
  }

  changeShowHistory(showHistory) {
    this.setState(state => ({ ...state, showHistory }))
  }

  changeSelectedPlayer(selectedPlayerId) {
    this.setState(state => ({ ...state, selectedPlayerId }))
  }

  computeJoinUrl() {
    return location.origin + '/join/' + this.props.app.client.match.id
  }

  render() {
    if (this.props.app.client.joined) {
      return this.renderStage()
    } else {
      const { app } = this.props
      const { messages } = app
      const { status } = app.client
      let statusElement
      if (status === UNCONNECTED) {
        statusElement = <p>{messages.get(["general", "status", "unconnected"])}</p>
      } else if (status === CONNECTING) {
        statusElement = <p>{messages.get(["general", "status", "connecting"])}</p>
      } else if (status === CONNECTED) {
        statusElement = <p>{messages.get(["general", "status", "notJoined"])}</p>
      } else if (status === JOINING) {
        statusElement = <p>{messages.get(["general", "status", "joining"])}</p>
      } else {
        statusElement = <p>{messages.get(["general", "status", "preparing"])}</p>
      }
      const working = status === CONNECTING || status === JOINING
      return (
        <div>
          <MenuBar title="Match" backTo="/"/>
          <ButtonBox>
            {working ? (
              <MdRefresh/>
            ) : (
              <MdWarning/>
            )}
          </ButtonBox>
          {statusElement}
          <ButtonBox>
            <LinkButton to="/" text={messages.get(["general", "backToMainMenu"])}>
              <MdArrowBack/>
            </LinkButton>
          </ButtonBox>
        </div>
      )
    }
  }

  renderStage() {
    const stageName = this.props.app.client.match.stage
    if (stageName === "preparing") {
      return this.renderPreparing()
    } else if (stageName === "playing") {
      return this.renderPlaying()
    }
    return null
  }

  renderPreparing() {
    const joinUrl = this.computeJoinUrl()
    const { messages } = this.props.app
    return (
      <div>
        <MenuBar title="Preparing" backTo="/"/>
        <p>{messages.get(["preparing", "instructions"])}</p>
        <ButtonBox>
          <QrCode value={joinUrl}/>
        </ButtonBox>
        {this.renderShare(joinUrl)}
        <div className="others">
          {this.otherPlayers().map(player => <PlayerItem key={player.id} messages={messages} player={player}/>)}
        </div>
        <p>{messages.get(["game", "waitingForPlayers"])}</p>
        <ButtonBox>
          <ActionButton text={messages.get(["game", "begin"])} onAction={() => this.begin()}>
            <MdDone/>
          </ActionButton>
        </ButtonBox>
      </div>
    )
  }

  renderShare(joinUrl) {

    return (
      <div>
        <p>
          <code>{joinUrl}</code>
        </p>
        {navigator.share && (
          <ButtonBox>
            <ActionButton text="Invite Friends" onAction={() => this.share()}>
              <MdShare/>
            </ActionButton>
          </ButtonBox>
        )}
      </div>
    )
  }

  renderPlaying() {
    const { messages } = this.props.app
    const player = this.props.app.client.match.players[this.props.app.client.playerId]
    return (
      <div className="playing">
        <div className={styles.header}>
          <BalanceDisplay player={player} messages={messages}/>
        </div>
        <Route path="/match" exact>
          <Overview app={this.props.app}/>
        </Route>
        <Route path="/match/player/:id" render={({ match }) => <Player app={this.props.app} match={match} onCommand={this.props.onCommand}/>}/>
        <Route path="/match/bank" render={() => <Bank app={this.props.app} onCommand={this.props.onCommand}/>}/>
        <Route path="/match/freeparking" render={() => <FreeParking app={this.props.app} onCommand={this.props.onCommand}/>}/>
        <Route path="/match/history">
          <History app={this.props.app}/>
        </Route>
      </div>
    )
  }
}

export default PlayGame
