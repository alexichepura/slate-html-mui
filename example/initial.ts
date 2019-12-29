import { EHtmlBlockTag } from "../src/format"
import { TTagElement } from "../src/html"

export const initial: TTagElement[] = [
  {
    tag: EHtmlBlockTag.p,
    children: [{ text: "A line of text in a paragraph." }],
  },
]
