import { loadPluginConf } from '../plugin'

describe('plugin', () => {
  it('loadPlugin', async () => {
    const pluginConf = await loadPluginConf('美团外卖|外卖美食奶茶咖啡水果')
    expect(pluginConf.name).toBe('美团')
  })
})