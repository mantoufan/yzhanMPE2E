import { remote } from 'webdriverio'
import { WEBDRIVER_CONF, PROXY_CONF } from './config/conf.js'
import { IMG_PATH } from './config/const.js'
import { getOpts } from './utils/commander.js'
import { findSubImgOnScreen } from './utils/opencv.js'
import proxy from './utils/proxy.js'

async function main () {
  const opts = getOpts()
  const driver = await remote(WEBDRIVER_CONF)
  await driver.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mppanel))
  await driver.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchpopup))
  await driver.pause(500)
  await driver.execute('windows:keys', { actions: { text: opts.name }})
  await driver.execute('windows:click', await findSubImgOnScreen(IMG_PATH.mpsearchbt))
  await driver.pause(500)
  const { x: mpsearchbtX, y: mpsearchbtY } = await findSubImgOnScreen(IMG_PATH.mpsearchbt)
  await driver.execute('windows:click', { x: mpsearchbtX, y: mpsearchbtY + 190  })
  proxy.listen(PROXY_CONF)
  console.log(`listening on ${PROXY_CONF.port}`)
  return
}
main()