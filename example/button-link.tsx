import React, { CSSProperties, FC, useState } from "react"
import { Editor, Element as SlateElement, Path, Range, Text, Transforms } from "slate"
import { RenderElementProps, useFocused, useSelected, useSlate } from "slate-react"
import {
  TAnchorAnyAttributes,
  ToolbarButton,
  TSerialize,
  formatTagToString,
  TDeserialize,
  getAttributes,
} from "../src"
import { CustomLinkFormDialog } from "./custom-link"

export const withButtonLink = (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return isElementButtonLink((element as any) as TButtonLinkElement) ? true : isVoid(element)
  }

  return editor
}

export const BUTTON_LINK_DATA_ATTRIBUTE = "data-article-link-button"
const dataAttributeObject = { [BUTTON_LINK_DATA_ATTRIBUTE]: "true" }

type TSetLinkCommand = {
  attributes: TAnchorAnyAttributes
  txt: string
  range: Range
}
export type THtmlLinkSlateElement = {
  txt: Text["text"]
  attributes: TAnchorAnyAttributes
  children: Text[]
}

type TButtonLinkButtonState = {
  open: boolean
  txt: string
  attributes: TAnchorAnyAttributes
  range: Range | null
}

type TButtonLinkButtonStateInitial = Omit<TButtonLinkButtonState, "open">

const defaults: TButtonLinkButtonState = {
  open: false,
  range: null,
  txt: "",
  attributes: {},
}

const cleanAttributesMutate = (attributes: TAnchorAnyAttributes) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })

export const ButtonLinkButton: FC = () => {
  const editor = useSlate()
  const isActive = isButtonLinkActive(editor)
  const [state, setState] = useState<TButtonLinkButtonState>(defaults)
  const mergeState = (partState: Partial<TButtonLinkButtonState>) =>
    setState({ ...state, ...partState })

  const handleOpen = () => {
    const linkData = getInitialLinkData(editor)
    mergeState({ open: true, ...linkData })
  }

  const onOk = () => {
    if (!state.range) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const { txt, attributes, range } = state
    cleanAttributesMutate(attributes)
    const command: TSetLinkCommand = { attributes, txt, range }
    insertButtonLink(editor, command)
    mergeState({ open: false })
  }

  const updateAttribute = (name: string, value: string) =>
    mergeState({ attributes: { ...state.attributes, [name]: value } })
  return (
    <>
      <ToolbarButton
        tooltipTitle="Button Link"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        children={"BtL"}
      />
      <CustomLinkFormDialog
        open={state.open}
        attributes={state.attributes}
        text={state.txt}
        onOk={onOk}
        updateText={txt => mergeState({ txt })}
        updateAttribute={updateAttribute}
        onClose={() => mergeState({ open: false })}
      />
    </>
  )
}
ButtonLinkButton.displayName = "ButtonLinkButton"

export const ButtonLinkElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const buttonLinkElement = (element as unknown) as TButtonLinkElement
  const selected = useSelected()
  const focused = useFocused()
  const style: CSSProperties = {
    boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
    pointerEvents: "none",
  }
  return (
    <div {...attributes} {...dataAttributeObject}>
      <div contentEditable={false} style={style}>
        <a {...buttonLinkElement.attributes}>{buttonLinkElement.txt}</a>
      </div>
      {children}
    </div>
  )
}
ButtonLinkElement.displayName = "ButtonLinkElement"

const BUTTON_LINK_TYPE = "ButtonLink"
type TButtonLinkElement = {
  type: "ButtonLink"
  txt: string
  attributes: TAnchorAnyAttributes
  children: Text[]
}
const insertButtonLink = (editor: Editor, command: TSetLinkCommand) => {
  const { txt, attributes, range } = command
  const buttonLink: TButtonLinkElement = {
    type: BUTTON_LINK_TYPE,
    txt,
    attributes,
    children: [{ text: "" }],
  }
  Transforms.setNodes(editor, buttonLink, { at: range })
}

export const isElementButtonLink = (
  el: SlateElement | TButtonLinkElement | any
): el is TButtonLinkElement => el.type === BUTTON_LINK_TYPE

const match = (n: any) => isElementButtonLink(n as TButtonLinkElement)
const isButtonLinkActive = (editor: Editor): boolean => {
  const [matched] = Editor.nodes(editor, { match })
  return Boolean(matched)
}

const findLinkEntry = (editor: Editor): [THtmlLinkSlateElement, Path] => {
  const [linkEntry] = Editor.nodes<THtmlLinkSlateElement>(editor, { match })
  return linkEntry
}
const findLink = (editor: Editor): THtmlLinkSlateElement | null => {
  const linkEntry = findLinkEntry(editor)
  return linkEntry ? linkEntry[0] : null
}

const getInitialLinkData = (editor: Editor): TButtonLinkButtonStateInitial => {
  const link = findLink(editor)

  return {
    txt: link ? link.txt : "",
    range: editor.selection ? { ...editor.selection } : null,
    attributes: link ? link.attributes : {},
  }
}

export const serializeWithButtonLink: TSerialize<TButtonLinkElement> = node => {
  if (isElementButtonLink(node)) {
    const text = formatTagToString("a", node.attributes, node.txt)
    return `<div ${BUTTON_LINK_DATA_ATTRIBUTE}="true">${text}</div>`
  }
  return ""
}
export const deserializeWithButtonLink: TDeserialize<TButtonLinkElement> = el => {
  if (el.nodeName.toLowerCase() !== "div") {
    return null
  }
  const attr = (el as Element).attributes.getNamedItem(BUTTON_LINK_DATA_ATTRIBUTE)

  if (attr && attr.value === "true") {
    const a = (el as Element).firstChild! as Element
    const link: TButtonLinkElement = {
      type: BUTTON_LINK_TYPE,
      txt: a.textContent || "",
      attributes: getAttributes(a),
      children: [{ text: "" }],
    }
    return link
  }
  return null
}
