import { Tree } from '../tree'

describe('tree', () => {
  const data = {
    '/1': { text: "你好" },
    '/1/2': {},
    '/1/2/3': {},
    '/2': {},
    '/2/3': {},
    '/2/3/4': { text: "Hello World" },
    '/3': {},
    '/3/4': {},
    '/3/4/5': {},
  }
  it('export', () => {
    const tree = new Tree()
    Object.keys(data).forEach(key => {
      tree.add(key, data[key])
    })
    console.log('tree.export()', JSON.stringify(tree.export(), void 0, 2))
    expect(tree.export()).toEqual({
      '/': {
        children: [
          {
            '/1': {
              children: [
                {
                  '/1/2': {
                    children: [
                      {
                        '/1/2/3': {
                          children: []
                        },
                      }
                    ]
                  }
                }
              ],
              text: "你好"
            }
          },
          {
            '/2': {
              children: [
                {
                  '/2/3': {
                    children: [
                      {
                        '/2/3/4': {
                          children: [],
                          text: "Hello World"
                        },
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            '/3': {
              children: [
                {
                  '/3/4': {
                    children: [
                      {
                        '/3/4/5': {
                          children: []
                        },
                      }
                    ]
                  }
                }
              ]
            }
          },
        ]
      }
    })
  })
})