import { program } from 'commander'

export const getOpts = () => {
  program.option('-n, --name <string>', 'miniprogram name', '美团外卖')
  program.parse()
  return program.opts()
}