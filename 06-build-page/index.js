const fs = require('fs');
const path = require('path');

const originAssetsPath = path.join(__dirname, 'assets');
const projectDirPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(projectDirPath, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const templatePath = path.join(__dirname, 'template.html');
const htmlPath = path.join(projectDirPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');


fs.mkdir(projectDirPath, { recursive: true }, (err) => {
  if (err) throw err;
});

//create html
let temp = '';
fs.readFile(templatePath, 'utf-8', (err, tempData) => {
  if (err) throw err;
  temp += tempData;
  fs.readdir(componentsPath, {withFileTypes: true}, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
      if(file.isFile() && path.extname(file.name) === '.html') {
        fs.readFile(path.join(componentsPath, file.name), 'utf-8', (err, data) => {
          if(err) throw err;
          const compName ='{{' + path.parse(file.name).name + '}}';
          temp = temp.replace(compName, data);
          fs.writeFile(htmlPath, temp, err => {
            if(err) throw err;
          });
        });
      }
    });
  });
});

//copy assets

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

copyFiles(originAssetsPath, assetsPath);

//createCss

fs.createWriteStream(bundlePath);

fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile() && path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
      readStream.on('data', data => {
        fs.appendFile(bundlePath, data + '\n', err => {
          if (err) throw err;
        });
      });
    }
  });
});