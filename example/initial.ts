import { Node } from "slate"
import { EHtmlBlockFormat } from "../src/format"

export const initial: Node[] = [
  {
    type: EHtmlBlockFormat.p,
    children: [{ text: "A line of text in a paragraph." }],
  },
]
