import { Editor, Element, Node, Text } from "slate"
import { EHtmlBlockTag, TSlateTypeElement } from "../html/html"

// https://github.com/ianstormtaylor/slate/issues/3457
export const wrapInlineAndText = (editor: Editor, fragment: Node[]): TSlateTypeElement[] => {
  let non_blocks: (Text | Element)[] = []
  const blocks: TSlateTypeElement[] = []

  const pushNewBlock = () => {
    if (non_blocks.length === 0) {
      return
    }
    blocks.push({
      type: EHtmlBlockTag.p,
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
