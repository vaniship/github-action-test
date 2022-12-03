const cheerio = require('cheerio');

const trim = (text) => text && text.replace(/\s*(\n\s*|\n\s*$)/g, '');

const getInt = (text) => parseInt(trim(text).replace(/,/, ''), 10) || 0

module.exports = {
  repo (html) {
    const $ = cheerio.load(html);

    const props = {
      full_name: ['h1>a', (el) => el.text().replace(/(\n|\s)/g, '')],
      description: ['p', (el) => trim(el.text())],
      currentPeriodStars: ['p+div>span', (el) => getInt($(el[el.length - 1]).text())],
      language: ['p+div>span>span[itemprop=programmingLanguage]', (el) => trim(el.text()) || undefined],
      languageColor: ['p+div>span>span[class=repo-language-color]', (el) => (el.attr('style') || '').replace('background-color: ', '') || undefined],
      stargazers_count: ['p+div>a[href$=stargazers]', (el) => getInt(el.text())],
      forks_count: ['p+div>a[href$=members]', (el) => getInt(el.text())],
      ownner: ['p+div>span>a>img', (el) => ({
        avatar_url: el.attr('src'),
        login: el.attr('alt')?.replace(/^@/, ''),
      })],
      buildBy: ['p+div>span>a>img', (el) => Array.from(el).map((item) => ({
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
