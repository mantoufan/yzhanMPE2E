export class Tree {
  constructor() {
    this.tree = Object.create(null)
  }
  add(key, value) {
    this.tree[key] = value
  }
  del(key) {
    delete this.tree[key]
  }
  export() {
    const res = {
      '/': {
        children: []
      }
    }
    Object.keys(this.tree).sort().forEach(key => {
      let children = res['/']['children']
      const keyAr = key.split('/')
      keyAr.reduce((prev, cur) => {
        const key = prev + '/' + cur
        let node = children.find(child => Object.keys(child)[0] === key)
        if (node === void 0) {
          node = Object.assign({
            children: []
          }, this.tree[key])
          children.push({ [key]: node })
        } else {
          node = node[Object.keys(node)[0]]
        }
        children = node['children']
        return key
      })
    })
    return res
  }
}

