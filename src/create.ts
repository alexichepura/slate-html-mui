import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withLink } from "./link"
import { withHtml } from "./with-html"
import { withImg } from "./image/img"

export const createHtmlEditor = (): Editor =>
  withHtml(withImg(withLink(withHistory(withReact(createEditor())))))
