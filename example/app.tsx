import React, { FC, useState } from "react"
import { render } from "react-dom"
import { plugins } from "../src/editor"
import { initial } from "./initial"
import { Value } from "slate"
import { Editor } from "slate-react"
import { Button } from "@material-ui/core"
import { HTML_RULES } from "../src/html"
import Html from "slate-html-serializer"

export const serializer = new Html({ rules: HTML_RULES })

const initialValue = Value.fromJSON(initial)

const MyEditor: FC = () => {
  const [value, setValue] = useState(initialValue)
  const onChange = ({ value }: { value: Value }) => setValue(value)
  const saveToLocalstorage = () => {
    const str = serializer.serialize(value)
    localStorage.setItem("slate-mui-value", str)
  }
  const loadFromLocalstorage = () => {
    const savedStr = localStorage.getItem("slate-mui-value") || ""
    const savedValue = serializer.deserialize(savedStr)
    setValue(savedValue)
  }
  return (
    <div>
      <Button variant="contained" color="primary">
        Load example
      </Button>
      <Button variant="contained" color="primary" onClick={loadFromLocalstorage}>
        Load from localstorage
      </Button>
      <Button variant="contained" color="primary" onClick={saveToLocalstorage}>
        Save to localstorage
      </Button>
      <Editor
        placeholder="Enter some rich text..."
        onChange={onChange}
        value={value}
        plugins={plugins}
        spellCheck
        autoFocus
      />
    </div>
  )
}

render(<MyEditor />, document.getElementById("app"))
