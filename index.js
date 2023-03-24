import { PROXY_CONF } from './config/conf.js'
import proxy from './utils/proxy.js'
import { IMG_PATH } from './config/const.js'
import { getOpts } from './utils/commander.js'
import { findSubImgOnScreen, isExisting, waitForExist } from './utils/opencv.js'
import { getHandleByTitle, getDriver  } from './utils/windows.js'
import { ocr } from './utils/ocr.js'
import Jimp from 'jimp'
import { getElementsByParse } from './utils/wxml.js'
import { isChanged, hasPopup, getLastPageSource } from './utils/page.js'
import { getPopupFromElements } from './utils/dom.js'
import { getCurDir, navigate } from './utils/navigator.js'
import { perform } from './utils/actions.js' 
import { TabManager } from './utils/tabmanager.js'

async function main () {
  const opts = getOpts()
  // const wechat = await getDriver({ app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe' })
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mppanel))
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchpopup))
  // await waitForExist(IMG_PATH.mpsearchbt)
  // await wechat.execute('windows:keys', { actions: { text: opts.name }})
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchbt))
  // await waitForExist(IMG_PATH.mpsearchbt)
  // const { x: mpsearchbtX, y: mpsearchbtY } = await findSubImgOnScreen(IMG_PATH.mpsearchbt)
  // const image = await Jimp.read(IMG_PATH.screen)
  // image.crop(mpsearchbtX - 140, mpsearchbtY + 400, 1160, 212)
  // await image.writeAsync(IMG_PATH.tmp)
  // const text = await ocr(IMG_PATH.tmp)
  // const titleOCR = text.split('\r\n')[0]
  // await wechat.execute('windows:click', { x: mpsearchbtX, y: mpsearchbtY + 190  })
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchclose))
  // await wechat.deleteSession()
  const titleOCR = opts.name
  const { handle, title } = await getHandleByTitle(titleOCR)
  if (handle === void 0) throw Error(titleOCR + ' can\'t be found')
  console.log('handle', handle.toString(16))
  const mp = await getDriver({ appTopLevelWindow: handle.toString(16) })
  await mp.pause(2000)
  const tabManager = new TabManager()
  let elements = getElementsByParse(await mp.getPageSource(), '/'), preURI = '/'
  const queue = [...elements], map = new Map()
  elements.forEach(({ URI, id }) => map.set(URI, id))
  let skip = 0
  while (queue.length) {
    const element = queue.shift()
    if (skip++ < 60) continue
    const { attr, tagName, URI } = element
    if (tagName === 'Custom' || tagName === 'Image') continue
    console.log('Navigator:', 'PRE', getCurDir(preURI), 'CUR', getCurDir(URI), 'URI', URI, 'OP', navigate(getCurDir(preURI), getCurDir(URI)))
    console.log('Searching:', tagName, attr?.['Name'])
    const isPerformed = await perform(mp, navigate(getCurDir(preURI), getCurDir(URI)), tabManager)
    if (isPerformed) elements = getElementsByParse(await mp.getPageSource(), getCurDir(URI))
    const id = map.get(URI)
    const isFound = await tabManager.swithTo(mp, getCurDir(URI), async() => {
      const res = await mp.findElement('id', id)
      return res['error'] === void 0
    })
    if (isFound === false) {
      map.delete(URI)
      console.log('Error:', 'Not Found')
      continue
    }
    const bt = await mp.$('id=' + id)
    await bt.click()
    preURI = URI
    if (await isChanged(mp)) {
      if (await bt.isExisting() === false) preURI += '/'
      const newElements = getElementsByParse(getLastPageSource(), getCurDir(preURI)).filter(({ URI, id }) => {
        const has = map.has(URI)
        map.set(URI, id)
        return has === false
      })
      if (await hasPopup()) {
        const { permission, ok, cancel } = getPopupFromElements(newElements)
        if (permission) {
          const bt = await mp.$('id=' + cancel)
          await bt.click()
          console.log('Permission:', permission, '已拒绝')
        }
      }
      if (newElements.length > 0) {
        console.log('Find new elements:', newElements.length)
        queue.push(...newElements)
        newElements.forEach(({ URI, id }) => map.set(URI, id))
      }
    } else {
      tabManager.add(getCurDir(URI), element.id)
    }
  }
}
main()