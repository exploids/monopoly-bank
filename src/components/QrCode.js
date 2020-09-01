import React from "react"
import qrcode from "qrcode"
import styles from "./QrCode.css"

export default class QrCode extends React.Component {
  constructor(props) {
    super(props)
    this.canvasReference = React.createRef()
  }
  
  componentDidMount() {
    const canvas = this.canvasReference.current
    qrcode.toCanvas(canvas, this.props.value, {
      width: canvas.clientWidth,
      margin: 0,
      color: { light: '#ffffffff' },
    })
  }
  
  render() {
    return (
      <canvas className={styles.qrcode} ref={this.canvasReference}></canvas>
    )
  }
}
