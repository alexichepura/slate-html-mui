import { Editor, Node } from "slate"
import {
  isFormatActive,
  EHtmlListFormat,
  EHtmlTextFormat,
  EHtmlBlockFormat,
  DEFAULT_NODE_FORMAT,
} from "./format"
import { deserialize } from "./html"

export const TOGGLE_FORMAT_COMMAND = "toggle_format"

export const withHtml = (editor: Editor) => {
  const { exec } = editor

  editor.exec = command => {
    if (command.type === TOGGLE_FORMAT_COMMAND) {
      const { format } = command
      const isActive = isFormatActive(editor, format)
      const isList = format in EHtmlListFormat

      if (format in EHtmlTextFormat) {
        Editor.setNodes(
          editor,
          { [format]: isActive ? null : true },
          { match: "text", split: true }
        )
      }

      if (format in EHtmlBlockFormat) {
        Object.keys(EHtmlListFormat).forEach(format => {
          Editor.unwrapNodes(editor, { match: { type: format }, split: true })
        })

        Editor.setNodes(editor, {
          type: isActive ? DEFAULT_NODE_FORMAT : isList ? EHtmlBlockFormat.li : format,
        })

        if (!isActive && isList) {
          Editor.wrapNodes(editor, { type: format, children: [] })
        }
      }
    } else if (command.type === "insert_data") {
      const html = command.data.getData("text/html")

      if (html) {
        const parsed = new DOMParser().parseFromString(html, "text/html")
        const fragment = deserialize(parsed.body) as Node[]
        console.log(fragment)
        Editor.insertFragment(editor, fragment)
        return
      }
    } else {
      exec(command)
    }
  }

  return editor
}
