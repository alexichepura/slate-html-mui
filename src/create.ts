import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withLink } from "./link"
import { withHtml } from "./with-html"

export const createHtmlEditor = (): Editor =>
  withLink(withHtml(withHistory(withReact(createEditor()))))

export const withHtmlEditor = (editor: Editor): Editor => withLink(withHtml(withHistory(editor)))
