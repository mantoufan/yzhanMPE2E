import { getCurDir, navigate } from '../navigator'

describe('navigator', () => {
  it('getCurDir', () => {
    expect(getCurDir('1/2/4/5')).toBe('1/2/4/')
  })
  it('navigate', () => {
    const curPath = '/1/22/4/', targetPath = '/1/22/5/6/'
    const operates = navigate(curPath, targetPath)
    console.log(operates)
    expect(operates).toEqual([
      { operate: 'back', curPath: '/1/22/' },
      { operate: '5', curPath: '/1/22/' },
      { operate: '6', curPath: '/1/22/5/' },
    ])
  })
})