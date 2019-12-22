import { Button } from "@material-ui/core"
import React, { FC, useCallback, useMemo, useState } from "react"
import { render } from "react-dom"
import { createEditor, Node } from "slate"
import { withHistory } from "slate-history"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import {
  deserializeHtml,
  Leaf,
  RenderElement,
  serializeHtml,
  Toolbar,
  withHtml,
  withLink,
} from "../src"
import { initial } from "./initial"

const MyEditor: FC = () => {
  const [value, setValue] = useState<Node[]>(initial)
  const saveToLocalstorage = () => {
    const str = serializeHtml(value)
    localStorage.setItem("slate-mui-value", str)
  }
  const loadFromLocalstorage = () => {
    const savedStr = localStorage.getItem("slate-mui-value") || ""
    const document = new DOMParser().parseFromString(savedStr, "text/html")
    const savedValue = deserializeHtml(document.body)

    setValue(savedValue as any)
  }
  const editor = useMemo(() => withHtml(withLink(withHistory(withReact(createEditor())))), [])
  const renderElement = useCallback(RenderElement, [])
  const renderLeaf = useCallback(Leaf, [])
  return (
    <div>
      <Button color="primary">Load example</Button>
      <Button color="primary" onClick={loadFromLocalstorage}>
        Load from localstorage
      </Button>
      <Button color="primary" onClick={saveToLocalstorage}>
        Save to localstorage
      </Button>
      <Slate
        editor={editor as ReactEditor}
        defaultValue={value}
        onChange={value => {
          setValue(value)
        }}
        value={value}
      >
        <>
          <Toolbar />
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
          />
        </>
      </Slate>
    </div>
  )
}

render(<MyEditor />, document.getElementById("app"))
