import OCR from 'paddleocrjson'
import { getDirname } from './tools.js'

export const ocr = imgPath => new Promise(resolve => {
  const ocr = new OCR('PaddleOCR_json.exe', [], {
    cwd:  getDirname() + '/../lib/PaddleOCR-json.v1.2.1',
  }, false)
  ocr.flush({ image_dir: imgPath })
     .then((data) => resolve(data))
     .then(() => ocr.terminate())
})