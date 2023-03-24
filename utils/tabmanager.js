export class TabManager {
  constructor() {
    this.tabIds = Object.create(null)
  }
  add(curPath, id) {
    if (this.tabIds[curPath] === void 0) this.tabIds[curPath] = []
    this.tabIds[curPath].push(id)
    console.log('TabManager:', this.tabIds[curPath])
  }
  async swithTo (driver, curPath, callback) {
    let i = 0, n = this.tabIds[curPath]?.length || 0
    do {
      if (await callback() === true) return true
      if (n === 0) continue
      const id = this.tabIds[curPath][i++]
      const bt = await driver.$('id=' + id)
      await bt.click()
    } while (i < n)
    return false
  }
}