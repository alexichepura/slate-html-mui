import { Button, Card, makeStyles } from "@material-ui/core"
import React, { CSSProperties, FC, useMemo, useRef, useState } from "react"
import { render } from "react-dom"
import { createEditor, Editor, Node } from "slate"
import { withHistory } from "slate-history"
import { SlatePen, TPartialNode, TSlateTypeElement, useSticky } from "slate-pen"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { BUTTON_LINK_DATA_ATTRIBUTE } from "./button-link"
import { initial, initial_string } from "./initial"
import { createSlatePen } from "./setup"
import { CustomToolbar } from "./toolbar"

const SlateHtmlEditor: FC<{
  value: TSlateTypeElement[]
  setValue: (value: TSlateTypeElement[]) => void
  editor: Editor
  slatePen: SlatePen
}> = ({ value, setValue, editor, slatePen }) => {
  const [isSticky, stickyPlaceholderRef] = useSticky()
  const isPasteCapture = useRef<boolean>(false)
  const classes = useStyles()
  return (
    <Slate
      editor={editor as ReactEditor}
      defaultValue={value}
      onChange={(value) => {
        setValue(value as TSlateTypeElement[])
      }}
      value={value as Node[]}
    >
      <Card
        onKeyDown={(e) => {
          isPasteCapture.current = e.ctrlKey && e.shiftKey && e.keyCode === 86 ? true : false
        }}
      >
        <div className={classes.toolbarPlaceholder} ref={stickyPlaceholderRef}>
          <CustomToolbar
            className={classes.toolbar + (isSticky ? " " + classes.toolbarSticky : "")}
            editor={editor}
          />
        </div>
        <Editable
          renderElement={slatePen.RenderElement}
          renderLeaf={slatePen.RenderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          className={classes.editable}
        />
      </Card>
    </Slate>
  )
}
SlateHtmlEditor.displayName = "SlateHtmlEditor"

const useStyles = makeStyles(
  (theme) => ({
    toolbarPlaceholder: {
      height: "47px",
    },
    toolbar: {
      padding: "8px",
      backgroundColor: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(2px)",
      borderBottom: "1px solid " + theme.palette.divider,
      top: 0,
    },
    toolbarSticky: {
      position: "fixed",
      borderRight: "1px solid " + theme.palette.divider,
    },
    editable: { minHeight: "100px", padding: "8px" },
    [`@global a[data-custom="true"]`]: {
      padding: "5px 15px 5px 15px",
      backgroundColor: "#B00000",
      border: "1px solid #7F0000",
      color: "#FFF",
      textShadow: "1px 1px 4px #000",
    },
    [`@global [${BUTTON_LINK_DATA_ATTRIBUTE}="true"] a`]: {
      backgroundColor: "#32CD32",
      color: "#fff",
      textShadow: "1px 0px 1px rgba(0,0,0,0.2)",
      padding: "15px 50px",
      width: "300px",
      textAlign: "center" as CSSProperties["textAlign"],
      margin: "0 auto",
      display: "block",
    },
  }),
  { name: SlateHtmlEditor.displayName }
)

const MyEditor: FC = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const slatePen = useMemo(() => createSlatePen(editor), [])
  const [value, setValue] = useState<TSlateTypeElement[]>(initial)

  const saveToLocalstorage = () => {
    console.log("saveToLocalstorage value", value)
    const str = slatePen.toHtml(value as TPartialNode)
    console.log("saveToLocalstorage html string", str)
    localStorage.setItem("slate-mui-value", str)
  }
  const loadFromLocalstorage = () => {
    const savedStr = localStorage.getItem("slate-mui-value") || ""
    const savedValue = slatePen.fromHtml(savedStr)
    setValue(savedValue as any)
  }
  const loadFromSample = () => {
    const savedValue = slatePen.fromHtml(initial_string)
    setValue(savedValue as any)
  }
  return (
    <div>
      <Button color="primary" onClick={loadFromLocalstorage}>
        from localstorage
      </Button>
      <Button color="primary" onClick={loadFromSample}>
        from sample
      </Button>
      <Button color="primary" onClick={saveToLocalstorage}>
        to localstorage
      </Button>
      <Button color="primary" onClick={() => console.log(value)}>
        log value
      </Button>
      <SlateHtmlEditor value={value} setValue={setValue} editor={editor} slatePen={slatePen} />
    </div>
  )
}
MyEditor.displayName = "MyEditor"

render(<MyEditor />, document.getElementById("app"))
