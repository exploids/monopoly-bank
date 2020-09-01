import React, { Component} from "react"
import styles from "./ButtonBox.css"

export default function (props) {
  return (
    <div className={styles.box}>
      {props.children}
    </div>
  )
}
