const fs = require('fs');
const path = require('path');
const originPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true }, (err) => {
  if (err) throw err;
});

function removeFiles(copy) {
  fs.readdir(copy, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if(file.isFile()) {
        fs.unlink(path.join(copy, file.name), err => {
          if (err) throw err;
        });
      } else if(file.isDirectory()) {
        removeFiles(path.join(copy, file.name));
        fs.rm(path.join(copy, file.name), { recursive: true }, (err) => {
          if (err) throw err;
        });
      }
    });
  });
}

function copyFiles(origin, copy) {
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

removeFiles(copyPath);
copyFiles(originPath, copyPath);