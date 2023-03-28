import OCR from 'paddleocrjson'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const ocr = imgPath => new Promise(resolve => {
  const ocr = new OCR('PaddleOCR_json.exe', [], {
    cwd:  __dirname + '/../lib/PaddleOCR-json.v1.2.1',
  }, false)
  ocr.flush({ image_dir: imgPath })
     .then((data) => resolve(data))
     .then(() => ocr.terminate())
})