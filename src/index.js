import React from "react"
import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('service worker registered: ', registration)
    }).catch(registrationError => {
      console.log('service worker registration failed: ', registrationError)
    })
  })
}

render(<BrowserRouter><App/></BrowserRouter>, document.getElementById("app"))
