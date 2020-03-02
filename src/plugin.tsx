import { Editor } from "slate"
import { RenderElementProps } from "slate-react"
import { TFromHtmlElement, TToHtml } from "./html"
import { SlatePluginator } from "./pluginator"

export type TRenderElement = (props: RenderElementProps) => JSX.Element | null
export type TExtendEditor = (editor: Editor, pluginator: SlatePluginator) => void
export type TIsActive = (editor: Editor) => boolean

export type TSlatePlugin = {
  toHtml?: TToHtml
  fromHtmlElement?: TFromHtmlElement
  extendEditor?: TExtendEditor
  RenderElement?: TRenderElement
  leaf?: string
  isActive?: TIsActive
}
