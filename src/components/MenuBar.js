import React from "react"
import { MdArrowBack } from "react-icons/md"
import LinkButton from "./core/LinkButton"
import styles from "./MenuBar.css"

export default props => {
  return (
    <div className={styles.box}>
      <LinkButton to={props.backTo}><MdArrowBack/></LinkButton>
      <span className={styles.title}>{props.title}</span>
    </div>
  )
}
