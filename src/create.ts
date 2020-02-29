import { createEditor, Editor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withImg } from "./image/img"
import { withPicture } from "./image/picture"
import { withLink } from "./link"
import { withHtml } from "./with-html"
import { THtmlEditor } from "./html"

export const createHtmlEditor = (): THtmlEditor =>
  withPicture(withImg(withLink(withHtml(withHistory(withReact(createEditor()))))))

export const withHtmlEditor = (editor: Editor): THtmlEditor =>
  withPicture(withImg(withLink(withHtml(withHistory(editor)))))
