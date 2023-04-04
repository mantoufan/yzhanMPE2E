import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

export const getDirname = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  return __dirname
}

export const removeDirSync = dir => {
  const fileNames = fs.readdirSync(dir)
  for (const fileName of fileNames) {
    const filePath = join(dir, fileName)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      removeDirSync(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  }
  fs.rmdirSync(dir)
}