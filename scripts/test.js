const cheerio = require('cheerio');

const $ = cheerio.load('<div>hello</div>');

console.log('>>>', $('div').text())
