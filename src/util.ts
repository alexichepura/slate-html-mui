type TAttributes = Record<string, any> | null
export const attributes2String = (attributes: TAttributes): string => {
  if (!attributes) {
    return ""
  }
  const attributesString = Object.entries(attributes)
    .filter(([_k, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      return `${k}="${String(v)}"`
    })
    .join(" ")
  return attributesString.length > 0 ? " " + attributesString : ""
}

export const formatTagToString = (tag: string, attributes: TAttributes, children: string) => {
  return `<${tag}${attributes2String(attributes)}>${children}</${tag}>`
}
export const formatVoidToString = (tag: string, attributes: TAttributes) => {
  return `<${tag}${attributes2String(attributes)}/>`
}

export const getAttributes = (el: Element) =>
  Array.from(el.attributes).reduce<Record<string, string>>((prev, attr) => {
    if (attr.name === "style" || attr.name === "class") {
      return prev
    }
    // if (attr.name === "style") {
    //   const { style } = parseCSSText(attr.value)
    //   prev[attr.name] = style as any // TODO proper types
    //   return prev
    // }

    const name = attr.name === "class" ? "className" : attr.name === "srcset" ? "srcSet" : attr.name
    prev[name] = attr.value
    return prev
  }, {})
