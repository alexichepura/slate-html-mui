type TAttributes = Record<string, any> | null
export const attributes2String = (attributes: TAttributes): string => {
  if (!attributes) {
    return ""
  }
  const attributesString = Object.entries(attributes)
    .filter(([_k, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      return `${normalizeAttributeNameToHtml(k)}="${String(v)}"`
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

    prev[normalizeAttributeNameToReact(attr.name)] = attr.value
    return prev
  }, {})

export const normalizeAttributeNameToReact = (name: string) => {
  switch (name) {
    case "class":
      return "className"
    case "srcset":
      return "srcSet"
    case "itemprop":
      return "itemProp"
    case "itemscope":
      return "itemScope"
    case "itemtype":
      return "itemType"
    default:
      return name
  }
}

export const normalizeAttributeNameToHtml = (name: string) => {
  switch (name) {
    case "className":
      return "class"
    case "srcSet":
      return "srcset"
    case "itemProp":
      return "itemprop"
    case "itemScope":
      return "itemscope"
    case "itemType":
      return "itemtype"
    default:
      return name
  }
}
