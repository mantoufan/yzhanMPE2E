import WXMLParser from '@leejim/wxml-parser'

export const getElementsByParse = (wxml, filter = () => true) => {
  const elements = []
  const map = { '后退': 'back', '菜单': 'menu', '最小化': 'minimize', '关闭': 'close' , '主页': 'home' }
  const parser = new WXMLParser({
    onopentag (tagName, attrs, isSelfClosing) {
      const attrObj = Object.create(null)
      for (const attr of attrs) {
        attrObj[attr['key']] = attr['value']
      }
      if (attrObj['RuntimeId'] === void 0) return
      if (tagName === 'Button' && map[attrObj['Name']] !== void 0) return
      if (filter({ tagName, attr: attrObj })) elements.push({ id: attrObj['RuntimeId'], tagName, attr: attrObj }) 
    },
    onclosetag(tagName) {},
    ontext(text) {},
    oncomment(cmt) {},
    ontemplate(tmp) {}
  })
  try { parser.write(wxml) } catch {}
  return elements
}