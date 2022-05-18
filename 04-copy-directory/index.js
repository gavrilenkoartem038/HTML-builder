const fs = require('fs');
const path = require('path');
const originPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyFiles(origin, copy) {
  await fs.promises.rm(copy, { recursive: true, force: true });
  fs.mkdir(copy, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(origin, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if(file.isFile()) {
        fs.copyFile(path.join(origin, file.name), path.join(copy, file.name), err => {
          if (err) throw err;
        });
      } else if(file.isDirectory()) {
        fs.mkdir(path.join(copy, file.name), { recursive: true }, (err) => {
          if (err) throw err;
        });
        copyFiles(path.join(origin, file.name), path.join(copy, file.name));
      }
    });
  });
}

copyFiles(originPath, copyPath);