import { PROXY_CONF } from './config/conf.js'
import proxy from './utils/proxy.js'
import { IMG_PATH } from './config/const.js'
import { getOpts } from './utils/commander.js'
import { findSubImgOnScreen } from './utils/opencv.js'
import { getHandleByTitle, getDriver,  } from './utils/windows.js'
import { ocr } from './utils/ocr.js'
import Jimp from 'jimp'
import { removeDir } from './utils/files.js'
import { getElementsByParse } from './utils/wxml.js'
import { by, isChanged, recordChange } from './utils/page.js'

async function main () {
  removeDir(IMG_PATH.tmpDir)
  const opts = getOpts()
  const wechat = await getDriver({ app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe' })
  await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mppanel))
  await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchpopup))
  await wechat.pause(1500)
  await wechat.execute('windows:keys', { actions: { text: opts.name }})
  await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchbt))
  await wechat.pause(1500)
  const { x: mpsearchbtX, y: mpsearchbtY } = await findSubImgOnScreen(IMG_PATH.mpsearchbt)
  const image = await Jimp.read(IMG_PATH.screen)
  image.crop(mpsearchbtX - 140, mpsearchbtY + 400, 1160, 212)
  await image.writeAsync(IMG_PATH.tmp)
  const text = await ocr(IMG_PATH.tmp)
  const title = text.split('\r\n')[0]
  await wechat.execute('windows:click', { x: mpsearchbtX, y: mpsearchbtY + 190  })
  await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchclose))
  await wechat.pause(500)
  const handleRes = await getHandleByTitle(title)
  console.log('OCR Result: ', title)
  console.dir(handleRes)
  console.log('\n')
  const { handle, title: name } = handleRes
  if (handle === void 0) throw Error(title + ' can\'t be found')
  const mp = await getDriver({ appTopLevelWindow: handle.toString(16) })
  // const res = await recordChange(mp)
  // console.log(name + ' loading ' + (res.success ? 'success' : 'failure') + '\nUsed ' + res.time + ' ms\nUI Changed ' + res.changeTimes + ' times\n')
  await mp.pause(2500)
  const pageSource = await mp.getPageSource()
  
  const elements = getElementsByParse(pageSource, ({ tagName }) => ['Image', 'Text', 'Button'].indexOf(tagName) > -1)
  for (const { id, attr, tagName } of elements) {
    console.log('Name', attr['Name'], 'tagName', tagName)
    const bt = await mp.$('id=' + id)
    try {
      await bt.click() 
      await mp.pause(1000)
      if (await isChanged(mp)) {
        try {
          const bt = await by(mp, 'name', '后退')
          await bt.click()
        } catch {
          // const bt = await by(mp, 'name', '主页')
          // await bt.click()
        }
      }
    } catch { continue }
  }
  return
  proxy.listen(PROXY_CONF)
  console.log(`listening on ${PROXY_CONF.port}`)
}
main()