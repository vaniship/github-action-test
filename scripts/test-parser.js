const fs = require('fs');
const path = require('path');
const parser = require('./github-trending-html-parser');

const repos = parser.repo(fs.readFileSync(path.resolve(__dirname, 'test-data-1.html')) + '');
console.log(repos)
console.log(repos[2])
