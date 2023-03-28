
import { IMG_PATH, POPUP_TYPE } from '../config/const.js'
import Jimp from 'jimp'
import { findSubImgOnScreenOriginal, isExisting } from './opencv.js'
import { ocr } from './ocr.js'
import { DEFAULT_OPERATE } from '../config/conf.js'

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
    await driver.pause(300)
    if (++i > 10) return false
  }
  return res
}

export const by = async (dirver, using, value) => {
  const id = await dirver.findElement(using, value)
  return dirver.$('id=' + id['ELEMENT'])
}

const popupBtTypes = ['okcancel', 'allowcancel', 'sendcancel']
export const getPopup = async() => {
  for (const popupBtType of popupBtTypes) {
    const { left, top, x, width, height } = await findSubImgOnScreenOriginal(IMG_PATH['popup'][popupBtType])
    if (x === -1) continue
    const btWidth = width - 30 >>> 1
    const btLeft= { x: left + (btWidth >>> 1) >> 1, y: top + (height >>> 1) >> 1 }
    const btRight = { x: left + btWidth + 30 + (btWidth >>> 1) >> 1, y: top + (height >>> 1) >> 1 }
    switch (popupBtType) {
      case 'okcancel':
        return { type: POPUP_TYPE.Alert, left: left - 66, top: top - 355, width: 644, height: 540, btLeft, btRight }
      case 'allowcancel':
        if (await isExisting(IMG_PATH['popup']['willopen'])) return { type: POPUP_TYPE.WillOpen, left: left - 66, top: top - 356, width: 644, height: 540, btLeft, btRight }
        else return { type: POPUP_TYPE.Privacy, left: left - 65, top: top - 377, width: 644, height: 574, btLeft, btRight }
      case 'sendcancel':
        return { type: POPUP_TYPE.SendTo, left: left - 660, top: top - 780, width: 1200, height: 890, btLeft, btRight }
    }
  }
  return null
}

export const getPopupText = async({ type, left, top, width, height }) => {
  const screen = await Jimp.read(IMG_PATH.screen)
  screen.crop(left, top, width, height)
  screen.writeAsync(IMG_PATH.tmp)
  const { code, data } = await ocr(IMG_PATH.tmp)
  if (code === 101) throw Error('No text on popup')
  // console.log('data', data)
  switch(type) {
    case POPUP_TYPE.Alert:
      return data[2].text
    case POPUP_TYPE.WillOpen:
      return data[1].text
    case POPUP_TYPE.Privacy:
      return data[2].text + data[3].text
    case POPUP_TYPE.SendTo:
      return data[0].text
  }
}

export const defaultPopupOperate = async(driver, { type, btLeft, btRight }) => {
  const operate = DEFAULT_OPERATE[type] === 'cancel' ? btRight : btLeft
  if (operate !== null) await driver.execute('windows:click', operate)
  return operate === btLeft ? Symbol('Ok') : Symbol('Cancel') 
}