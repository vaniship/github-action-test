const cheerio = require('cheerio');

const trim = (text) => text && text.replace(/\s*(\n\s*|\n\s*$)/g, '');

const getInt = (text) => parseInt(trim(text).replace(/,/, ''), 10)

module.exports = {
  repo (html) {
    const $ = cheerio.load(html);

    const props = {
      full_name: ['h1>a', (el) => el.text().replace(/(\n|\s)/g, '')],
      description: ['p', (el) => trim(el.text())],
      currentPeriodStars: ['div>span', (el) => getInt($(el[2]).text())],
      language: ['div>span>span[itemprop=programmingLanguage]', (el) => trim(el.text())],
      languageColor: ['div>span>span[class=repo-language-color]', (el) => (el.attr('style') || '').replace('background-color: ', '') || undefined],
      stargazers_count: ['div>a', (el) => getInt($(el[1]).text())],
      forks_count: ['div>a', (el) => getInt($(el[2]).text())],
      ownner: ['div>span>a>img', (el) => ({
        avatar_url: el.attr('src'),
        login: el.attr('alt').replace(/^@/, ''),
      })],
      buildBy: ['div>span>a>img', (el) => Array.from(el).map((item) => ({
        avatar_url: item.attribs.src,
        login: item.attribs.alt.replace(/^@/, '')
      }))]
    };

    return Array.from($('main article'))
      .map((item) => {
        const row = {};
        Object.keys(props).forEach((key) => {
          row[key] = props[key][1]($(props[key][0], item));
        });
        return row;
      });
  },
  user () {

  }
}
