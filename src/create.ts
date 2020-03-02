import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

export const createHtmlEditor = (): Editor => withHistory(withReact(createEditor()))

export const withHtmlEditor = (editor: Editor): Editor => withHistory(editor)
