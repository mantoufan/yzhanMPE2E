import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'

export const getAppInfo = dirPath => new Promise(resolve => {
  chokidar.watch(dirPath).on('add', (event, p) => {
    const stat = fs.statSync(p)
    const basename = path.basename(p)
    if (stat.isDirectory()) {
      if (basename.startsWith('wx')) console.log('Miniprogram Id:', basename)
    }
    if (stat.isFile()) {
      if (basename.endsWith('wxapkg')) console.log('Miniprogram Size:', basename, stat.size)
    }
  })
})