import { Editor, Node, Transforms } from "slate"
import {
  DEFAULT_NODE_FORMAT,
  EHtmlBlockFormat,
  EHtmlListFormat,
  EHtmlTextFormat,
  isFormatActive,
} from "./format"
import { deserialize } from "./html"

export const withHtml = (editor: Editor) => {
  const { insertData } = editor

  editor.insertHtml = (format: EHtmlBlockFormat | EHtmlTextFormat) => {
    const isActive = isFormatActive(editor, format)
    const isList = format in EHtmlListFormat

    if (format in EHtmlTextFormat) {
      Editor.addMark(editor, format, true)
    }

    if (format in EHtmlBlockFormat) {
      Object.keys(EHtmlListFormat).forEach(format => {
        Transforms.unwrapNodes(editor, { match: node => node.type === format, split: true })
      })

      Transforms.setNodes(editor, {
        type: isActive ? DEFAULT_NODE_FORMAT : isList ? EHtmlBlockFormat.li : format,
      })

      if (!isActive && isList) {
        Transforms.wrapNodes(editor, { type: format, children: [] })
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
