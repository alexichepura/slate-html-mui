import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withLink } from "./link"
import { withHtml } from "./with-html"
import { withImage } from "./image/image"

export const createHtmlEditor = (): Editor =>
  withHtml(withImage(withLink(withHistory(withReact(createEditor())))))
