import escapeHtml from "escape-html"
import React, { createElement, FC } from "react"
import { Editor, Element as SlateElement, Node, Text, Transforms } from "slate"
import {
  formatTagToString,
  getAttributes,
  isSlateTypeElement,
  setBlock,
  SlatePen,
  TSlatePlugin,
  TSlateTypeElement,
  wrapInlineAndText,
} from "slate-pen"
import { ReactEditor, RenderElementProps } from "slate-react"

export enum EHtmlMark {
  "b" = "b",
  "strong" = "strong",
  "code" = "code",
  "em" = "em",
  "u" = "u",
}

export enum EHtmlBlock {
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

export const DEFAULT_TAG = EHtmlBlock.p

export const isMarkActive = (editor: Editor, type: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[type] === true : false
}

export const isBlockActive = (editor: Editor, type: string) => {
  const [match] = Editor.nodes(editor, {
    match: (node) => isSlateTypeElement(node) && node.type === type,
  })

  return !!match
}

export type THtmlEditor = ReactEditor & {
  html: SlatePen
}

const isHtmlBlockElement = (element: SlateElement | TSlateTypeElement) => {
  return typeof element.type === "string" && element.type in EHtmlBlock
}
const HtmlBlockElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  return React.createElement((element as TSlateTypeElement).type, attributes, children)
}
HtmlBlockElement.displayName = "HtmlBlockElement"

export const createHtmlPlugin = (): TSlatePlugin<TSlateTypeElement | any> => ({
  // TODO remove any (or split to htmlBlockPlugin and htmlMarkPlugin)
  toHtml: (node, slatePen) => {
    if (Text.isText(node)) {
      const marks = Object.entries(node).filter(([k, v]) => k in EHtmlMark && v === true)
      let text: string = ""
      if (marks.length > 0) {
        marks.forEach(([mark]) => {
          text = formatTagToString(mark, null, text || escapeHtml(node.text))
        })
      } else {
        text = escapeHtml(node.text)
      }
      return text.split("\n").join("<br/>")
    }

    if (isSlateTypeElement(node) && node.type in EHtmlBlock) {
      const children = slatePen.nodeChildrenToHtml(node)
      return formatTagToString(node.type, null, children)
    }

    return null
  },
  fromHtmlElement: (el, slatePen) => {
    const type = el.nodeName.toLowerCase()

    if (type in EHtmlBlock) {
      const children = slatePen.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      if (children.length === 0) {
        children.push({ text: "" })
      }
      return { type, attributes, children }
    }

    if (type in EHtmlMark) {
      const children = slatePen.fromHtmlChildNodes(el.childNodes)
      const attributes = getAttributes(el)
      const marks = children.map((child) => {
        return { [type]: true, ...child, attributes }
      })
      return marks
    }

    return null
  },
  extendEditor: (editor, slatePen) => {
    const { insertData, normalizeNode } = editor

    editor.insertData = (data: DataTransfer) => {
      const html = data.getData("text/html")

      if (html) {
        const fragment = slatePen.fromHtml(html)
        const blocks = wrapInlineAndText(editor, fragment as Node[], EHtmlBlock.p)

        const [node] = Editor.node(editor, editor.selection as any)
        if (node && node.text === "") {
          Transforms.removeNodes(editor) // clean from single text node
          Transforms.insertNodes(editor, blocks as Node[])
        } else {
          Transforms.insertFragment(editor, blocks as Node[])
        }
        return
      }
      typeof insertData === "function" && insertData(data)
    }

    editor.normalizeNode = (entry) => {
      const [node, path] = entry
      // If the element is a paragraph, ensure it's children are valid.
      if (SlateElement.isElement(node) && isSlateTypeElement(node) && node.type === EHtmlBlock.p) {
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
  RenderElement: (props) => {
    if (isHtmlBlockElement(props.element)) {
      return <HtmlBlockElement {...props} />
    }
    return null
  },
  RenderLeaf: ({ attributes, children, leaf }) => {
    const marks = Object.keys(EHtmlMark).filter((mark) => leaf[mark])
    marks.forEach((mark) => {
      children = createElement(mark, {}, children)
    })
    if (marks.length > 0) {
      return <span {...attributes}>{children}</span>
    }
    return null
  },
})

export const insertHtmlMark = (editor: Editor, mark: string): void => {
  const isActive = isMarkActive(editor, mark)
  if (isActive) {
    Editor.removeMark(editor, mark)
  } else {
    Editor.addMark(editor, mark, true)
  }
}

export const insertHtmlBlock = (editor: Editor, type: string) => {
  const isActive = isBlockActive(editor, type)
  const isList = type in EHtmlListTag

  Object.keys(EHtmlListTag).forEach((type) => {
    Transforms.unwrapNodes(editor, {
      match: (node) => isSlateTypeElement(node) && node.type === type,
      split: true,
    })
  })

  setBlock(
    editor,
    {
      type: isActive ? DEFAULT_TAG : isList ? EHtmlBlock.li : type,
    },
    editor.selection!
  )

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type, children: [] })
  }
}
