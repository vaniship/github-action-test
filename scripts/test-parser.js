const repoHtml = require('./test-data');
const parser = require('./github-trending-html-parser');

const repos = parser.repo(repoHtml);
console.log(repos)
console.log(repos[0])
