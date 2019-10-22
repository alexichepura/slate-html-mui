import { ValueJSON } from "slate"

export const initial: ValueJSON = {
  object: "value",
  document: {
    object: "document",
    nodes: [
      {
        object: "block",
        type: "p",
        nodes: [
          {
            object: "text",
            text: "This is editable ",
          },
          {
            object: "text",
            text: "rich",
            marks: [{ type: "b" }],
          },
          {
            object: "text",
            text: " text, ",
          },
          {
            object: "text",
            text: "much",
            marks: [{ type: "em" }],
          },
          {
            object: "text",
            text: " better than a ",
          },
          {
            object: "text",
            text: "<textarea>",
            marks: [{ type: "code" }],
          },
          {
            object: "text",
            text: "!",
          },
        ],
      },
      {
        object: "block",
        type: "p",
        nodes: [
          {
            object: "text",
            text: "Since it's rich text, you can do things like turn a selection of text ",
          },
          {
            object: "text",
            text: "strong",
            marks: [{ type: "strong" }],
          },
          {
            object: "text",
            text:
              ", or add a semantically rendered block quote in the middle of the page, like this:",
          },
        ],
      },
      {
        object: "block",
        type: "blockquote",
        nodes: [
          {
            object: "text",
            text: "A wise quote.",
          },
        ],
      },
      {
        object: "block",
        type: "p",
        nodes: [
          {
            object: "text",
            text: "Try it out for yourself!",
          },
        ],
      },
    ],
  },
}
