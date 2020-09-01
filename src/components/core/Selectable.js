import React from "react"
import styles from "./Selectable.css"

export default props => {
  return (
    <div onClick={props.onSelect} className={props.selected ? styles.selected : styles.unselected}>
      {props.children}
    </div>
  )
}