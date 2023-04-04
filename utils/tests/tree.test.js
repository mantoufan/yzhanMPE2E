import { Tree } from '../tree'

describe('tree', () => {
  const data = {
    '/1': { text: '你好', image: '1.jpg' },
    '/1/2': { image: '102.jpg' },
    '/1/3': { image: '103.jpg' },
    '/1/2/3': { image: '10203.jpg' },
    '/2': { image: '2.jpg' },
    '/2/3': { image: '203.jpg' },
    '/2/3/4': { text: 'Hello World', image: '20304.jpg' },
    '/3': { image: '3.jpg' },
    '/3/4': { image: '304.jpg' },
    '/3/4/5': { image: '30405.jpg' },
  }
  it('export', () => {
    const tree = new Tree()
    Object.keys(data).forEach(key => {
      tree.add(key, data[key])
    })
    expect(tree.export()).toEqual({
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
                          "image": "10203.jpg"
                        }
                      }
                    ],
                    "image": "102.jpg"
                  }
                },
                {
                  "103": {
                    "children": [],
                    "image": "103.jpg"
                  }
                }
              ],
              "text": "你好",
              "image": "1.jpg"
            }
          },
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
                          "image": "20304.jpg"
                        }
                      }
                    ],
                    "image": "203.jpg"
                  }
                }
              ],
              "image": "2.jpg"
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
                          "image": "30405.jpg"
                        }
                      }
                    ],
                    "image": "304.jpg"
                  }
                }
              ],
              "image": "3.jpg"
            }
          }
        ]
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
          "image": "1.jpg"
        }
      ],
      [
        102,
        {
          "image": "102.jpg"
        }
      ],
      [
        10203,
        {
          "image": "10203.jpg"
        }
      ],
      [
        103,
        {
          "image": "103.jpg"
        }
      ],
      [
        2,
        {
          "image": "2.jpg"
        }
      ],
      [
        203,
        {
          "image": "203.jpg"
        }
      ],
      [
        20304,
        {
          "text": "Hello World",
          "image": "20304.jpg"
        }
      ],
      [
        3,
        {
          "image": "3.jpg"
        }
      ],
      [
        304,
        {
          "image": "304.jpg"
        }
      ],
      [
        30405,
        {
          "image": "30405.jpg"
        }
      ]
    ])
    expect(edges).toEqual([
      [
        0,
        1,
        {
          "text": "你好",
          "image": "1.jpg"
        }
      ],
      [
        1,
        2,
        {
          "image": "102.jpg"
        }
      ],
      [
        2,
        3,
        {
          "image": "10203.jpg"
        }
      ],
      [
        1,
        3,
        {
          "image": "103.jpg"
        }
      ],
      [
        0,
        2,
        {
          "image": "2.jpg"
        }
      ],
      [
        2,
        3,
        {
          "image": "203.jpg"
        }
      ],
      [
        3,
        4,
        {
          "text": "Hello World",
          "image": "20304.jpg"
        }
      ],
      [
        0,
        3,
        {
          "image": "3.jpg"
        }
      ],
      [
        3,
        4,
        {
          "image": "304.jpg"
        }
      ],
      [
        4,
        5,
        {
          "image": "30405.jpg"
        }
      ]
    ])
  })
})