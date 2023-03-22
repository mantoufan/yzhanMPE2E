
import { IMG_PATH } from '../config/const.js'
import Jimp from 'jimp'
import stringComparison from 'string-comparison'

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

export const by = async (dirver, using, value) => {
  const id = await dirver.findElement(using, value)
  return dirver.$('id=' + id['ELEMENT'])
}