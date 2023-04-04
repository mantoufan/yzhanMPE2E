import fs from 'fs'
import path from 'path'
import { removeDirSync } from './tools'

export class Tree {
  constructor() {
    this.tree = Object.create(null)
    this.subFolders = { 'crawler': ['data', 'screenshots'] }
  }
  add(key, value) {
    this.tree[key] = value
  }
  del(key) {
    delete this.tree[key]
  }
  key2id(key) {
    return +key.replace(/\//g, '0')
  }
  initRootChildren(res, _folder) {
    if (res[_folder] === void 0) res[_folder] = {
      0: {
        children: []
      }
    }
    return res[_folder]
  }
  export() {
    const res = Object.create(null)
    Object.keys(this.tree).sort().forEach(key => {
      const _folder = this.tree[key]['_folder']
      let children = this.initRootChildren(res, _folder)[0]['children']
      key.split('/').reduce((prev, cur) => {
        const key = prev + '/' + cur, id = this.key2id(key)
        let node = children.find(child => +Object.keys(child)[0] === id)
        if (node === void 0) {
          node = Object.assign({
            children: []
          }, this.tree[key])
          delete node['_folder']
          children.push({ [id]: node })
        } else {
          node = node[Object.keys(node)[0]]
        }
        children = node['children']
        return key
      })
    })
    return res
  }
  initSubFolders(curFolder) {
    const queue = [ 'crawler' ]
    while (queue.length) {
      let l = queue.length
      while (l--) {
        const node = queue.shift()
        const subFolderPath = path.join(curFolder, node)
        const folderExists = fs.existsSync(subFolderPath)
        if (folderExists === false) fs.mkdirSync(subFolderPath)
        if (this.subFolders[node] === void 0) continue
        this.subFolders[node].forEach(subFolder => queue.push(node + '/' + subFolder))
      }
    }
  }
  exportImg(exportRootDir, imageRootDir) {
    const crawlerDirName = Object.keys(this.subFolders)[0]
    const screenshotsDirPath = crawlerDirName + '/' + this.subFolders[crawlerDirName][1]
    const keys = Object.keys(this.tree)
    for (const key of keys) {
      const item = this.tree[key]
      const folder = item['_folder']
      const folderDirPath = exportRootDir + folder
      const imgPath = item['image']
      fs.copyFileSync(path.join(imageRootDir, imgPath), path.join(folderDirPath, screenshotsDirPath, path.basename(imgPath)))
    }
  }
  exportFolder(exportRootDir, imageRootDir) {
    const exportRootDirExists = fs.existsSync(exportRootDir)
    const crawlerDirName = Object.keys(this.subFolders)[0]
    const dataDirPath = crawlerDirName + '/' + this.subFolders[crawlerDirName][0]
    const res = this.export()
    const folders = Object.keys(res)
    if (exportRootDirExists === false) fs.mkdirSync(exportRootDir)
    for (const folder of folders) {
      const folderDirPath = path.join(exportRootDir, folder)
      const folderDirExists = fs.existsSync(folderDirPath)
      if (folderDirExists === true) removeDirSync(folderDirPath) 
      fs.mkdirSync(folderDirPath)
      this.initSubFolders(folderDirPath)
      fs.writeFileSync(folderDirPath + '/' + dataDirPath + '/node_data.json', JSON.stringify(res[folder], null, 2))
    }
    this.exportImg(exportRootDir, imageRootDir)
  }
  key2path(key) {
    const keyAr = key.split('/')
    const next  = +keyAr.pop()
    const prev = keyAr.length === 1 ? 0 : +keyAr.pop()
    return { prev, next }
  }
  exportPKL() {
    const nodes = [], edges = []
    Object.keys(this.tree).sort().forEach(key => {
      const id = this.key2id(key), { prev, next } = this.key2path(key)
      const node = Object.assign(Object.create(null), this.tree[key])
      delete node['_folder']
      nodes.push([id, node])
      edges.push([prev, next, { 'element': node }])
    })
    return { nodes, edges }
  }
}

