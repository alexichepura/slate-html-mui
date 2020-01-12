import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withImg } from "./image/img"
import { withPicture } from "./image/picture"
import { withLink } from "./link"
import { withHtml } from "./with-html"

export const createHtmlEditor = (): Editor =>
  withHtml(withPicture(withImg(withLink(withHistory(withReact(createEditor()))))))
