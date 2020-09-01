import React from "react"
import { MdDone } from "react-icons/md"
import LabeledInput from "./core/LabeledInput"
import ButtonBox from "./core/ButtonBox"
import ActionButton from "./core/ActionButton"
import Navigation from "./Navigation"
import { JOINING } from "../client"

class CreateGame extends React.Component {
  create() {
    this.props.onCreate()
  }

  render() {
    const { app } = this.props
    const { messages } = app
    const creating = this.props.app.client.status === JOINING
    return (
      <div>
        <Navigation app={app}/>
        <h1>Create Game</h1>
        <LabeledInput label={messages.get(["general", "yourName"])} value={this.props.app.preferences.name} onChange={this.props.onPlayerNameChange}/>
        <ButtonBox>
          <ActionButton text={messages.get(["general", "create"])} onAction={() => this.create()} disabled={creating}>
            <MdDone/>
          </ActionButton>
        </ButtonBox>
        {this.props.app.client.joined && (
          <p className="text--warning">{messages.get(["general", "removeFromCurrentGameWarning"])}</p>
        )}
        {creating &&
          <p>Creating...</p>
        }
        {this.props.error != null && !creating &&
          <p><b>Failed to create: </b>{this.props.error}</p>
        }
      </div>
    )
  }
}

export default CreateGame
