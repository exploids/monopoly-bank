import React from "react"
import PlayerName from "./PlayerName"
import styles from "./PlayerItem.css"

export default props => {
  const { messages, player, showBalance } = props
  return (
    <div className={styles.box}>
      <div className={styles.name}>
        <PlayerName player={player}/>
        </div>
      {showBalance && <div className={styles.balance}>{messages.get(["game", "balanceValue"], { balance: player.balance })}</div>}
    </div>
  )
}
