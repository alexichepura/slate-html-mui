import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core"
import PhotoLibrary from "@material-ui/icons/PhotoLibrary"
import React, {
  CSSProperties,
  FC,
  HTMLAttributes,
  ImgHTMLAttributes,
  SourceHTMLAttributes,
  useRef,
  useState,
} from "react"
import { Editor, Node, NodeEntry, Range } from "slate"
import { RenderElementProps, useFocused, useSelected, useSlate } from "slate-react"
import { TTagElement } from "../html"
import { TSlatePlugin } from "../plugin"
import { ToolbarButton, TToolbarButtonProps } from "../toolbar-button"
import { formatTagToString, formatVoidToString, getAttributes } from "../util"
import { insertBlock } from "../util/insert-block"

export const PICTURE_TAG = "picture"

type TPictureElement = TTagElement & {
  attributes: HTMLAttributes<any>
  img: ImgHTMLAttributes<any>
  sources: SourceHTMLAttributes<any>[]
}
export type TPictureNode = Node & TPictureElement

type TSetPictureCommand = {
  element: TPictureElement
  range: Range
}

const defaults: TPictureElement = {
  tag: PICTURE_TAG,
  attributes: {},
  img: {},
  sources: [],
  children: [{ text: "" }],
}

const match = (node: Node): boolean => {
  return (node as TTagElement).tag === PICTURE_TAG
}

const isPictureActive = (editor: Editor) => {
  return !!findPicture(editor)
}
const findPictureEntry = (editor: Editor): NodeEntry<TPictureNode> => {
  const [pictureEntry] = Editor.nodes<TPictureNode>(editor, { match })
  return pictureEntry
}
const findPicture = (editor: Editor): TPictureElement | null => {
  const pictureEntry = findPictureEntry(editor)
  return pictureEntry ? pictureEntry[0] : null
}

export const isHtmlPictureElement = (
  element: TPictureElement | any
): element is TPictureElement => {
  return element.tag === PICTURE_TAG
}
const cleanAttributesMutate = (attributes: HTMLAttributes<any>) =>
  Object.entries(attributes).forEach(([key, value]) => {
    return (value === null || value === undefined) && delete (attributes as any)[key]
  })
export const HtmlPictureElement: FC<RenderElementProps> = ({ attributes, children, element }) => {
  const el: TPictureElement = element as TPictureElement
  const selected = useSelected()
  const focused = useFocused()
  const style: CSSProperties = {
    display: "inline-block",
    fontSize: 0,
    boxShadow: `${selected && focused ? "0 0 0 3px #B4D5FF" : "none"}`,
  }
  return (
    <span {...attributes}>
      <span contentEditable={false} style={style}>
        <picture {...el.attributes}>
          {el.sources.map((s, i) => (
            <source key={i} {...s} />
          ))}
          <img {...el.img} />
        </picture>
      </span>
      {children}
    </span>
  )
}

HtmlPictureElement.displayName = "HtmlPictureElement"

type TMergeState = (partState: Partial<TPictureElement>) => void

type TPictureButtonProps = {
  PictureFormDialog?: FC<TPictureFormDialogProps>
} & Omit<TToolbarButtonProps, "tooltipTitle">
export const PictureButton: FC<TPictureButtonProps> = ({
  PictureFormDialog: _PictureFormDialog,
  ...rest
}) => {
  const editor = useSlate()
  const isActive = isPictureActive(editor)
  const range = useRef<Range | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<TPictureElement>(defaults)

  const mergeState: TMergeState = partState => setState({ ...state, ...partState })

  const handleOpen = () => {
    range.current = editor.selection ? { ...editor.selection } : null
    mergeState(findPicture(editor) || defaults)
    setOpen(true)
  }

  const onOk = () => {
    const { attributes, img } = state
    cleanAttributesMutate(attributes)
    cleanAttributesMutate(img)
    if (!range.current) {
      throw new Error("Invalid range. Must be typeof Range.")
    }
    const element: TPictureElement = {
      ...state,
      attributes,
      img,
    }
    const command: TSetPictureCommand = { element, range: range.current }
    setPicture(editor, command)
    setOpen(false)
  }

  const onClose = () => {
    setOpen(false)
  }

  const updateAttribute = (name: string, value: string) =>
    mergeState({ attributes: { ...state.attributes, [name]: value } })

  const updateImgAttribute = (name: string, value: string) =>
    mergeState({ img: { ...state.img, [name]: value } })

  const updateSourceAttribute = (sourceIndex: number, name: string, value: string) => {
    mergeState({
      sources: state.sources.map((s, i) => (i === sourceIndex ? { ...s, [name]: value } : s)),
    })
  }

  const addSource = () => {
    mergeState({
      sources: [...state.sources, {}],
    })
  }

  const removeSource = (i: number) => {
    mergeState({
      sources: [...state.items.slice(0, i), ...state.items.slice(i + 1)],
    })
  }

  const PictureFormDialogComponent = _PictureFormDialog || PictureFormDialog
  return (
    <>
      <ToolbarButton
        tooltipTitle="Picture"
        color={isActive ? "primary" : "default"}
        variant={isActive ? "contained" : "text"}
        onClick={handleOpen}
        {...rest}
      >
        <PhotoLibrary />
      </ToolbarButton>
      <PictureFormDialogComponent
        open={open}
        picture={state}
        onOk={onOk}
        updateAttribute={updateAttribute}
        updateImgAttribute={updateImgAttribute}
        updateSourceAttribute={updateSourceAttribute}
        mergeState={mergeState}
        onClose={onClose}
        addSource={addSource}
        removeSource={removeSource}
      />
    </>
  )
}
PictureButton.displayName = "PictureButton"

