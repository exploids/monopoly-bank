import React from "react"
import { MdArrowDownward, MdArrowUpward } from "react-icons/md"
import ActionButton from "../core/ActionButton"
import ButtonBox from "../core/ButtonBox"
import LabeledInput from "../core/LabeledInput"
import MenuBar from "../MenuBar"
import { BANK_ID } from "../../client"

export default class Bank extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: ""
    }
  }

  changeAmount(event) {
    this.setState({ amount: event.target.value })
  }

  pay() {
    this.props.onCommand({
      name: "pay",
      parameters: {
        to: BANK_ID,
        amount: parseInt(this.state.amount)
      }
    })
  }

  take() {
    this.props.onCommand({
      name: "take",
      parameters: {
        amount: parseInt(this.state.amount)
      }
    })
  }

  render() {
    const { messages } = this.props.app
    return (
      <div>
        <MenuBar title={messages.get(["game", "bank"])} backTo="/match"/>
        <LabeledInput label="Amount" value={this.state.amount} type="number" onChange={e => this.changeAmount(e)}/>
        <ButtonBox>
          <ActionButton text={messages.get(["game", "pay"])} onAction={() => this.pay()}><MdArrowUpward/></ActionButton>
          <ActionButton text={messages.get(["game", "take"])} onAction={() => this.take()}><MdArrowDownward/></ActionButton>
        </ButtonBox>
        {/* <ButtonBox>
          <ActionButton onAction={() => this.changeSelectedPlayer(undefined)}>Close</ActionButton>
        </ButtonBox> */}
      </div>
    )
  }
}
