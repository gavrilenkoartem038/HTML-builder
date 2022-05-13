const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err ,data) => {
  if(err) console.log(err);
  else {
    data.forEach(file => {
      if(file.isFile()) {
        const name = file.name.split('.')[0];
        const type = file.name.split('.')[1];
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(filePath, (err, stats) => {
          if(err) console.log(err);
          else {
            console.log(`${name} - ${type} - ${stats.size}`);
          }
        });
      }
    });
  }
});