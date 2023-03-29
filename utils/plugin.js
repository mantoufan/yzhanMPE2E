import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { PLUGINS_DIR } from '../config/const'

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
      const { default: pluginConf }  = await import(curPath)
      if (pluginConf.keywords.find(keyword => miniprogramName.indexOf(keyword)) !== void 0) {
        conf = pluginConf
        return false
      }
    }
  })
  return conf
}