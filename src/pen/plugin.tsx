import { Editor } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"
import { TFromHtmlElement, TToHtml } from "../html/html"
import { SlatePen } from "./pen"

export type TRenderElement = (props: RenderElementProps) => JSX.Element | null
export type TRenderLeaf = (props: RenderLeafProps) => JSX.Element | null
export type TExtendEditor = (editor: Editor, slatePen: SlatePen) => void
export type TIsActive = (editor: Editor) => boolean

export type TSlatePlugin = {
  toHtml?: TToHtml
  fromHtmlElement?: TFromHtmlElement
  extendEditor?: TExtendEditor
  RenderElement?: TRenderElement
  RenderLeaf?: TRenderLeaf
  leaf?: string
  isActive?: TIsActive
}
