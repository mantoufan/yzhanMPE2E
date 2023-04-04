import { getDirname, removeDirSync } from '../tools'
import { Tree } from '../tree'
import path from 'path'

describe('tree', () => {
  const data = {
    '/1': { text: '你好', image: '1.png', _folder: 'before_login' },
    '/1/2': { image: '102.png', _folder: 'before_login' },
    '/1/3': { image: '103.png', _folder: 'before_login' },
    '/1/2/3': { image: '10203.png', _folder: 'before_login' },
    '/2': { image: '2.png', _folder: 'settings' },
    '/2/3': { image: '203.png', _folder: 'settings' },
    '/2/3/4': { text: 'Hello World', image: '20304.png', _folder: 'after_login' },
    '/3': { image: '3.png', _folder: 'after_login' },
    '/3/4': { image: '304.png', _folder: 'after_login' },
    '/3/4/5': { image: '30405.png', _folder: 'after_login' },
  }
  it('export', () => {
    const tree = new Tree()
    Object.keys(data).forEach(key => {
      tree.add(key, data[key])
    })
    // console.log(JSON.stringify(tree.export(), null, 2))
    expect(tree.export()).toEqual({
      "before_login": {
        "0": {
          "children": [
            {
              "1": {
                "children": [
                  {
                    "102": {
                      "children": [
                        {
                          "10203": {
                            "children": [],
                            "image": "10203.png"
                          }
                        }
                      ],
                      "image": "102.png"
                    }
                  },
                  {
                    "103": {
                      "children": [],
                      "image": "103.png"
                    }
                  }
                ],
                "text": "你好",
                "image": "1.png"
              }
            }
          ]
        }
      },
      "settings": {
        "0": {
          "children": [
            {
              "2": {
                "children": [
                  {
                    "203": {
                      "children": [],
                      "image": "203.png"
                    }
                  }
                ],
                "image": "2.png"
              }
            }
          ]
        }
      },
      "after_login": {
        "0": {
          "children": [
            {
              "2": {
                "children": [
                  {
                    "203": {
                      "children": [
                        {
                          "20304": {
                            "children": [],
                            "text": "Hello World",
                            "image": "20304.png"
                          }
                        }
                      ],
                      "image": "203.png"
                    }
                  }
                ],
                "image": "2.png"
              }
            },
            {
              "3": {
                "children": [
                  {
                    "304": {
                      "children": [
                        {
                          "30405": {
                            "children": [],
                            "image": "30405.png"
                          }
                        }
                      ],
                      "image": "304.png"
                    }
                  }
                ],
                "image": "3.png"
              }
            }
          ]
        }
      }
    })
  })
  it('exportPKL', () => {
    const tree = new Tree()
    Object.keys(data).forEach(key => {
      tree.add(key, data[key])
    })
    const { nodes, edges } = tree.exportPKL()
    expect(nodes).toEqual([
      [
        1,
        {
          "text": "你好",
          "image": "1.png"
        }
      ],
      [
        102,
        {
          "image": "102.png"
        }
      ],
      [
        10203,
        {
          "image": "10203.png"
        }
      ],
      [
        103,
        {
          "image": "103.png"
        }
      ],
      [
        2,
        {
          "image": "2.png"
        }
      ],
      [
        203,
        {
          "image": "203.png"
        }
      ],
      [
        20304,
        {
          "text": "Hello World",
          "image": "20304.png"
        }
      ],
      [
        3,
        {
          "image": "3.png"
        }
      ],
      [
        304,
        {
          "image": "304.png"
        }
      ],
      [
        30405,
        {
          "image": "30405.png"
        }
      ]
    ])
    expect(edges).toEqual([
      [
        0,
        1,
        {
          "text": "你好",
          "image": "1.png"
        }
      ],
      [
        1,
        2,
        {
          "image": "102.png"
        }
      ],
      [
        2,
        3,
        {
          "image": "10203.png"
        }
      ],
      [
        1,
        3,
        {
          "image": "103.png"
        }
      ],
      [
        0,
        2,
        {
          "image": "2.png"
        }
      ],
      [
        2,
        3,
        {
          "image": "203.png"
        }
      ],
      [
        3,
        4,
        {
          "text": "Hello World",
          "image": "20304.png"
        }
      ],
      [
        0,
        3,
        {
          "image": "3.png"
        }
      ],
      [
        3,
        4,
        {
          "image": "304.png"
        }
      ],
      [
        4,
        5,
        {
          "image": "30405.png"
        }
      ]
    ])
  })
  it('exportFolder', () => {
    const dirname = path.join(getDirname(), '/tests/')
    const exportRootDir = dirname + 'export_folder/'
    const imageRootDir = dirname + 'image/'
    const tree = new Tree()
    Object.keys(data).forEach(key => {
      tree.add(key, data[key])
    })
    tree.exportFolder(exportRootDir, imageRootDir)
  })
})