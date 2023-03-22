import { User32 } from 'win32-api/promise'
import { WEBDRIVER_CONF } from '../config/conf.js'
import { remote } from 'webdriverio'
import ffi from 'ffi-napi'
import stringComparison from 'string-comparison'

export const getHandleByExTitle = async (title) => {
  const user32 = User32.load()
  const calcLpszWindow = Buffer.from(title + '\0', 'ucs2')
  return await user32.FindWindowW(0, 0, null, calcLpszWindow) 
}

export const getHandleByTitle = async (title) => {
  const cos = stringComparison.cosine
  let ans = { similarity: 0 }
  const WndEnumProc = ffi.Callback('bool', ['long', 'int32'], async (hwnd, lParam) => {
    const len = 512
    const buf = Buffer.alloc(len << 1)
    const processId = await user32.GetWindowThreadProcessId(hwnd, buf)
    await user32.GetWindowTextW(hwnd, buf, len + 1)
    const windowTitle = buf.toString('ucs2').replace(/\0+$/, '')
    const similarity = cos.similarity(windowTitle, title)
    if (similarity > ans.similarity) ans = {
      title: windowTitle,
      handle: hwnd,
      processId,
      similarity
    }
    return true
  })
  const user32 = User32.load()
  await user32.EnumWindows(WndEnumProc, 0)
  return ans
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