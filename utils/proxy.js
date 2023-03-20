import { Proxy } from 'http-mitm-proxy'
import zlib from 'zlib'
const proxy = new Proxy()
const requestChunks = []
console.debug = () => null
console.error = () => null

proxy.onRequestData(function(ctx, chunk, callback) {
  requestChunks.push(chunk)
  return callback(null, chunk)
})

proxy.onRequestEnd(function(ctx, callback) {
  const { httpVersion, method, url, headers } = ctx.clientToProxyRequest
  const data = (Buffer.concat(requestChunks)).toString()
  const requestObject = {
    httpVersion,
    method,
    host: headers.host,
    url,
    // headers
  }
  if (data) requestObject['data'] = data
  
  const responseChunks = []

  ctx.onResponseData(function(ctx, chunk, callback) {
    responseChunks.push(chunk)
    return callback(null, chunk)
  })

  ctx.onResponseEnd(function(ctx, callback) {
    const { headers } = ctx.serverToProxyResponse
    if (responseChunks.length && headers['content-type']?.toLowerCase().indexOf('application/json') > -1) {
      const data = Buffer.concat(responseChunks)
      let unzlib = null
      switch(headers['content-encoding']) {
        case 'br':
          unzlib = zlib.createBrotliDecompress()
        break
        case 'gzip':
          unzlib = zlib.createGunzip()
        break
        case 'deflate':
          unzlib = zlib.createInflate()
        break
      }
      console.log('请求', requestObject)
      if (unzlib === null) {
        console.log('响应', {
          // headers,
          data: data.toString() // appiuim
        })
      } else {
        unzlib.write(data)
        unzlib.on('data', data => {
          console.log('响应', {
            'content-encoding': headers['content-encoding'],
            // headers,
            data: data.toString()
          })
        })
        unzlib.on('error', () => {})
      }
    }
    responseChunks.length = 0
    return callback()
  })
  requestChunks.length = 0
  return callback()
})
export default proxy