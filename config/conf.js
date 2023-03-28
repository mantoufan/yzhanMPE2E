
import { POPUP_TYPE } from './const.js'

export const WEBDRIVER_CONF = {
  path: '/',
  port: 4723,
  capabilities: {
    platformName: 'windows',
    'appium:automationName': 'windows'
  },
  logLevel: 'silent',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 0,
}

export const PROXY_CONF = {
  port: 7890,
  silent: true
}

export const DEFAULT_OPERATE = {
  [POPUP_TYPE.Alert]: 'cancel',
  [POPUP_TYPE.WillOpen]: 'cancel',
  [POPUP_TYPE.Privacy]: 'cancel',
  [POPUP_TYPE.SendTo]: 'cancel'
}