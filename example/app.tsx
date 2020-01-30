import { Button, Card, makeStyles } from "@material-ui/core"
import React, { CSSProperties, FC, useCallback, useMemo, useState } from "react"
import { render } from "react-dom"
import { createEditor, Editor, Node } from "slate"
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from "slate-react"
import { Leaf, RenderElement, TTagElement, useSticky, withHtmlEditor } from "../src"
import {
  ButtonLinkElement,
  BUTTON_LINK_DATA_ATTRIBUTE,
  isElementButtonLink,
  withButtonLink,
} from "./button-link"
import { initial, initial_string } from "./initial"
import { CustomToolbar } from "./toolbar"

const test = `<html>
<body>
<!--StartFragment--><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-21979ce0-7fff-d173-e6a8-acaf655a443c"><ul style="margin-top:0;margin-bottom:0;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">ый раз после входа в аккаунт стима идет редирект на главную страницу с последующим обучением(можно скипнуть обучение).</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">После входа в аккаунт меня должно бросить на главную страницу на которой я смогу увидеть свой баланс, кнопку внести депозит (будет кидать на страницу инвентаря на сайте), вывод средств.</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Кнопка для связи с поддержкой в хедере (как я понимаю - по клику ведет в личный кабинет во вкладку с формой Поддержка)</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Онлайн чат (блок слева или справа нужно еще решить)</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ставки - игроки которые сделали ставку, какую сделали ставку, статус ставки - in progress, crash, win; блок справа или слева</span></p></li></ul></b><!--EndFragment-->
</body>
</html>`

const SlateHtmlEditor: FC<{
  value: TTagElement[]
  setValue: (value: TTagElement[]) => void
  editor: Editor
}> = ({ value, setValue, editor }) => {
  const renderElement = useCallback((props: RenderElementProps) => {
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
  const editor = useMemo(() => withHtmlEditor(withButtonLink(withReact(createEditor()))), [])
  const [value, setValue] = useState<TTagElement[]>(initial)

  const saveToLocalstorage = () => {
    console.log("saveToLocalstorage value", value)
    const str = editor.serializeToHtmlString(value)
    console.log("saveToLocalstorage html string", str)
    localStorage.setItem("slate-mui-value", str)
  }
  const loadFromLocalstorage = () => {
    const savedStr = localStorage.getItem("slate-mui-value") || ""
    const savedValue = editor.deserializeHtml(savedStr)
    setValue(savedValue as any)
  }
  const loadFromSample = () => {
    const savedValue = editor.deserializeHtml(test || initial_string)
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
      <SlateHtmlEditor value={value} setValue={setValue} editor={editor} />
    </div>
  )
}
MyEditor.displayName = "MyEditor"

render(<MyEditor />, document.getElementById("app"))
