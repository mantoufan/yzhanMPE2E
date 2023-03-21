import WXMLParser from '@leejim/wxml-parser'

export const getElementsByParse = wxml => {
  const elements = Object.create(null)
  const parser = new WXMLParser({
    onopentag (tagname, attrs, isSelfClosing) {
      const runtimeObj =  attrs.find(({ key, value }) => {
        if (key === 'RuntimeId' && value) return true
      })
      if (runtimeObj === void 0) return
      if (elements[tagname] === void 0) elements[tagname] = []
      elements[tagname].push(runtimeObj['value'])
    },
    onclosetag(tagname) {},
    ontext(text) {},
    oncomment(cmt) {},
    ontemplate(tmp) {}
  })
  try { parser.write(wxml) } catch {}
  return elements
}