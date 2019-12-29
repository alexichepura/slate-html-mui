import { Editor, Node, Transforms } from "slate"
import { DEFAULT_TAG, EHtmlBlockTag, EHtmlListTag, EHtmlMarkTag, isTagActive } from "./format"
import { deserialize, TTagElement } from "./html"

export const withHtml = (editor: Editor) => {
  const { insertData } = editor

  editor.insertHtmlTag = (tag: EHtmlBlockTag | EHtmlMarkTag) => {
    const isActive = isTagActive(editor, tag)
    const isList = tag in EHtmlListTag

    if (tag in EHtmlMarkTag) {
      Editor.addMark(editor, tag, true)
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
