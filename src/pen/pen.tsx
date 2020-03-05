import React, { createElement } from "react"
import { Editor } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"
import { TFromHtml, TFromHtmlElement, THtmlEditor, TPartialNode, TToHtml } from "../html/html"
import { TRenderElement, TRenderLeaf, TSlatePlugin } from "./plugin"

type TSlatePenInit = {
  editor: Editor
  plugins?: TSlatePlugin[]
}

export class SlatePen {
  editor: THtmlEditor
  private _plugins: TSlatePlugin[] = []
  private _plugins_RenderElement: TRenderElement[] = []
  private _plugins_RenderLeaf: TRenderLeaf[] = []
  private _plugins_fromHtmlElement: TFromHtmlElement[] = []
  private _plugins_toHtml: TToHtml[] = []

  constructor(init: TSlatePenInit) {
    this.editor = init.editor as THtmlEditor
    this.editor.html = this
    this._plugins_toHtml.push()
    if (init.plugins) {
      init.plugins.forEach(this.addPlugin)
    }
  }

  addPlugin = (plugin: TSlatePlugin) => {
    this._plugins.push(plugin)
    if (plugin.extendEditor) {
      plugin.extendEditor(this.editor, this)
    }
    if (plugin.RenderElement) {
      this._plugins_RenderElement.push(plugin.RenderElement)
    }
    if (plugin.RenderLeaf) {
      this._plugins_RenderLeaf.push(plugin.RenderLeaf)
    }
    if (plugin.fromHtmlElement) {
      this._plugins_fromHtmlElement.push(plugin.fromHtmlElement)
    }
    if (plugin.toHtml) {
      this._plugins_toHtml.push(plugin.toHtml)
    }
  }

  RenderElement = (props: RenderElementProps) => {
    const Element = this._plugins_RenderElement.find(r => {
      return r(props)
    })
    if (Element) {
      return createElement(Element, props)
    }
    console.warn("INVALID ELEMENT", props)
    return <p>INVALID ELEMENT</p>
  }

  RenderLeaf = (props: RenderLeafProps): JSX.Element => {
    let found
    this._plugins_RenderLeaf.some(renderLeaf => {
      const leaf = renderLeaf(props)
      if (leaf) {
        found = leaf
        return true
      }
      return false
    })
    if (found) {
      return found
    }
    return <span {...props.attributes}>{props.children}</span>
  }

  fromHtmlElement = (element: HTMLElement | ChildNode): any => {
    let node = null
    this._plugins_fromHtmlElement.some(from => {
      const _node = from(element, this)
      if (_node) {
        node = _node
        return true
      }
      return false
    })
    return node
  }

  toHtml = (node: TPartialNode) => {
    let html = ""
    this._plugins_toHtml.some(to => {
      const _html = to(node, this)
      if (_html === null) {
        return false
      } else {
        html = _html
        return true
      }
    })
    return html
  }

  fromHtml: TFromHtml = html => {
    const parsed = new DOMParser().parseFromString(html, "text/html")
    return this.fromHtmlElement(parsed.body)
  }

  fromHtmlChildNodes = (nodes: NodeListOf<ChildNode> | HTMLCollection) => {
    return Array.from(nodes)
      .map(this.fromHtmlElement)
      .flat()
  }

  nodeChildrenToHtml = (node: TPartialNode) => {
    const children =
      (Editor.isBlock(this.editor, node) || Editor.isInline(this.editor, node)) && node.children
        ? node.children.map(this.toHtml).join("")
        : ""
    return children
  }
}
