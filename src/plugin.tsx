import { Editor } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"
import { TFromHtmlElement, TToHtml } from "./html"
import { SlatePluginator } from "./pluginator"

export type TRenderElement = (props: RenderElementProps) => JSX.Element | null
export type TRenderLeaf = (props: RenderLeafProps) => JSX.Element | null
export type TExtendEditor = (editor: Editor, pluginator: SlatePluginator) => void
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

export const createBasePlugin = (): TSlatePlugin => ({
  toHtml: (node, pluginator) => {
    if (Array.isArray(node)) {
      return node.map(n => pluginator.toHtml(n)).join("")
    }

    return null
  },
  fromHtmlElement: (element, pluginator) => {
    const el: Element = element as Element

    if (el.nodeName === "BODY") {
      const firstElementChild =
        el.children && Array.from(el.children).filter(child => child.nodeName !== "META")[0]
      if (firstElementChild && firstElementChild.nodeName === "B") {
        return pluginator.fromHtmlChildNodes(firstElementChild.childNodes)
      }
      return pluginator.fromHtmlChildNodes(el.children)
    }

    if (el.nodeType === 3) {
      const text = el.textContent || ""
      return { text }
    }
    if (el.nodeType !== 1) return null
    return null
  },
})
