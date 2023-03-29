import readline from 'readline'

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

export const listenInput = (event, callback) => {
  process.stdin.on(event, (str, key) => {
    callback(str, key)
    if(key.ctrl === true && key.name === 'd'){
        process.exit(0)
    }
  })
}