import { Editor } from "slate"
import { RenderElementProps } from "slate-react"
import { TFromHtmlElement, TToHtml } from "./html"

export type TRenderElement = (props: RenderElementProps) => JSX.Element | null

export type TSlatePlugin = {
  toHtml?: TToHtml
  fromHtmlElement?: TFromHtmlElement
  extendEditor?: (editor: Editor) => Editor
  RenderElement?: TRenderElement
  leaf?: string
}
