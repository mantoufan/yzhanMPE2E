import fs from 'fs'
import path from 'path'
export const removeDir = dir => {
  let files = fs.readdirSync(dir)
  for(var i=0;i<files.length;i++){
    let newPath = path.join(dir,files[i]);
    let stat = fs.statSync(newPath)
    if(stat.isDirectory()){
      removeDir(newPath);
    }else {
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)
}