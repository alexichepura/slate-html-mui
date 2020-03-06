import { Editor, Element, Node, Text } from "slate"

// https://github.com/ianstormtaylor/slate/issues/3457
export const wrapInlineAndText = (
  editor: Editor,
  fragment: Node[],
  defaultType: string
): Element[] => {
  let non_blocks: (Text | Element)[] = []
  const blocks: Element[] = []

  const pushNewBlock = () => {
    if (non_blocks.length === 0) {
      return
    }
    blocks.push({
      type: defaultType,
      children: non_blocks,
    })
    non_blocks = []
  }

  fragment.forEach(f => {
    if (Text.isText(f) || Editor.isInline(editor, f)) {
      non_blocks.push(f)
    } else {
      pushNewBlock()
      blocks.push(f)
    }
  })

  pushNewBlock()

  return blocks
}
