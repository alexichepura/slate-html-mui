import { Editor } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"
import { SlatePen } from "./pen"

export type TRenderElement = (props: RenderElementProps) => JSX.Element | null
export type TRenderLeaf = (props: RenderLeafProps) => JSX.Element | null
export type TExtendEditor = (editor: Editor, slatePen: SlatePen) => void

export type TPartialNode = Partial<Editor> | Partial<Element> | Partial<Text>
export type TSlateTypeElement = {
  type: string
  children?: TPartialNode[]
  // [key: string]: any
}

export type TToHtml<T extends TPartialNode = TPartialNode> = (
  element: T,
  slatePen: SlatePen
) => string | null
export type TFromHtml = (htmlString: string) => (TSlateTypeElement | TPartialNode)[]
export type TFromHtmlElement = (htmlElement: HTMLElement, slatePen: SlatePen) => any

export type TSlatePlugin<T = TPartialNode> = {
  toHtml?: TToHtml<T>
  fromHtmlElement?: TFromHtmlElement
  extendEditor?: TExtendEditor
  RenderElement?: TRenderElement
  RenderLeaf?: TRenderLeaf
}

export const isSlateTypeElement = (el: any): el is TSlateTypeElement => {
  return el && typeof el.type === "string"
}
