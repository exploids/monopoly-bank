import React from "react"
import { Link } from "react-router-dom"
import styles from "./Navigation.css"

export default props => {
  const { messages, client } = props.app
  return (
    <div className={styles.box}>
      <Link to="/"><strong>{messages.get(["app", "name"])}</strong></Link>
      <Link to="/join">{messages.get(["general", "join"])}</Link>
      <Link to="/create">{messages.get(["general", "create"])}</Link>
      {client.joined && (
        <Link to="/match">{messages.get(["general", "goToMatch"])}</Link>
      )}
    </div>
  )
}
