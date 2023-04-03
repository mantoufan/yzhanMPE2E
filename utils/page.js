
import { IMG_PATH } from '../config/const.js'
import Jimp from 'jimp'
import { ocr } from './ocr.js'
import screenshot from 'screenshot-desktop'
import { findSubImgOnImg } from './opencv.js'

export const recordChange = driver => new Promise(resolve => {
  const timeout = 100000
  let tmpPath = IMG_PATH.tmp
  const startTime = performance.now()
  const visited = new Set()
  const done = async (sameTimes) => {
    const newTmpPath = tmpPath.replace(/\d+/, a => +a + 1)
    await driver.saveScreenshot(newTmpPath)
    const newImg = await Jimp.read(newTmpPath)
    const pHash = newImg.pHash()
    if (visited.has(pHash)) {
      if (sameTimes === 3) return clear(true)
      done(sameTimes + 1)
    } else {
      visited.add(pHash)
      tmpPath = newTmpPath
      done(0)
    }
  }
  let timerTimeout = setTimeout(() => {
    clear(false)
  }, timeout)
  const clear = async(success) => {
    clearTimeout(timerTimeout)
    timerTimeout = null
    resolve({
      success,
      time: performance.now() - startTime,
      changeTimes: tmpPath.match(/\d+/)[0]
    })
  }
  done(0)
})

let lastPageSource = ''
export const isChanged = async (driver) => {
  const curPageSource = await driver.getPageSource()
  const res = lastPageSource !== curPageSource
  lastPageSource = curPageSource
  return res
}

export const getLastPageSource = () => lastPageSource

export const waitNoChanged = async (driver) => {
  let i = 0, res = false
  while (res = await isChanged(driver), res === false) {
    await driver.pause(500)
    if (++i > 5) return false
  }
  return res
}

export const by = async (dirver, using, value) => {
  const id = await dirver.findElement(using, value)
  return dirver.$('id=' + id['ELEMENT'])
}

export const getPopup = async(driver, confs) => {
  await screenshot({ filename: IMG_PATH.screen })
  for (const { name, pattern, area, text, operate } of confs) {
    const params = [], res = { name, text, operates: [] }
    if (pattern.every(imgPath => {
      const { x, left, top, width, height } = findSubImgOnImg(IMG_PATH.screen, imgPath)
      params.push({ left, top, width, height })
      return x !== -1
    }) === false) continue
    const results = await getPopupText(area(...params))
    res.text = text(results)
    const op = operate(...params)
    op.forEach(async ({ name, action, x, y }) => {
      res.operates.push(name)
      if (action === 'click') await driver.execute('windows:click', { x, y })
    })
    return res
  }
  return null
}

export const getPopupText = async({ left, top, width, height }) => {
  const screen = await Jimp.read(IMG_PATH.screen)
  screen.crop(left, top, width, height)
  screen.writeAsync(IMG_PATH.tmp)
  const { code, data } = await ocr(IMG_PATH.tmp)
  if (code === 101) throw Error('No text on popup')
  return data
}