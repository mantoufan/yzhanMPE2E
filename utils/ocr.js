import { exec } from 'child_process'
export const ocr = imgPath => new Promise(resolve => {
  exec('tesseract "' + imgPath + '" stdout -l chi_sim', (error, stdout, stderr) => {
    resolve(stdout)
  });
})