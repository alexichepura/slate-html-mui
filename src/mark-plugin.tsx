import { isKeyHotkey } from "is-hotkey"
import React from "react"
import { Plugin } from "slate-react"

type TMarkPluginOptions = {
  type: string
  hotkey?: string
  component?: React.ElementType<any>
}
export const MarkPlugin = (options: TMarkPluginOptions): Plugin => {
  const { type, hotkey, component } = options
  const plugin: Plugin = {
    renderMark: (props, _editor, next) => {
      const { children, mark, attributes } = props
      if (mark.type === type) {
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
  if (hotkey) {
    plugin.onKeyDown = (event, editor, next) => {
      if (isKeyHotkey(hotkey)) {
        event.preventDefault()
        editor.toggleMark(type)
      } else {
        return next()
      }
    }
  }
  return plugin
}
