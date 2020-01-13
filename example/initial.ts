import { EHtmlBlockTag } from "../src/format"
import { TTagElement } from "../src/html"

export const initial: TTagElement[] = [
  {
    tag: EHtmlBlockTag.p,
    children: [{ text: "A line of text in a paragraph." }],
  },
]

export const initial_string =
  '<p>This is editable <strong>rich</strong> text, <em>much</em> <a href="https://www.slatejs.org" title="" target="_blank">better</a> <a href="https://www.slatejs.org/examples/links" title="" target="" data-button="true">than</a> a <code>&lt;textarea&gt;</code>!</p><p>Since it&#39;s rich text, you can do things like turn a selection of text <strong>bold</strong>, or add a semantically rendered block quote in the middle of the page, like this:</p><blockquote>A wise quote.</blockquote><p>Try it out for yourself!</p><p>Few line breaks here:<br/>1<br/>2</p><h2>Image</h2><img src="https://source.unsplash.com/kFrdX5IeQzI" alt="Image from unsplash"></img>'
