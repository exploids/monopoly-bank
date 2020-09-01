import React from "react"
import PlayerName from "./PlayerName"
import styles from "./BalanceDisplay.css"

export default props => {
  const messages = props.messages
  return (
    <div className={styles.display}>
      <div className={styles.name}><PlayerName player={props.player}/></div>
      <div className={styles.balance}>{messages.get(["game", "balanceValue"], { balance: props.player.balance })}</div>
    </div>
  )
}
