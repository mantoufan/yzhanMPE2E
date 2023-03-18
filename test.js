// app: 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
// app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
import cv from 'opencv4nodejs'
const original = cv.imread('./img/screen.jpg')
const template = cv.imread('./img/miniprogram.png')

const matched = original.matchTemplate(template, 5)
const minMax = matched.minMaxLoc()
const { maxLoc: { x, y } } = minMax

// Draw bounding rectangle
original.drawRectangle(
  new cv.Rect(x, y, template.cols, template.rows),
  new cv.Vec(0, 255, 0),
  2,
  cv.LINE_8
)
console.log('x', x, 'y', y)
// Open result in new window
cv.imshow('We\'ve found Waldo!', original.resize(original.rows >> 1, original.cols >> 1))
cv.waitKey()
// import { remote } from 'webdriverio'

// import { Proxy } from 'http-mitm-proxy'
// import zlib from 'zlib'

// let curName = ''
// const opts = {
//   path: '/',
//   port: 4723,
//   capabilities: {
//     platformName: 'windows',
//     'appium:automationName': 'windows',
//     'appium:app': 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe',
//     // automationName: 'windows',
//     // app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
//     // 'appium:ms:experimental-webdriver': true
//   },
//   logLevel: 'silent',
//   waitforTimeout: 10000,
//   connectionRetryTimeout: 120000,
//   connectionRetryCount: 0,
// }

// async function main () {
//   const driver = await remote(opts)
//   const by = async (using, value, parnet) => {
//     const id = await parnet ? dirver.findElementFromElement(parent, using, value) : driver.findElement(using, value)
//     return driver.$('id=' + id['ELEMENT'])
//   }
  
//   const entranceBt = await by('name', '小程序面板')
//   await entranceBt.waitForExist({ timeout: 10000 })
//   await entranceBt.click()
//   await driver.pause(1000)
//   const pannel = await driver.$('/Window/Pane[1]/Pane/Pane[2]/Pane[1]')
//   for (let i = 1; i <= 8; i++) {
//     const entranceBt = await by('name', '小程序面板')
//     await entranceBt.waitForExist({ timeout: 10000 })
//     await entranceBt.click()
//     await driver.pause(1000)
//     const cur = await by('xpath', '/Window/Pane[1]/Pane/Pane[2]/Pane[1]/ListItem[' + i + ']', pannel)
//     await cur.waitForExist({ timeout: 10000 })
//     curName = await cur.getText()
//     await cur.click()
//   }
//   await driver.deleteSession()
//   await driver.pause(10000)
// }
// main()



// const proxy = new Proxy()
// const port = 7890
// const requestChunks = []
// console.debug = () => null
// console.error = () => null

// proxy.onRequestData(function(ctx, chunk, callback) {
//   requestChunks.push(chunk)
//   return callback(null, chunk)
// })

// proxy.onRequestEnd(function(ctx, callback) {
//   const { httpVersion, method, url, headers } = ctx.clientToProxyRequest
//   const data = (Buffer.concat(requestChunks)).toString()
//   const requestObject = {
//     httpVersion,
//     method,
//     host: headers.host,
//     url,
//     // headers
//   }
//   if (data) requestObject['data'] = data
  
//   const responseChunks = []

//   ctx.onResponseData(function(ctx, chunk, callback) {
//     responseChunks.push(chunk)
//     return callback(null, chunk)
//   })

//   ctx.onResponseEnd(function(ctx, callback) {
//     const { headers } = ctx.serverToProxyResponse
//     if (responseChunks.length && headers['content-type']?.toLowerCase().indexOf('application/json') > -1) {
//       const data = Buffer.concat(responseChunks)
//       let unzlib = null
//       switch(headers['content-encoding']) {
//         case 'br':
//           unzlib = zlib.createBrotliDecompress()
//         break
//         case 'gzip':
//           unzlib = zlib.createGunzip()
//         break
//         case 'deflate':
//           unzlib = zlib.createInflate()
//         break
//       }
//       console.log('【' + curName + '】请求', requestObject)
//       if (unzlib === null) {
//         console.log('【' + curName + '】响应', {
//           // headers,
//           data: data.toString() // appiuim
//         })
//       } else {
//         unzlib.write(data)
//         unzlib.on('data', data => {
//           console.log('【' + curName + '】响应', {
//             'content-encoding': headers['content-encoding'],
//             // headers,
//             data: data.toString()
//           })
//         })
//         unzlib.on('error', () => {})
//       }
//     }
//     responseChunks.length = 0
//     return callback()
//   })
//   requestChunks.length = 0
//   return callback()
// })
// proxy.listen({ port, silent: true })
// console.log(`listening on ${port}`)