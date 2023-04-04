import { getDirname, removeDirSync } from '../tools'
import path from 'path'
import fs from 'fs'

describe('tools', () => {
  it('getDirname', () => {
    expect(getDirname().length).toBeGreaterThan(0)
  })
})

describe('removeDirSync', () => {
  const testDirPath = path.join(getDirname(), '/tests/remove_dir') 
  const testData = [
    [ '/a', 'a' ],
    [ '/a/b', 'b' ],
    [ '/a/b/c', 'c' ],
  ]
  fs.mkdirSync(testDirPath)
  testData.forEach(item => {
    const [ path, data ] = item
    const curDirPath = testDirPath + path
    fs.mkdirSync(curDirPath)
    fs.writeFileSync(curDirPath + '/data.txt', data)
  })
  removeDirSync(testDirPath)
  expect(fs.existsSync(testDirPath)).toBe(false)
})