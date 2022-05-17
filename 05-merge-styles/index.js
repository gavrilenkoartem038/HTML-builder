const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.createWriteStream(bundlePath);

fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile() && path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
      readStream.on('data', data => {
        fs.appendFile(bundlePath, data, err => {
          if (err) throw err;
        });
      });
    }
  });
});