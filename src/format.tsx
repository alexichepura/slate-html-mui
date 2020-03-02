import { Editor } from "slate"

export enum EHtmlMarkTag {
  "b" = "b",
  "strong" = "strong",
  "code" = "code",
  "em" = "em",
  "u" = "u",
}

export enum EHtmlBlockTag {
  "p" = "p",
  "h1" = "h1",
  "h2" = "h2",
  "h3" = "h3",
  "h4" = "h4",
  "h5" = "h5",
  "h6" = "h6",
  "blockquote" = "blockquote",
  "ol" = "ol",
  "ul" = "ul",
  "li" = "li",
}

export enum EHtmlListTag {
  "ol" = "ol",
  "ul" = "ul",
}

export const DEFAULT_TAG = EHtmlBlockTag.p

export const isTagMarkActive = (editor: Editor, tag: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[tag] === true : false
}

export const isTagBlockActive = (editor: Editor, tag: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.tag === tag,
  })

  return !!match
}
