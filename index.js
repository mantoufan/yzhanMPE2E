import { PROXY_CONF } from './config/conf.js'
import { IMG_PATH } from './config/const.js'
import { getOpts } from './utils/commander.js'
import { findSubImgOnScreen } from './utils/opencv.js'
import proxy from './utils/proxy.js'
import { getHandleByTitle, getDriver, listenChange } from './utils/windows.js'
import { ocr } from './utils/ocr.js'
import Jimp from 'jimp'
import { removeDir } from './utils/files.js'


async function main () {
  // removeDir(IMG_PATH.tmpDir)
  // const opts = getOpts()
  // const wechat = await getDriver({ app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe' })
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mppanel))
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchpopup))
  // await wechat.pause(1200)
  // await wechat.execute('windows:keys', { actions: { text: opts.name }})
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchbt))
  // await wechat.pause(1000)
  // const { x: mpsearchbtX, y: mpsearchbtY } = await findSubImgOnScreen(IMG_PATH.mpsearchbt)
  // const image = await Jimp.read(IMG_PATH.screen)
  // image.crop(mpsearchbtX - 140, mpsearchbtY + 390, 1160, 212)
  // await image.writeAsync(IMG_PATH.tmp)
  // const text = await ocr(IMG_PATH.tmp)
  // const title = text.split('\r\n')[0].split(' ')[0].replace(' | ', '丨').replace('圭', '丰')
  // await wechat.execute('windows:click', { x: mpsearchbtX, y: mpsearchbtY + 190  })
  // await wechat.pause(1000)
  const title = '上.....光细闻'
  const { handle, title: windowTitle } = await getHandleByTitle(title)
  console.log(windowTitle)
  if (handle === void 0) throw Error(title + ' can\'t be found')
  const mp = await getDriver({ appTopLevelWindow: '0x' + handle.toString(16) })
  mp.saveScreenshot('./img/tmp.png')
  // const res = await listenChange(mp, {
  //   maxSameTimes: 2,
  //   timeout: 50000
  // })
  // console.log(title + ' loading ' + (res.success ? 'success' : 'failure') + '\nUsed ' + res.time + ' ms\nUI Changed ' + res.changeTimes + ' times\nContent:\n' + res.text)
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpclose))
  // await wechat.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchclose))
  return
  
  proxy.listen(PROXY_CONF)
  console.log(`listening on ${PROXY_CONF.port}`)
}
main()