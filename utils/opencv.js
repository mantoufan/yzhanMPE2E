import cv from 'opencv4nodejs'
import { IMG_PATH } from '../config/const.js'
import screenshot from 'screenshot-desktop'
export const findSubImgOnImg = (imgPath, subImgPath) => {
  const original = cv.imread(imgPath)
  const template = cv.imread(subImgPath)

  const matched = original.matchTemplate(template, 5)
  const minMax = matched.minMaxLoc()
  const { maxLoc: { x, y } } = minMax
  // Draw bounding rectangle
  // original.drawRectangle(
  //   new cv.Rect(x, y, template.cols, template.rows),
  //   new cv.Vec(0, 255, 0),
  //   2,
  //   cv.LINE_8
  // )
  // console.log('x', x, 'y', y)
  // // Open result in new window
  // cv.imshow('We\'ve found Waldo!', original.resize(original.rows >> 1, original.cols >> 1))
  // cv.waitKey()

  return {
    left: x, top: y, width: template.cols, height: template.rows,
    x: x + (template.cols >> 1), y: y + (template.rows >> 1)
  }
}

export const findSubImgOnScreen = async(imgPath) => {
  await screenshot({ filename: IMG_PATH.screen })
  const res = findSubImgOnImg(IMG_PATH.screen, imgPath)
  Object.keys(res).forEach(key => {
    res[key] = res[key] >> 1
  })
  return res
}