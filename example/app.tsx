import { Button, Card, makeStyles } from "@material-ui/core"
import React, { FC, useCallback, useMemo, useState, CSSProperties } from "react"
import { render } from "react-dom"
import { createEditor, Node } from "slate"
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from "slate-react"
import { deserializeHtml, Leaf, RenderElement, serializeHtml, TTagElement, useSticky } from "../src"
import { withHtmlEditor } from "../src/create"
import {
  ButtonLinkElement,
  isElementButtonLink,
  BUTTON_LINK_DATA_ATTRIBUTE,
  withButtonLink,
} from "./button-link"
import { initial, initial_string } from "./initial"
import { CustomToolbar } from "./toolbar"

const SlateHtmlEditor: FC<{ value: TTagElement[]; setValue: (value: TTagElement[]) => void }> = ({
  value,
  setValue,
}) => {
  const editor = useMemo(() => withHtmlEditor(withButtonLink(withReact(createEditor()))), [])
  const renderElement = useCallback((props: RenderElementProps) => {
    console.log("renderElement", props.element)
    if (isElementButtonLink(props.element)) {
      return <ButtonLinkElement {...props} />
    }
    return <RenderElement {...props} />
  }, [])
  const renderLeaf = useCallback(Leaf, [])
  const [isSticky, stickyPlaceholderRef] = useSticky()

  const classes = useStyles()
  return (
    <Slate
      editor={editor as ReactEditor}
      defaultValue={value}
      onChange={value => {
        setValue(value as TTagElement[])
      }}
      value={value as Node[]}
    >
      <Card>
        <div className={classes.toolbarPlaceholder} ref={stickyPlaceholderRef}>
          <CustomToolbar
            className={classes.toolbar + (isSticky ? " " + classes.toolbarSticky : "")}
          />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
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
  theme => ({
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
    [`@global [data-custom="true"] a`]: {
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
  const [value, setValue] = useState<TTagElement[]>(initial)
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
  const loadFromSample = () => {
    const document = new DOMParser().parseFromString(initial_string, "text/html")
    const savedValue = deserializeHtml(document.body)
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
      <SlateHtmlEditor value={value} setValue={setValue} />
    </div>
  )
}
MyEditor.displayName = "MyEditor"

render(<MyEditor />, document.getElementById("app"))
