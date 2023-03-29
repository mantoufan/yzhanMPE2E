import { getDirname } from '../tools'

describe('tools', () => {
  it('getDirname', () => {
    expect(getDirname().length).toBeGreaterThan(0)
  })
})