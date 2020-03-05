import { EHtmlBlock, TSlateTypeElement } from "../src/html"

export const initial: TSlateTypeElement[] = [
  {
    type: EHtmlBlock.p,
    children: [{ text: "A line of text in a paragraph." }],
  },
]

const rich =
  '<p>This is editable <strong>rich</strong> text, <em>much</em> <a href="https://www.slatejs.org" target="_blank">better</a> <a href="https://www.slatejs.org/examples/links" target="" data-custom="true">than</a> a <code>&lt;textarea&gt;</code>!</p><blockquote>A wise quote.</blockquote>'

const breaks = "<p>Try it out for yourself!</p><p>Few line breaks here:<br/>1<br/>2</p>"

const img =
  '<h2>Image</h2><img src="https://source.unsplash.com/kFrdX5IeQzI" alt="Image from unsplash"></img>'

const picture =
  '<h2>Picture</h2><picture><source srcset="https://res.cloudinary.com/eeeps/image/upload/f_webp,q_70,w_250/on_the_phone.jpg 1x,https://res.cloudinary.com/eeeps/image/upload/f_webp,q_70,w_500/on_the_phone.jpg 2x" type="image/webp"><source srcset="https://res.cloudinary.com/eeeps/image/upload/f_jpeg,q_70,w_250/on_the_phone.jpg 1x,https://res.cloudinary.com/eeeps/image/upload/f_jpeg,q_70,w_500/on_the_phone.jpg 2x"><img src="https://res.cloudinary.com/eeeps/image/upload/f_jpeg,q_70,w_250/on_the_phone.jpg"></picture>'

export const initial_string = rich + breaks + img + picture + "<p>Thanks!</p>"
