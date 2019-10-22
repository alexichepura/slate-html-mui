import React from "react"
import { render } from "react-dom"
import { plugins } from "../src/editor"
import { initial } from "./initial"
import { Value } from "slate"
import { Editor } from "slate-react"

const value = Value.fromJSON(initial)

render(
  <Editor
    placeholder="Enter some rich text..."
    value={value}
    plugins={plugins}
    spellCheck
    autoFocus
  />,
  document.getElementById("app")
)
