import React from "react"
import { Plugin } from "slate-react"

type TBlockPluginOptions = {
  type: string
  component?: React.ElementType<any>
}
export const BlockPlugin = (options: TBlockPluginOptions): Plugin => {
  const { type, component } = options
  const plugin: Plugin = {
    renderBlock: (props, _editor, next) => {
      const { children, attributes, node } = props
      if (node.type === type) {
        if (component) {
          return React.createElement(component, attributes, children)
        } else {
          throw "Nothing to render"
        }
      } else {
        return next()
      }
    },
  }
  return plugin
}
