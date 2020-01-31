import { Editor, Node, Range, Transforms } from "slate"

export const insertBlock = (editor: Editor, slateElement: Partial<Node>, range: Range) => {
  const [node] = Editor.node(editor, range)
  if (node && node.text === "") {
    const [parent] = Editor.parent(editor, range)
    Transforms.unsetNodes(editor, Object.keys(parent), { at: range })
    Transforms.setNodes(editor, slateElement, { at: range })
  } else {
    Transforms.insertNodes(editor, slateElement as Node, { at: range })
  }
}
