import React from "react"

import ButtonBox from "./core/ButtonBox"
import ActionButton from "./core/ActionButton"
import Navigation from "./Navigation"
import { MdInput } from "react-icons/md"

class MainMenu extends React.Component {
  render() {
    const { app } = this.props
    const { messages, client } = app
    return (
      <div>
        <Navigation app={app}/>
        <h1>{messages.get(["app", "name"])}</h1>
        {client.joined &&
          <div>
            <p>{messages.get(["mainMenu", "partOfAMatch"])}</p>
            <ButtonBox>
              <ActionButton text={messages.get(["mainMenu", "returnToMatch"])} onAction={this.props.onReturnToMatch}>
                <MdInput/>
              </ActionButton>
            </ButtonBox>
          </div>
        }
      </div>
    )
  }
}

export default MainMenu
