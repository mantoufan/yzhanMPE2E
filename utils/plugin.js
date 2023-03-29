import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { PLUGINS_DIR } from '../config/const.js'
import { backPath, getCurDir } from './navigator.js'

export const traverse = async(dir, callback) => {
  for (const file of fs.readdirSync(dir)) {
    const curPath = path.resolve(dir, file)
    if (fs.statSync(curPath).isDirectory()) {
      await traverse(curPath, callback)
    } else {
      if (await callback(curPath) === false) break
    }
  }
}

export const loadPluginConf = async(miniprogramName) => {
  let conf = null
  await traverse(PLUGINS_DIR, async(curPath) => {
    if (curPath.endsWith('conf.js')) {
      const { default: pluginConf }  = await import('file:///' + curPath)
      if (pluginConf.keywords.find(keyword => miniprogramName.includes(keyword)) !== void 0) {
        pluginConf.popup?.forEach(item => item.pattern = item.pattern.map(imgPath => path.join(getCurDir(curPath), imgPath)))
        conf = pluginConf
        return false
      }
    }
  })
  return conf
}