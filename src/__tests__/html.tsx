import renderer, { ReactTestRendererJSON, ReactTestRendererNode } from "react-test-renderer"
import { Text } from "slate"
import { createHtmlPlugin, EHtmlMark } from "../html"

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

test("createHtmlPlugin should return null", () => {
  const plugin = createHtmlPlugin()

  const result = plugin.RenderLeaf!({
    attributes,
    children: [],
    text: emptyText,
    leaf: emptyText,
  })

  expect(result).toBeNull()
})

test("createHtmlPlugin should return single mark leaf", () => {
  const plugin = createHtmlPlugin()
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

test("createHtmlPlugin should return 2 mark leafs", () => {
  const plugin = createHtmlPlugin()
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

test("createHtmlPlugin should return 3 mark leafs", () => {
  const plugin = createHtmlPlugin()
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
