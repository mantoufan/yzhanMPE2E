export default {
  name: '美团', // Plugin name
  keywords: ['美团外卖', '美团买菜', '美团优选'], // Enable plugin if the miniprogram name contains a list of keywords
  popup: [
    {
      name: '美团通用弹窗',
      pattern: ['./img/close.png'], // Pattern Image to be searched on the screen
      area ({ left, top, width, height }) { // Return the area for OCR using left, top, width and height of the pattern

      },
      text (results) { // Return Data needed from OCR results

      },
      operate ({ left, top, width, height }) { // Default operate using left, top, width and height of the pattern
        return [
          {
            name: '关闭',
            action: 'click',
            x: left + (width >> 1),
            y: top + (height >> 1)
          }
        ]
      }
    }
  ]
    
  }
  
}