export const isPictureTag = (element: TTagElement) => {
  return element.tag === PICTURE_TAG
}

const setPicture = (editor: Editor, command: TSetPictureCommand) => {
  const { element, range } = command
  insertBlock(editor, element, range)
}

type TUpdateSourceAttribute = (
  i: number,
  name: keyof SourceHTMLAttributes<any>,
  value: string
) => void
export type TPictureFormDialogProps = {
  picture: TPictureElement
  open: boolean
  updateAttribute: (name: keyof HTMLAttributes<any>, value: string) => void
  updateImgAttribute: (name: keyof ImgHTMLAttributes<any>, value: string) => void
  updateSourceAttribute: TUpdateSourceAttribute
  mergeState: TMergeState
  addSource: () => void
  removeSource: (i: number) => void
  onClose: () => void
  onOk: () => void
}
export const PictureFormDialog: FC<TPictureFormDialogProps> = ({
  open,
  picture,
  updateImgAttribute,
  updateSourceAttribute,
  onClose,
  removeSource,
  addSource,
  onOk,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="picture-form-dialog-title">
      <DialogTitle id="picture-form-dialog-title">Insert/Edit Picture</DialogTitle>
      <DialogContent>
        <TextField
          label="Img src"
          value={picture.img.src || ""}
          onChange={e => updateImgAttribute("src", e.target.value)}
          fullWidth
        />
        <Divider />
        <PictureSourceFields
          sources={picture.sources}
          updateSourceAttribute={updateSourceAttribute}
          removeSource={removeSource}
        />
        <Button onClick={addSource} color="primary">
          Add source
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
PictureFormDialog.displayName = "PictureFormDialog"

const PictureSourceFields: FC<{
  sources: SourceHTMLAttributes<any>[]
  updateSourceAttribute: TUpdateSourceAttribute
  removeSource: (i: number) => void
}> = ({ sources, updateSourceAttribute, removeSource }) => {
  return (
    <div>
      {sources.map((s, i) => {
        return (
          <Grid key={i} container>
            <Grid item>
              <TextField
                label="Src set"
                value={s.srcSet || ""}
                onChange={e => updateSourceAttribute(i, "srcSet", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Type"
                value={s.type || ""}
                onChange={e => updateSourceAttribute(i, "type", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid>
              <Button onClick={() => removeSource(i)} color="primary">
                Remove
              </Button>
            </Grid>
          </Grid>
        )
      })}
    </div>
  )
}

const isPicture = (el: Element | any): el is Element => {
  return el.nodeName.toLowerCase() === PICTURE_TAG
}

export const createPicturePlugin = (): TSlatePlugin => ({
  toHtml: el => {
    if (isHtmlPictureElement(el)) {
      const sources = el.sources.map(s => formatVoidToString("source", s)).join("")
      const img = formatVoidToString("img", el.img)
      return formatTagToString(PICTURE_TAG, el.attributes, sources + img)
    }
    return ""
  },
  fromHtmlElement: el => {
    if (!isPicture(el)) {
      return null
    }

    const attributes = getAttributes(el as Element)
    const children = Array.from(el.children)
    const img = children.filter(c => c.nodeName.toLowerCase() === "img").map(getAttributes)[0] || {}
    const sources = children.filter(c => c.nodeName.toLowerCase() === "source").map(getAttributes)

    const picture: TPictureElement = {
      tag: PICTURE_TAG,
      attributes,
      img,
      sources,
      children: [{ text: "" }],
    }
    return picture
  },
  extendEditor: editor => {
    const { isVoid } = editor
    editor.isVoid = element => {
      return isPictureTag(element as TTagElement) ? true : isVoid(element)
    }
  },
  RenderElement: props => {
    const element = props.element as TTagElement
    if (isHtmlPictureElement(element)) {
      return <HtmlPictureElement {...props} />
    }
    return null
  },
})
