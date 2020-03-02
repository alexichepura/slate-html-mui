import escapeHtml from "escape-html"
import React, { FC } from "react"
import { Editor, Element as SlateElement, Node, Text, Transforms } from "slate"
import { ReactEditor, RenderElementProps } from "slate-react"
import {
  DEFAULT_TAG,
  EHtmlBlockTag,
  EHtmlListTag,
  EHtmlMarkTag,
  isTagBlockActive,
  isTagMarkActive,
} from "./format"
import { wrapInlineAndText } from "./html/wrap-inline-and-text"
import { TSlatePlugin } from "./plugin"
import { SlatePluginator } from "./pluginator"
import { formatTagToString, getAttributes } from "./util"
import { setBlock } from "./util/insert-block"

export type TPartialNode = Partial<Node>
export type TTagElement = {
  tag: string
  children?: TPartialNode[]
  [key: string]: any
}

export type TToHtml = (element: TPartialNode, pluginator: SlatePluginator) => string
export type TFromHtml = (html: string) => (TTagElement | TPartialNode)[]
export type TFromHtmlElement = (
  element: HTMLElement | ChildNode,
  pluginator: SlatePluginator
) => any

export type THtmlEditor = ReactEditor & {
  html: SlatePluginator
}

const isHtmlBlockElement = (element: SlateElement | TTagElement) => {
  return element.tag in EHtmlBlockTag
}
const HtmlBlockElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  return React.createElement((element as TTagElement).tag, attributes, children)
}
HtmlBlockElement.displayName = "HtmlBlockElement"

export const createHtmlPlugin = (): TSlatePlugin => ({
  toHtml: (node, pluginator) => {
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

    if (Array.isArray(node)) {
      return node.map(n => pluginator.toHtml(n)).join("")
    }

    if (node.tag in EHtmlBlockTag) {
      const children = pluginator.toHtmlgetChildren(node)
      return formatTagToString(node.tag, null, children)
    }

    const children = pluginator.toHtmlgetChildren(node)
    return children
  },
  fromHtmlElement: (element, pluginator) => {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return pluginator.fromHtmlChildNodes(firstElementChild.childNodes)
      }
      return pluginator.fromHtmlChildNodes(el.children)
    }

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null

    const tag = el.nodeName.toLowerCase()

    if (tag in EHtmlBlockTag) {
      const children = pluginator.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      if (children.length === 0) {
        children.push({ text: "" } as Text)
      }
      return { tag, attributes, children }
    }

    if (tag in EHtmlMarkTag) {
      const children = pluginator.fromHtmlChildNodes(el.childNodes)
      return children.map(child => {
        const text = typeof child === "string" ? child : child.text
        const attributes = getAttributes(el)
        return { [tag]: true, attributes, text }
      })
    }

    return null
  },
  extendEditor: (editor, pluginator) => {
    const { insertData, normalizeNode } = editor

    editor.insertData = (data: DataTransfer) => {
      const html = data.getData("text/html")

      if (html) {
        const fragment = pluginator.fromHtml(html)
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
      const node = _node as Editor | Element | TTagElement

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
    const element = props.element as TTagElement
    if (isHtmlBlockElement(element)) {
      return <HtmlBlockElement {...props} />
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
      match: node => (node as TTagElement).tag === tag,
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
