import React, { Component} from "react"
import styles from "./LabeledInput.css"

export default props => {
  return (
    <label className={styles.label}>
      <span className={styles.text}>{props.label}</span>
      <input type={props.type} value={props.value} onChange={props.onChange} className={styles.input} autoFocus={props.autoFocus}/>
    </label>
  )
}
