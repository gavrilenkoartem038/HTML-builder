const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const outFiles = fs.createWriteStream(path.join(__dirname, 'test.txt'));

rl.write('Insert your message:\n');
rl.on('line', (data) => {
  data === 'exit' ? process.exit() : outFiles.write(data + '\n');
});

process.on('exit', () => console.log('See you!'));