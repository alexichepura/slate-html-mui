import escapeHtml from "escape-html"
import React, { createElement, FC } from "react"
import { Editor, Element as SlateElement, Node, Text, Transforms } from "slate"
import { ReactEditor, RenderElementProps } from "slate-react"
import {
  formatTagToString,
  getAttributes,
  setBlock,
  SlatePen,
  TSlatePlugin,
  wrapInlineAndText,
} from "../pen"

export enum EHtmlMarkTag {
  "b" = "b",
  "strong" = "strong",
  "code" = "code",
  "em" = "em",
  "u" = "u",
}

export enum EHtmlBlockTag {
  "p" = "p",
  "h1" = "h1",
  "h2" = "h2",
  "h3" = "h3",
  "h4" = "h4",
  "h5" = "h5",
  "h6" = "h6",
  "blockquote" = "blockquote",
  "ol" = "ol",
  "ul" = "ul",
  "li" = "li",
}

export enum EHtmlListTag {
  "ol" = "ol",
  "ul" = "ul",
}

export const DEFAULT_TAG = EHtmlBlockTag.p

export const isTagMarkActive = (editor: Editor, tag: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[tag] === true : false
}

export const isTagBlockActive = (editor: Editor, tag: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.tag === tag,
  })

  return !!match
}

export type TPartialNode = Partial<Node>
export type TSlateTypeElement = {
  type: string
  children?: TPartialNode[]
  [key: string]: any
}

export type TToHtml = (element: TPartialNode, slatePen: SlatePen) => string | null
export type TFromHtml = (html: string) => (TSlateTypeElement | TPartialNode)[]
export type TFromHtmlElement = (element: HTMLElement | ChildNode, slatePen: SlatePen) => any

export type THtmlEditor = ReactEditor & {
  html: SlatePen
}

const isHtmlBlockElement = (element: SlateElement | TSlateTypeElement) => {
  return element.type in EHtmlBlockTag
}
const HtmlBlockElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  return React.createElement((element as TSlateTypeElement).type, attributes, children)
}
HtmlBlockElement.displayName = "HtmlBlockElement"

export const createHtmlPlugin = (): TSlatePlugin => ({
  toHtml: (node, slatePen) => {
    if (Text.isText(node)) {
      const markTag = Object.entries(node).find(([k, v]) => k in EHtmlMarkTag && v === true)
      let text
      if (markTag && markTag[0]) {
        text = formatTagToString(markTag[0], null, escapeHtml(node.text))
      } else {
        text = escapeHtml(node.text)
      }
      return text.split("\n").join("<br/>")
    }

    if (node.tag in EHtmlBlockTag) {
      const children = slatePen.nodeChildrenToHtml(node)
      return formatTagToString(node.tag, null, children)
    }

    return null
  },
  fromHtmlElement: (element, slatePen) => {
    const el: Element = element as Element
    const tag = el.nodeName.toLowerCase()

    if (tag in EHtmlBlockTag) {
      const children = slatePen.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      if (children.length === 0) {
        children.push({ text: "" } as Text)
      }
      return { tag, attributes, children }
    }

    if (tag in EHtmlMarkTag) {
      const children = slatePen.fromHtmlChildNodes(el.childNodes)
      return children.map(child => {
        const text = typeof child === "string" ? child : child.text
        const attributes = getAttributes(el)
        return { [tag]: true, attributes, text }
      })
    }

    return null
  },
  extendEditor: (editor, slatePen) => {
    const { insertData, normalizeNode } = editor

    editor.insertData = (data: DataTransfer) => {
      const html = data.getData("text/html")

      if (html) {
        const fragment = slatePen.fromHtml(html)
        const blocks = wrapInlineAndText(editor, fragment as Node[])

        const [node] = Editor.node(editor, editor.selection as any)
        if (node && node.text === "") {
          Transforms.removeNodes(editor) // clean from single text node
          Transforms.insertNodes(editor, blocks as Node[])
        } else {
          Transforms.insertFragment(editor, blocks as Node[])
        }
        return
      }
      insertData(data)
    }

    editor.normalizeNode = entry => {
      const [_node, path] = entry
      const node = _node as Editor | Element | TSlateTypeElement

      // If the element is a paragraph, ensure it's children are valid.
      if (SlateElement.isElement(node) && node.tag === EHtmlBlockTag.p) {
        for (const [child, childPath] of Node.children(editor, path)) {
          if (SlateElement.isElement(child) && !editor.isInline(child)) {
            Transforms.unwrapNodes(editor, { at: childPath })
            return
          }
        }
      }

      // Fall back to the original `normalizeNode` to enforce other constraints.
      normalizeNode(entry)
    }
  },
  RenderElement: props => {
    const element = props.element as TSlateTypeElement
    if (isHtmlBlockElement(element)) {
      return <HtmlBlockElement {...props} />
    }
    return null
  },

  RenderLeaf: ({ attributes, children, leaf }) => {
    const found = Object.keys(EHtmlMarkTag).some(tag => {
      if (leaf[tag]) {
        children = createElement(tag, {}, children)
        return true
      }
      return false
    })
    if (found) {
      return <span {...attributes}>{children}</span>
    }
    return null
  },
})

export const insertHtmlMarkTag = (editor: Editor, tag: string) => {
  const isActive = isTagMarkActive(editor, tag)
  if (tag in EHtmlMarkTag) {
    isActive ? Editor.removeMark(editor, tag) : Editor.addMark(editor, tag, true)
    return
  }
}

export const insertHtmlBlockTag = (editor: Editor, tag: string) => {
  const isActive = isTagBlockActive(editor, tag)
  const isList = tag in EHtmlListTag

  Object.keys(EHtmlListTag).forEach(tag => {
    Transforms.unwrapNodes(editor, {
      match: node => (node as TSlateTypeElement).type === tag,
      split: true,
    })
  })

  setBlock(
    editor,
    {
      tag: isActive ? DEFAULT_TAG : isList ? EHtmlBlockTag.li : tag,
    },
    editor.selection!
  )

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { tag, children: [] })
  }
}
