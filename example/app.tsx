import { FC } from "react"
import React from "react"
import { render } from "react-dom"

const app_el = document.getElementById("app")
if (!app_el) {
  throw "No app element"
}

const App: FC = () => {
  return <div>App</div>
}

render(<App />, app_el)
