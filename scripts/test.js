const fs = require('fs');
const dayjs = require('dayjs');
const axios = require('axios');
const cheerio = require('cheerio');
const languages = require('./languages');

const sinces = ['daily', 'weekly', 'monthly']

sinces.forEach((since) => {
  fs.mkdirSync(`data/${since}/`, { recursive: true });
})

fs.writeFileSync('data/languages.json', JSON.stringify({
  updateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
  data: languages
}));

const trim = (text) => text && text.replace(/\s*(\n\s*|\n\s*$)/g, '');

;(async () => {
  for (const language of languages) {
    await Promise.all(sinces.map(async (since) => {
      try {
        console.log(`\n> gen ${since}/${language} ...`);

        const { data } = await axios.get(`https://github.com/trending/${language}?since=${since}`, {
          timeout: 10000
        });
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

        fs.writeFileSync(`data/${since}/${language}.json`, JSON.stringify({
          updateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
          data: result
        }))

        console.log(`√ gen ${since}/${language} ok!`);
      } catch {
        console.log(`x gen ${since}/${language} failed!`);
      }
    }))
  }
})()
