// import { shallow } from "enzyme"
import { Text } from "slate"
import { createHtmlPlugin, EHtmlMark } from "../html"

const attributes: {
  "data-slate-leaf": true
} = {
  "data-slate-leaf": true,
}

const emptyText: Text = { text: "" }

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
    children: [{ text: "1234asdf" } as Text],
    text: emptyText,
    leaf: { ...emptyText, [EHtmlMark.b]: true },
  })

  expect(result).not.toBeNull()

  // console.log(result)
  // const jsxElement = result!
  // const shallowWrapper = shallow(jsxElement)
  // console.log(shallowWrapper)

  // expect(shallowWrapper.html()).toEqual(`<span data-slate-leaf="true"><b></b></span>`)
})
