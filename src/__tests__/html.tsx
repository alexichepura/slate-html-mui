import renderer, { ReactTestRendererJSON, ReactTestRendererNode } from "react-test-renderer"
import { Text } from "slate"
import { createHtmlPlugin, EHtmlMark } from "../html"
import { SlatePen } from "slate-pen"
import { createEditor } from "slate"

const attributes: {
  "data-slate-leaf": true
} = {
  "data-slate-leaf": true,
}

const createReactTestRendererJSON = (
  type: string,
  props: { [propName: string]: any },
  children: null | ReactTestRendererNode[]
): ReactTestRendererJSON => {
  return { type, props, children }
}

const createLeafJson = (type: string, children: any): ReactTestRendererJSON => {
  return createReactTestRendererJSON("span", attributes, [{ type, props: {}, children }])
}

const emptyText: Text = { text: "" }
const testText = "testText"

describe("RenderLeaf", () => {
  const plugin = createHtmlPlugin()
  test("RenderLeaf should return null", () => {
    const result = plugin.RenderLeaf!({
      attributes,
      children: [],
      text: emptyText,
      leaf: emptyText,
    })

    expect(result).toBeNull()
  })

  test("RenderLeaf should return single mark leaf", () => {
    const result = plugin.RenderLeaf!({
      attributes,
      text: emptyText,
      children: testText,
      leaf: { ...emptyText, [EHtmlMark.b]: true },
    })
    expect(result).not.toBeNull()

    const component = renderer.create(result!)
    const tree = component.toJSON()
    const expected = createLeafJson(EHtmlMark.b, [testText])
    expect(tree).toEqual(expected)
  })

  test("RenderLeaf should return 2 mark leafs", () => {
    const result = plugin.RenderLeaf!({
      attributes,
      text: emptyText,
      children: testText,
      leaf: { ...emptyText, [EHtmlMark.b]: true, [EHtmlMark.u]: true },
    })
    expect(result).not.toBeNull()

    const component = renderer.create(result!)
    const tree = component.toJSON()
    const expected = createLeafJson(EHtmlMark.u, [
      createReactTestRendererJSON(EHtmlMark.b, {}, [testText]),
    ])
    expect(tree).toEqual(expected)
  })

  test("RenderLeaf should return 3 mark leafs", () => {
    const result = plugin.RenderLeaf!({
      attributes,
      text: emptyText,
      children: testText,
      leaf: { ...emptyText, [EHtmlMark.b]: true, [EHtmlMark.u]: true, [EHtmlMark.em]: true },
    })
    expect(result).not.toBeNull()

    const component = renderer.create(result!)
    const tree = component.toJSON()
    const expected = createLeafJson(EHtmlMark.u, [
      createReactTestRendererJSON(EHtmlMark.em, {}, [
        createReactTestRendererJSON(EHtmlMark.b, {}, [testText]),
      ]),
    ])
    expect(tree).toEqual(expected)
  })
})

describe("toHtml", () => {
  const editor = createEditor()
  const plugin = createHtmlPlugin()
  const slatePen = new SlatePen({ editor, plugins: [plugin] })

  test("toHtml should return null", () => {
    const result = plugin.toHtml!({}, slatePen)
    expect(result).toBeNull()

    const resultUnknown = plugin.toHtml!({ type: "unknown" }, slatePen)
    expect(resultUnknown).toBeNull()

    const resultDiv = plugin.toHtml!({ type: "div" }, slatePen)
    expect(resultDiv).toBeNull()
  })

  test("toHtml should return 1 element mark string", () => {
    const result = plugin.toHtml!({ [EHtmlMark.em]: true, text: testText }, slatePen)
    expect(result).toEqual(`<em>${testText}</em>`)
  })
  test("toHtml should return 2 elements mark string", () => {
    const result = plugin.toHtml!(
      { [EHtmlMark.b]: true, [EHtmlMark.em]: true, text: testText },
      slatePen
    )
    expect(result).toEqual(`<em><b>${testText}</b></em>`)
  })
  test("toHtml should return 3 elements mark string", () => {
    const result = plugin.toHtml!(
      { [EHtmlMark.u]: true, [EHtmlMark.b]: true, [EHtmlMark.em]: true, text: testText },
      slatePen
    )
    expect(result).toEqual(`<em><b><u>${testText}</u></b></em>`)
  })
})
