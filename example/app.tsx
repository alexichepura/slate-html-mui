import React, { FC, useState } from "react"
import { render } from "react-dom"
import { plugins } from "../src/editor"
import { initial } from "./initial"
import { Value } from "slate"
import { Editor } from "slate-react"

const initialValue = Value.fromJSON(initial)

const MyEditor: FC = () => {
  const [value, setValue] = useState(initialValue)
  const onChange = ({ value }: { value: Value }) => setValue(value)
  return (
    <Editor
      placeholder="Enter some rich text..."
      onChange={onChange}
      value={value}
      plugins={plugins}
      spellCheck
      autoFocus
    />
  )
}

render(<MyEditor />, document.getElementById("app"))
