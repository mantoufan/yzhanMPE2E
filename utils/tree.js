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
  key2id(key) {
    return +key.replace(/\//g, '0')
  }
  export() {
    const res = {
      0: {
        children: []
      }
    }
    Object.keys(this.tree).sort().forEach(key => {
      let children = res[0]['children']
      key.split('/').reduce((prev, cur) => {
        const key = prev + '/' + cur, id = this.key2id(key)
        let node = children.find(child => +Object.keys(child)[0] === id)
        if (node === void 0) {
          node = Object.assign({
            children: []
          }, this.tree[key])
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
      nodes.push([id, this.tree[key]])
      edges.push([prev, next, this.tree[key]])
    })
    return { nodes, edges }
  }
}

