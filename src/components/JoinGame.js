import React from "react"
import { MdDone } from "react-icons/md"
import LabeledInput from "./core/LabeledInput"
import ButtonBox from "./core/ButtonBox"
import ActionButton from "./core/ActionButton"
import Navigation from "./Navigation"
import { JOINING } from "../client"

class JoinGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lobbyId: this.props.lobbyId
    }
  }

  join() {
    this.props.onJoin(this.state.lobbyId)
  }

  changeLobbyId(event) {
    const lobbyId = event.target.value
    this.setState(state => ({ ...state, lobbyId }))
  }

  render() {
    const { app } = this.props
    const { messages } = app
    const joining = this.props.app.client.status === JOINING
    return (
      <div>
        <Navigation app={app}/>
        <h1>Join Game</h1>
        {this.props.lobbyId ? (
          <LabeledInput label={messages.get(["general", "lobbyId"])} value={this.state.lobbyId} readOnly/>
        ) : (
          <LabeledInput label={messages.get(["general", "lobbyId"])} value={this.state.lobbyId} onChange={e => this.changeLobbyId(e)}/>
        )}
        <LabeledInput label={messages.get(["general", "yourName"])} value={this.props.app.preferences.name} onChange={this.props.onPlayerNameChange}/>
        <ButtonBox>
          <ActionButton text={messages.get(["general", "join"])} onAction={() => this.join()} disabled={joining}>
            <MdDone/>
          </ActionButton>
        </ButtonBox>
        {this.props.app.client.joined && (
          <p className="text--warning">{messages.get(["general", "removeFromCurrentGameWarning"])}</p>
        )}
        {joining &&
          <p>Joining...</p>
        }
        {this.props.error != null && !joining &&
          <p><b>Failed to join: </b>{this.props.error}</p>
        }
      </div>
    )
  }
}

export default JoinGame
