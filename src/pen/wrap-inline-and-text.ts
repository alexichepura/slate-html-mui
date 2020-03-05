import { Editor, Element, Node, Text } from "slate"
import { EHtmlBlockTag, TTagElement } from "../html/html"

// https://github.com/ianstormtaylor/slate/issues/3457
export const wrapInlineAndText = (editor: Editor, fragment: Node[]): TTagElement[] => {
  let non_blocks: (Text | Element)[] = []
  const blocks: TTagElement[] = []

  const pushNewBlock = () => {
    if (non_blocks.length === 0) {
      return
    }
    blocks.push({
      tag: EHtmlBlockTag.p,
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
