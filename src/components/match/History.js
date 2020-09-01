import React from "react"
import PaymentName from "../PaymentName"
import MenuBar from "../MenuBar"

export default props => {
  const { messages } = props.app
  const match = props.app.client.match
  const players = match.players
  const history = match.history
  return (
    <div className="history">
      <MenuBar title={messages.get(["game", "history"])} backTo="/match"/>
      <table>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td><PaymentName players={players} playerId={item.from}/></td>
              <td> -- {messages.get(["game", "balanceValue"], { balance: item.amount })} -&gt; </td>
              <td><PaymentName players={players} playerId={item.to}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
