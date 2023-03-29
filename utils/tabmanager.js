import { backPath } from './navigator.js'

export class TabManager {
  constructor() {
    this.tabIds = Object.create(null)
  }
  add(curPath, id, name) {
    if (this.tabIds[curPath] === void 0) this.tabIds[curPath] = new Set()
    this.tabIds[curPath].add(id)
    console.log('TabManager:', name, 'Added')
  }
  async swithTo (driver, curPath, callback) {
    if (await callback() === true) return true
    let path = curPath
    do {
      if (this.tabIds[path] !== void 0) {
        for (const id of this.tabIds[path]) {
          const bt = await driver.$('id=' + id)
          if (await bt.isExisting() === false) this.tabIds[path].delete(id)
          await bt.click()
          if (await callback() === true) return true
        } 
      }
      path = backPath(path)
    } while (path !== '/')
    return false
  }
}