import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withHtml } from "./with-html"

export const createHtmlEditor = (): Editor => withHtml(withHistory(withReact(createEditor())))

export const withHtmlEditor = (editor: Editor): Editor => withHtml(withHistory(editor))
