import React from "react"
import { MdDone } from "react-icons/md"
import ActionButton from "../core/ActionButton"
import LabeledInput from "../core/LabeledInput"
import PlayerItem from "../PlayerItem"
import BalanceDisplay from "../BalanceDisplay"
import ButtonBox from "../core/ButtonBox"
import MenuBar from "../MenuBar"

export default class Player extends React.Component {
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
        to: parseInt(this.props.match.params.id),
        amount: parseInt(this.state.amount)
      }
    })
  }

  render() {
    const { messages } = this.props.app
    const player = this.props.app.client.match.players[parseInt(this.props.match.params.id)]
    return (
      <div className="player-detail">
        <MenuBar title={player.name} backTo="/match"/>
        {/* <BalanceDisplay player={player} messages={messages}/> */}
        <PlayerItem player={player} messages={messages} showBalance/>
        <LabeledInput label={messages.get(["game", "moneyAmount"])} value={this.state.amount} type="number" onChange={e => this.changeAmount(e)} autoFocus/>
        <ButtonBox>
          <ActionButton text={messages.get(["game", "pay"])} onAction={() => this.pay()}>
            <MdDone/>
          </ActionButton>
        </ButtonBox>
        {/* <ButtonBox>
          <ActionButton onAction={() => this.changeSelectedPlayer(undefined)}>Close</ActionButton>
        </ButtonBox> */}
      </div>
    )
  }
}