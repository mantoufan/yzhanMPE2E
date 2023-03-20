// app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
// app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
export const WEBDRIVER_CONF = {
  path: '/',
  port: 4723,
  capabilities: {
    platformName: 'windows',
    'appium:automationName': 'windows',
    'appium:app': 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
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