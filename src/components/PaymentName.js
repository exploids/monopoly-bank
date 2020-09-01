import React from "react"
import PlayerName from "./PlayerName"
import styles from "./PaymentName.css"

export default props => {
  if (props.playerId >= 0) {
    return <PlayerName player={props.players[props.playerId]}/>
  } else if (props.playerId === -1) {
    return <span className={[styles.tag, styles.bank]}>Bank</span>
  } else if (props.playerId === -2) {
    return <span className={[styles.tag, styles.freeparking]}>Free Parking</span>
  } else {
    return <span>unknown id {props.playerId}</span>
  }
}
