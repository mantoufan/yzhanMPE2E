import { User32 } from 'win32-api/promise'
import { WEBDRIVER_CONF } from '../config/conf.js'
import { remote } from 'webdriverio'
import { IMG_PATH } from '../config/const.js'
import Jimp from 'jimp'
import { ocr } from '../utils/ocr.js'

export const getHandleByTitle = async (title) => {
  const user32 = User32.load()
  const calcLpszWindow = Buffer.from(title + '\0', 'ucs2')
  return await user32.FindWindowExW(0, 0, null, calcLpszWindow) 
}

const getCapability = ({ appTopLevelWindow, app }) => {
  return Object.assign(WEBDRIVER_CONF, {
    capabilities: {
      platformName: 'windows',
      'appium:automationName': 'windows',
      'appium:appTopLevelWindow': appTopLevelWindow,
      'appium:app': app
    }
  })
}

export const getDriver = async({ appTopLevelWindow, app }) => {
  return await remote(getCapability({ appTopLevelWindow, app }))
}

export const listenChange = (driver, { interval = 1000, timeout = 10000, maxSameTimes = 5 }) => new Promise(resolve => {
  let tmpPath = IMG_PATH.tmp
  let sameTimes = 1
  const startTime = performance.now()
  const done = async () => {
    const newTmpPath = tmpPath.replace(/\d+/, a => +a + 1)
    await driver.saveScreenshot(newTmpPath)
    const img = await Jimp.read(tmpPath)
    const newImg = await Jimp.read(newTmpPath)
    const diff = Jimp.compareHashes(img.pHash(), newImg.pHash())
    if (diff === 0) {
      if (++sameTimes === maxSameTimes) return clear(true)
    } else {
      tmpPath = newTmpPath
    }
    await driver.pause(interval)
    done()
  }
  let timerTimeout = setTimeout(() => {
    clear(false)
  }, timeout)
  const clear = async(success) => {
    clearTimeout(timerTimeout)
    timerTimeout = null
    const text = await ocr(tmpPath)
    resolve({
      success,
      time: performance.now() - startTime,
      changeTimes: tmpPath.match(/\d+/)[0],
      text
    })
  }
  done()
})