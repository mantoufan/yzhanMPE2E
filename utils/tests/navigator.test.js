import { backPath, getCurDir, navigate } from '../navigator'

describe('navigator', () => {
  it('getCurDir', () => {
    expect(getCurDir('1/2/4/5')).toBe('1/2/4/')
    expect(getCurDir('1\\2\\4\\5')).toBe('1\\2\\4\\')
  })
  it('backPath', () => {
    expect(backPath('/1/1/')).toBe('/1/')
    expect(backPath('/1/')).toBe('/')
  })
  it('navigate', () => {
    const curPath = '/1/22/4/', targetPath = '/1/22/5/6/'
    const operates = navigate(curPath, targetPath)
    expect(operates).toEqual([
      { operate: 'back', curPath: '/1/22/' },
      { operate: '5', curPath: '/1/22/' },
      { operate: '6', curPath: '/1/22/5/' },
    ])
  })
})