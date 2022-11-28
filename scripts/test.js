const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const trim = (text) => text && text.replace(/\s*(\n\s*|\n\s*$)/g, '');

;(async () => {
  const { data } = await axios.get('https://github.com/trending?since=daily');
  const $ = cheerio.load(data);

  const props = {
    full_name: ['h1>a', (el) => el.text().replace(/(\n|\s)/g, '')],
    description: ['p', (el) => trim(el.text())],
    currentPeriodStars: ['xxx', (el) => 0],
    language: ['div>span>span[itemprop=programmingLanguage]', (el) => trim(el.text())],
    languageColor: ['div>span>span[class=repo-language-color]', (el) => (el.attr('style') || '').replace('background-color: ', '') || undefined],
    stargazers_count: ['div>a', (el) => $(el[1]).text().replace(/\n|\s|,/g, '')],
    forks_count: ['div>a', (el) => $(el[2]).text().replace(/\n|\s|,/g, '')],
    owner: ['xxx', (el) => ({ avatar_url: '', login: '' })]
  };

  const result = Array.from($('main article'))
    .map((item) => {
      const row = {};
      Object.keys(props).forEach((key) => {
        row[key] = props[key][1]($(props[key][0], item));
      });
      return row;
    });

  fs.mkdirSync('data/daily/', { recursive: true });
  fs.writeFileSync('data/daily/.json', JSON.stringify(result))
})()
