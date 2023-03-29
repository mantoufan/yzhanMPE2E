
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

export const CONF = {
  name: '通用配置',
  popup: [ // 通用弹窗规则
    {
      name: '跳转',
      pattern: ['./img/popup/allowcancel.png', './img/popup/willopen.png'], // Pattern Images to be searched on the screen
      area ({ left, top, width, height }) { // Return the area for OCR using left, top, width and height of the pattern
        return { left: left - 66, top: top - 356, width: 644, height: 540 }
      },
      text (results) { // Return Data filtered from OCR results
        return results[1].text
      },
      operate ({ left, top, width, height }) { // Default operate using left, top, width and height of the pattern
        return [
          {
            name: '取消',
            action: 'click',
            x: left + width / 3 * 2 >>> 1,
            y: top + (height >>> 1) >>> 1
          }
        ]
      }
   },
   {
      name: '提示',
      pattern: ['./img/popup/okcancel.png'], // Pattern Images to be searched on the screen
      area ({ left, top, width, height }) { // Return the area for OCR using left, top, width and height of the pattern
        return { left: left - 66, top: top - 355, width: 644, height: 540 }
      },
      text (results) { // Return Data filtered from OCR results
        return results[2].text
      },
      operate ({ left, top, width, height }) { // Default operate using left, top, width and height of the pattern
        return [{
          name: '取消',
          action: 'click',
          x: left + width / 3 * 2 >>> 1,
          y: top + (height >>> 1) >>> 1
        }]
      }
   },
   {
      name: '权限',
      pattern: ['./img/popup/allowcancel.png'], // Pattern Images to be searched on the screen
      area ({ left, top, width, height }) { // Return the area for OCR using left, top, width and height of the pattern
        return { left: left - 65, top: top - 377, width: 644, height: 574 }
      },
      text (results) { // Return Data filtered from OCR results
        return results[2].text + results[3].text
      },
      operate ({ left, top, width, height }) { // Default operate using left, top, width and height of the pattern
        return [{
          name: '取消',
          action: 'click',
          x: left + width / 3 * 2 >>> 1,
          y: top + (height >>> 1) >>> 1
        }]
      }
   },
   {
      name: '分享',
      pattern: ['./img/popup/sendcancel.png'], // Pattern Images to be searched on the screen
      area ({ left, top, width, height }) { // Return the area for OCR using left, top, width and height of the pattern
        return { left: left - 660, top: top - 780, width: 1200, height: 890 }
      },
      text (results) { // Return Data filtered from OCR results
        return results[0].text
      },
      operate ({ left, top, width, height }) { // Default operate using left, top, width and height of the pattern
        return [{
          name: '取消',
          action: 'click',
          x: left + width / 3 * 2 >>> 1,
          y: top + (height >>> 1) >>> 1
        }]
      }
   },
  ]
}