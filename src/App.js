import React from "react"
import { Switch, Route, withRouter } from "react-router-dom"
import { IconContext } from "react-icons"
import Messages from "messageformat-runtime/messages"

import Preferences from "./preferences"
import { Client } from "./client"
import MainMenu from "./components/MainMenu"
import JoinGame from "./components/JoinGame"
import CreateGame from "./components/CreateGame"
import PlayGame from "./components/PlayGame"
import NotFound from "./components/NotFound"
import messageData from "./messages.yaml"

import styles from "./App.css"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.client = new Client(`wss://play.mpbank.exploids.com`)
    this.client.rejoinIfPossible().then(() => {
      console.log("rejoined")
    }, error => {
      console.log("failed to rejoin:", error.message)
    })
    this.client.on("stateChange", client => {
      this.setState(state => ({ ...state, app: { ...state.app, client } }))
    })
    const preferences = Preferences.load()
    const messages = new Messages(messageData, "de")
    messages.setFallback("de", ["en"])
    this.state = {
      app: {
        client: this.client.state,
        preferences,
        messages
      },
      error: undefined
    }
  }

  changePlayerName(event) {
    const name = event.target.value
    this.setState(state => {
      const preferences = { ...state.app.preferences, name }
      Preferences.update(preferences)

      return {
        ...state,
        app: {
          ...state.app,
          preferences
        }
      }
    })
  }

  join(lobbyId) {
    this.client.join(lobbyId, this.state.app.preferences.name).then(() => {
      this.props.history.push("/match")
    }).catch(e => {
      console.error("failed to join", this.client.host, "lobbyId", lobbyId, "due to", e)
      this.setState(state => ({
        ...state,
        error: e.message || "Error"
      }))
    })
  }

  createGame() {
    this.client.create(this.state.app.preferences.name).then(() => {
      this.props.history.push("/match")
    }).catch(e => {
      console.error("failed to create", this.client.host, "due to", e)
      this.setState(state => ({
        ...state,
        error: e.message || "Error"
      }))
    })
  }

  runCommand(command) {
    this.client.sendCommand(command)
  }

  render() {
    return (
      <main className={styles.main}>
        <IconContext.Provider value={{ className: styles.icon }}>
          <Switch>
            <Route path="/" exact render={() => <MainMenu app={this.state.app} onReturnToMatch={() => this.props.history.push('/match')}/>}/>
            <Route path="/join/:id" render={({ match }) => <JoinGame app={this.state.app} error={this.state.error} onPlayerNameChange={e => this.changePlayerName(e)} onJoin={lobbyId => this.join(lobbyId)} lobbyId={match.params.id}/>}/>
            <Route path="/join" render={() => <JoinGame app={this.state.app} error={this.state.error} onPlayerNameChange={e => this.changePlayerName(e)} onJoin={lobbyId => this.join(lobbyId)}/>}/>
            <Route path="/create" render={() => <CreateGame app={this.state.app} error={this.state.error} onPlayerNameChange={e => this.changePlayerName(e)} onCreate={() => this.createGame()}/>}/>
            <Route path="/match" render={() => <PlayGame app={this.state.app} match={this.props.match} onCommand={command => this.runCommand(command)}/>}/>
            <Route render={() => <NotFound/>}/>
          </Switch>
        </IconContext.Provider>
      </main>
    )
  }
}

export default withRouter(App)
