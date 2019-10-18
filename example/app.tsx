import React from "react"
import { render } from "react-dom"
import { SlateMuiEditor } from "../src/editor"
import { initial } from "./initial"
import { SlateMuiContext, SlateMui } from "../src/context"
import { Value } from "slate"

const value = Value.fromJSON(initial)
const slateMui = new SlateMui(value)

render(
  <SlateMuiContext.Provider value={slateMui}>
    <SlateMuiEditor />
  </SlateMuiContext.Provider>,
  document.getElementById("app")
)
