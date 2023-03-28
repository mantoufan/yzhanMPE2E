import WXMLParser from '@leejim/wxml-parser'
import md5 from 'md5'
const getURI = (curPath, id) => curPath + id

export const getHash = ({ x, y, width, height, Name }) => {
  return md5([x, y, width, height, Name].join('.')).slice(0, 4)
}

export const getElementsByParse = (wxml, curPath, callback) => {
  const elements = []
  const btMap = { '后退': 'back', '菜单': 'menu', '最小化': 'minimize', '关闭': 'close' , '主页': 'home' }
  const parser = new WXMLParser({
    onopentag (tagName, attrs, isSelfClosing) {
      const attr = Object.create(null)
      for (let i = 0; i < attrs.length; i++) {
        attr[attrs[i]['key']] = attrs[i]['value']
      }
      if (attr['RuntimeId'] === void 0) return
      if (tagName === 'Button' && btMap[attr['Name']] !== void 0) return
      if ([/*'Image', */'Text', 'Button'].indexOf(tagName) > -1) {
        const element = { id: attr['RuntimeId'], tagName, attr, URI: getURI(curPath, getHash(attr)) }
        if (!!callback(element)) elements.push(element) 
      }
    },
    onclosetag(tagName) {},
    ontext(text) {},
    oncomment(cmt) {},
    ontemplate(tmp) {}
  })
  try { parser.write(wxml) } catch (error) {}
  return elements
}

