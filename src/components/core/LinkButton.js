import React from "react"
import styles from "./LinkButton.css"
import { Link } from "react-router-dom"

export default function (props) {
  const classNames = [styles.button]
  if (props.iconPosition === "top") {
    classNames.push(styles.iconTop)
  }
  return (
    <Link to={props.to} className={classNames.join(" ")}>
      {props.children}
      <span>{props.text}</span>
    </Link>
  )
}
