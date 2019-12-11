import { Button } from "@material-ui/core"
import React, { FC, useCallback, useMemo, useState } from "react"
import { render } from "react-dom"
import { createEditor, Range, Node } from "slate"
import { withHistory } from "slate-history"
import { Editable, Slate, withReact, RenderElementProps } from "slate-react"
import { Toolbar } from "../src/toolbar"
import { deserialize, serialize } from "../src/html"
import { initial } from "./initial"
import { withRichText } from "../src/with-rich-text"
import { isHtmlBlockElement, Leaf, HtmlBlockElement } from "../src/format"
import { withLink, isHtmlAnchorElement, HtmlAnchorElement } from "../src/link"

const RenderElement = (props: RenderElementProps) => {
  if (isHtmlBlockElement(props.element)) {
    return <HtmlBlockElement {...props} />
  }
  if (isHtmlAnchorElement(props.element)) {
    return <HtmlAnchorElement {...props} />
  }
  return <p>INVALID ELEMENT</p>
}

const MyEditor: FC = () => {
  const [value, setValue] = useState<Node[]>(initial)
  const [selection, setSelection] = useState<Range | null>(null)
  const saveToLocalstorage = () => {
    const str = serialize(value)
    localStorage.setItem("slate-mui-value", str)
  }
  const loadFromLocalstorage = () => {
    const savedStr = localStorage.getItem("slate-mui-value") || ""
    const document = new DOMParser().parseFromString(savedStr, "text/html")
    const savedValue = deserialize(document.body)

    setValue(savedValue as any)
  }
  const editor = useMemo(() => withRichText(withLink(withHistory(withReact(createEditor())))), [])
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
        editor={editor}
        defaultValue={value}
        onChange={(value, selection) => {
          setValue(value)
          setSelection(selection)
        }}
        value={value}
        selection={selection}
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
