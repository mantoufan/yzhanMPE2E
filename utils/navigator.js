export const getCurDir = path => path.replace(/(.*\/).*/, '$1')
export const navigate = (curPath, targetPath) => {
  const operates = []
  let i = 0
  const len = Math.min(curPath.length, targetPath.length)
  while (i < len && curPath[i] === targetPath[i]) i++
  const comDir = curPath.slice(0, i).replace(/(.*\/).*/, '$1')
  if (curPath.length > comDir.length) {
    const backCount = curPath.replace(comDir, '').split('/').length - 1
    const curPathAr = curPath.split('/')
    curPathAr.pop()
    for (let i = 0; i < backCount; i++) {
      curPathAr.pop()
      operates.push({
        operate: 'back', 
        curPath: curPathAr.join('/') + '/'
      })
    }
  }
  if (targetPath.length > comDir.length) {
    const comDirAr = comDir.split('/')
    comDirAr.pop()
    for (const id of targetPath.replace(comDir, '').split('/')) {
      operates.push({
        operate: id, 
        curPath: comDirAr.join('/') + '/' 
      })
      comDirAr.push(id)
    }
    operates.pop()
  }
  return operates
}