let isInPopup = false
let textCount = 0
let popupObj = Object.create(null)
export const processPopup = ({ tagName, attr, isClosed }) => {
  const reset = () => (isInPopup = false, textCount = 0)
  if (tagName === 'Custom') { // hanle popup
    isInPopup = true
    if (isClosed) {
      reset()
      return true
    }
  }
  if (isInPopup) {
    if (tagName === 'Text') {
      if (textCount++ === 1) {
        popupObj['permission'] = attr['Name']
      }
    } else if (tagName === 'Button') {
      if (['拒绝', '取消'].indexOf(attr['Name']) > -1) popupObj['cancel'] = attr['RuntimeId']
      if (['申请', '允许'].indexOf(attr['Name']) > -1) popupObj['ok'] = attr['RuntimeId']
    }
  }
  return false
}

export const getPopupFromElements = elements => {
  for (let i = 0; i  < elements.length; i++) {
    const isEnd = processPopup(elements[i])
    if (isEnd === true) break
  }
  const ans = Object.create(popupObj)
  popupObj = Object.create(null)
  return ans
} 