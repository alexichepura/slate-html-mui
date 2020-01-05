import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withLink } from "./link"
import { withHtml } from "./with-html"

export const createHtmlEditor = (): Editor =>
  withHtml(withLink(withHistory(withReact(createEditor()))))
