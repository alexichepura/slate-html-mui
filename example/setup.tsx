import { Editor } from "slate"
import { SlatePluginator } from "../src"
import { createHtmlPlugin } from "../src/html"
import { createBrPlugin } from "../src/html/br"
import { createImgPlugin } from "../src/image/img"
import { createPicturePlugin } from "../src/image/picture"
import { createAnchorPlugin } from "../src/link"
import { createBasePlugin } from "../src/plugin"
import { createButtonLinkPlugin } from "./button-link"

export const createPluginator = (editor: Editor) =>
  new SlatePluginator({
    editor,
    plugins: [
      createBasePlugin(),
      createHtmlPlugin(),
      createImgPlugin(),
      createPicturePlugin(),
      createAnchorPlugin(),
      createButtonLinkPlugin(),
      createBrPlugin(),
    ],
  })
