import React from "react"
import { Link } from "react-router-dom"
import { MdAccountBalance, MdLocalParking, MdHistory } from "react-icons/md"
import ActionButton from "../core/ActionButton"
import ButtonBox from "../core/ButtonBox"
import LabeledInput from "../core/LabeledInput"
import PlayerName from "../PlayerName"
import PlayerItem from "../PlayerItem"
import LinkButton from "../core/LinkButton"
import MenuBar from "../MenuBar"

export default props => {
  const { messages } = props.app
  const otherPlayers = props.app.client.match.players
    .filter(player => player.id !== props.app.client.playerId)
    .sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
  return (
    <div className="overview">
      <MenuBar title={messages.get(["game", "overview"])} backTo="/"/>
      <ButtonBox>
        <LinkButton text={messages.get(["game", "bank"])} to="/match/bank"><MdAccountBalance/></LinkButton>
        <LinkButton text={messages.get(["game", "freeParking"])} to="/match/freeparking"><MdLocalParking/></LinkButton>
        <LinkButton text={messages.get(["game", "history"])} to="/match/history"><MdHistory/></LinkButton>
      </ButtonBox>
      {/* <div>
        <LabeledInput label="Amount" type="number" value={this.state.takeAmount} onChange={e => this.changeTakeAmount(e)}/>
        <ActionButton onAction={() => this.take()}>{messages.get(["game", "takeFromBank"])}</ActionButton>
        <ActionButton onAction={() => this.take()}>{messages.get(["game", "payToBank"])}</ActionButton>
        <ActionButton onAction={() => this.take()}>{messages.get(["game", "takeFreeParking"])}</ActionButton>
        <ActionButton onAction={() => this.take()}>{messages.get(["game", "putFreeParking"])}</ActionButton>
      </div> */}
      <div className="others">
        {otherPlayers.map(player => (
          <Link key={player.id} to={`/match/player/${player.id}`}>
            <PlayerItem messages={messages} player={player} showBalance={true}/>
          </Link>
        ))}
      </div>
    </div>
  )
}
