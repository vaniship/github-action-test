const fs = require('fs');
const path = require('path');
const parser = require('./github-trending-html-parser');

const users = parser.user(fs.readFileSync(path.resolve(__dirname, 'test-data-3.html')) + '');
console.log(users)
console.log(users[6])
