import React from "react"
import styles from "./ActionButton.css"

export default function (props) {
  return (
    <button type="button" onClick={props.onAction} className={styles.button}>
      {props.children}
      <span>{props.text}</span>
    </button>
  )
}
