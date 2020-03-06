import { Editor, Node, Range, Transforms } from "slate"
import { TPartialNode } from "./plugin"

export const insertBlock = (editor: Editor, slateElement: TPartialNode, range: Range) => {
  const [node] = Editor.node(editor, range)
  if (node && node.text === "") {
    const [parent] = Editor.parent(editor, range)
    Transforms.unsetNodes(editor, Object.keys(parent), { at: range })
    Transforms.setNodes(editor, slateElement, { at: range })
  } else {
    Transforms.insertNodes(editor, slateElement as Node, { at: range })
  }
}

export const setBlock = (editor: Editor, slateElement: TPartialNode, range: Range) => {
  const [node] = Editor.node(editor, range)
  if (!Editor.isEditor(node)) {
    const [parent] = Editor.parent(editor, range)
    Transforms.unsetNodes(editor, Object.keys(parent), { at: range })
  }
  Transforms.setNodes(editor, slateElement, { at: range })
}
