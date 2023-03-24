import WXMLParser from '@leejim/wxml-parser'
import md5 from 'md5'
const getURI = (curPath, id) => curPath + id

export const getHash = ({ x, y, width, height, Name }) => {
  return md5([x, y, width, height, Name].join('.')).slice(0, 4)
}

export const getElementsByParse = (wxml, curPath) => {
  const elements = []
  const map = { '后退': 'back', '菜单': 'menu', '最小化': 'minimize', '关闭': 'close' , '主页': 'home' }
  const parser = new WXMLParser({
    onopentag (tagName, attrs, isSelfClosing) {
      const attr = Object.create(null)
      for (let i = 0; i < attrs.length; i++) {
        attr[attrs[i]['key']] = attrs[i]['value']
      }
      if (attr['RuntimeId'] === void 0) return
      if (tagName === 'Button' && map[attr['Name']] !== void 0) return
      if (['Image', 'Text', 'Button', 'Custom'].indexOf(tagName) > -1) elements.push({ id: attr['RuntimeId'], tagName, attr, isClosed: false, URI: getURI(curPath, getHash(attr))}) 
    },
    onclosetag(tagName) {
      if (tagName === 'Custom') elements.push({ tagName, isClosed: true, URI: getURI(curPath, getHash(attr))})
    },
    ontext(text) {},
    oncomment(cmt) {},
    ontemplate(tmp) {}
  })
  try { parser.write(wxml) } catch {}
  return elements
}