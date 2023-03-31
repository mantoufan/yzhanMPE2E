import { program } from 'commander'

export const getOpts = () => {
  program.option('-n, --name <string>', 'miniprogram name', '美团外卖')
  program.option('-p, --port <number>', 'capture port')
  program.option('-w, --watch <string>', 'watch dir path')
  program.parse()
  return program.opts()
}