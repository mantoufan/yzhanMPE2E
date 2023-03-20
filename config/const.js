export const IMG_PATH = {
  screen: './img/screen.png',
  mppanel: './img/mppanel.png',
  mpsearchpopup: './img/mpsearchpopup.png',
  mpsearchbar: './img/mpsearchbar.png',
  mpsearchbt: './img/mpsearchbt.png'
}

// app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
// app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
export const WEBDRIVER = {
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