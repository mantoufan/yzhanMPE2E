import { PROXY_CONF, CONF } from './config/conf.js'
import proxy from './utils/proxy.js'
import { IMG_PATH } from './config/const.js'
import { getOpts } from './utils/commander.js'
import { findSubImgOnScreen, isExisting, waitForExist } from './utils/opencv.js'
import { getHandleByTitle, getDriver  } from './utils/windows.js'
import { ocr } from './utils/ocr.js'
import Jimp from 'jimp'
import { getElementsByParse } from './utils/wxml.js'
import { isChanged, getPopup, getLastPageSource, waitNoChanged } from './utils/page.js'
import { getCurDir, navigate } from './utils/navigator.js'
import { perform } from './utils/actions.js' 
import { TabManager } from './utils/tabmanager.js'
import { loadPluginConf } from './utils/plugin.js'
import { log } from 'console-log-colors'
import { listenInput } from './utils/readline.js'
import _ from 'lodash'
import { exportData } from './utils/data.js'

async function main () {
  const opts = getOpts(), map = new Map()
  log.cyanBG('Press【E】exit and get result')
  listenInput('keypress', (str, key) => {
    if (str === 'e') {
      if (map.size > 0) log.magenta('Result:', JSON.stringify(exportData(map), void 0, 2))
      log.magenta('Thanks, bye ^_^')
      process.exit(0)
    }
  })
  if (opts.watch !== void 0) return log.yellowBright('Watching:', opts.watch),chokidar.watch(opts.watch).on('all', (event, p) => {
    const stat = fs.statSync(p)
    const basename = path.basename(p)
    if (stat.isDirectory()) {
      if (basename.startsWith('wx')) console.log('Miniprogram Id:', basename)
    }
    if (stat.isFile()) {
      if (basename.endsWith('wxapkg')) console.log('Miniprogram Size:', basename, stat.size)
    }
  })
  if (opts.port !== void 0) return PROXY_CONF.port = opts.port, log.blue('Listen:', opts.port), proxy.listen(PROXY_CONF)
  
  
  // const wechat = await getDriver({ app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe' })
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mppanel))
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchpopup))
  // await waitForExist(IMG_PATH.mpsearchbt)
  // await wechat.execute('windows:keys', { actions: { text: opts.name }})
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchbt))
  // await waitForExist(IMG_PATH.mpsearchtab)
  // const { x: mpsearchbtX, y: mpsearchbtY } = await findSubImgOnScreen(IMG_PATH.mpsearchbt)
  // const image = await Jimp.read(IMG_PATH.screen)
  // image.crop(mpsearchbtX - 140, mpsearchbtY + 400, 1160, 212)
  // await image.writeAsync(IMG_PATH.tmp)
  // const res = await ocr(IMG_PATH.tmp)
  // const titleOCR =  res.data[0].text
  // await wechat.execute('windows:click', { x: mpsearchbtX, y: mpsearchbtY + 190  })
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchclose))
  // await wechat.deleteSession()
  const titleOCR = opts.name
  const { handle, title: miniprogramName } = await getHandleByTitle(titleOCR)
  const pluginConf = await loadPluginConf(miniprogramName)
  if (pluginConf?.name) _.merge(CONF, pluginConf), log.cyanBright('Plugin:', pluginConf.name, 'Actived')
  if (handle === void 0) throw Error(titleOCR + ' can\'t be found')
  log.blue('Window:', miniprogramName, 'handle is', handle)
  const mp = await getDriver({ appTopLevelWindow: handle.toString(16) })
  await waitNoChanged(mp)
  const tabManager = new TabManager(), ans = Object.create(null)
  let preURI = '/'
  const queue = [...getElementsByParse(await mp.getPageSource(), '/', ({ id, URI }) => map.set(URI, id))]
  let skip = 0
  while (queue.length) {
    const element = queue.shift()
    const { attr, tagName, URI } = element
    if (skip++ < 30) continue
    log.cyan('Navigator:', 'PREV', getCurDir(preURI), 'CUR', getCurDir(URI), 'NEXT', URI, 'OP', JSON.stringify(navigate(getCurDir(preURI), getCurDir(URI))))
    log.gray('Searching:', tagName, attr?.['Name'])
    if (await perform(mp, navigate(getCurDir(preURI), getCurDir(URI)), tabManager, map) === false) continue
    const id = map.get(URI)
    const isFound = await tabManager.swithTo(mp, getCurDir(URI), async() => {
      const res = await mp.findElement('id', id)
      return res['error'] === void 0
    })
    if (isFound === false) {
      map.delete(URI)
      log.red('Error:', 'Not Found', id)
      continue
    }
    const bt = await mp.$('id=' + id)
    await bt.click()
    preURI = URI
    let btIsExisting = await bt.isExisting()
    const popup = await getPopup(mp, CONF.popup)
    // console.log('popup', popup)
    if (popup !== null) {
      const { name, text, operates } = popup
      log.green('Popup:', '【' + name + '】', text, 'OP', operates)
    } else if (await isChanged(mp) === true) {
      if (btIsExisting === false) preURI += '/'
      const newElements = getElementsByParse(getLastPageSource(), getCurDir(preURI), ({ id, URI }) => {
                            const has = map.has(URI)
                            map.set(URI, id)
                            return has === false
                          })
      if (newElements.length > 0) {
        log.yellow('Found:', newElements.length, 'New Elements')
        queue.push(...newElements)
        newElements.forEach(({ URI, id }) => map.set(URI, id))
      }
    }
    if (btIsExisting === true && popup === null && attr['y'] > 87) {
      tabManager.add(getCurDir(URI), element.id, attr['Name'])
    }
  }
}
main()