import { Editor, Element, Node, Transforms } from "slate"
import {
  DEFAULT_TAG,
  EHtmlBlockTag,
  EHtmlListTag,
  EHtmlMarkTag,
  EHtmlVoidTag,
  isTagActive,
} from "./format"
import { deserialize, TTagElement } from "./html"
import { wrapInlineAndText } from "./html/wrap-inline-and-text"

export const withHtml = (editor: Editor) => {
  const { insertData, isVoid, normalizeNode } = editor

  editor.isVoid = element => {
    return (element as TTagElement).tag in EHtmlVoidTag ? true : isVoid(element)
  }

  editor.insertHtmlTag = (tag: EHtmlBlockTag | EHtmlMarkTag | EHtmlVoidTag) => {
    const isActive = isTagActive(editor, tag)
    const isList = tag in EHtmlListTag

    if (tag in EHtmlMarkTag) {
      isActive ? Editor.removeMark(editor, tag) : Editor.addMark(editor, tag, true)
      return
    }

    if (tag in EHtmlBlockTag) {
      Object.keys(EHtmlListTag).forEach(tag => {
        Transforms.unwrapNodes(editor, {
          match: node => (node as TTagElement).tag === tag,
          split: true,
        })
      })

      Transforms.setNodes(editor, {
        tag: isActive ? DEFAULT_TAG : isList ? EHtmlBlockTag.li : tag,
      })

      if (!isActive && isList) {
        Transforms.wrapNodes(editor, { tag, children: [] })
      }
      return
    }

    if (tag === EHtmlVoidTag.br) {
      editor.insertText("\n")
      return
    }

    if (tag in EHtmlVoidTag) {
      Transforms.insertNodes(editor, { tag, children: [] }, { at: editor.selection as any })
      return
    }
  }

  editor.insertData = (data: DataTransfer) => {
    const html = data.getData("text/html")

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html")
      const fragment = deserialize(parsed.body) as Node[]
      const blocks = wrapInlineAndText(editor, fragment)

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
    if (Element.isElement(node) && node.tag === EHtmlBlockTag.p) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath })
          return
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry)
  }

  return editor
}
