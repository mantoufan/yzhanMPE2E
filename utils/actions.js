import { IMG_PATH } from '../config/const.js'
import { findSubImgOnScreen } from './opencv.js'
import { waitNoChanged } from './page.js'
import { getElementsByParse } from './wxml.js'

export const tap = async (driver, offsetX, offsetY) => {
  await driver.saveScreenshot(IMG_PATH.tmp)
  const { left, top } = await findSubImgOnScreen(IMG_PATH.tmp)
  await driver.execute('windows:click', { x: left + offsetX, y: top + offsetY  })
}

export const perform = async(driver, operates, tabManager, map) => {
  const n = operates.length
  const callback = ({ id, URI }) => map.set(URI, id)
  for (let i = 0; i < n; i++) {
    const { operate, curPath } = operates[i]
    if (operate === 'back') {
      await tap(driver, 42, 42)
      getElementsByParse(await driver.getPageSource(), curPath, callback)
    } else {
      let id
      const isFound = await tabManager.swithTo(driver, curPath, async() => {
        id = getElementsByParse(await driver.getPageSource(), curPath, callback).find(({ URI }) => URI === curPath + operate)?.['id']
        return id !== void 0
      })
      if (isFound === false) {
        console.log('Error:', 'Not Found In Perform')
        return false
      }
      const bt = await driver.$('id=' + id)
      await bt.click()
      await waitNoChanged(driver)
      getElementsByParse(await driver.getPageSource(), curPath + operate + '/', callback)
    }
  }
  return true
}