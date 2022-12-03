const fs = require('fs');
const dayjs = require('dayjs');
const axios = require('axios');
const languages = require('./languages');
const parser = require('./github-trending-html-parser');

const sinces = ['daily', 'weekly', 'monthly']

sinces.forEach((since) => {
  fs.mkdirSync(`data/${since}/`, { recursive: true });
})

fs.writeFileSync('data/languages.json', JSON.stringify({
  updateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
  data: languages
}));

;(async () => {
  for (const language of languages) {
    await Promise.all([
      ...sinces.map(async (since) => {
      try {
        console.log(`\n> gen ${since}/${language} ...`);

        const { data } = await axios.get(`https://github.com/trending/${language}?since=${since}`, {
          timeout: 10000
        });

        const repos = parser.repo(data);

        fs.writeFileSync(`data/${since}/${language}.json`, JSON.stringify({
          updateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
          data: repos
        }))

        console.log(`√ gen ${since}/${language} ok!`);
      } catch (e) {
        console.log(`x gen ${since}/${language} failed!`, e.message);
      }
      }),
      new Promise((resolve) => setTimeout(resolve, 2500))
    ])
  }
})()
