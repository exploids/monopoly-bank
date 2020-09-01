import React from "react"
import styles from "./PlayerName.css"

export default props => {
  return (
    <span>
      <span className="text--highlight">{props.player ? props.player.name : ""}</span>
      {/*<span class="tag bank" v-if="props.player ? props.player.bank : false">Banker</span>*/}
      {(props.player ? props.player.absent : false) &&
        <span className={[styles.tag, styles.absent].join(" ")}>Absent</span>
      }
    </span>
  )
}
