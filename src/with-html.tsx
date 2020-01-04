import { Editor, Node, Transforms } from "slate"
import {
  DEFAULT_TAG,
  EHtmlBlockTag,
  EHtmlListTag,
  EHtmlMarkTag,
  isTagActive,
  EHtmlVoidTag,
} from "./format"
import { deserialize, TTagElement } from "./html"

export const withHtml = (editor: Editor) => {
  const { insertData, isVoid } = editor

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
      Transforms.insertFragment(editor, fragment)
      return
    }
    insertData(data)
  }

  return editor
}
