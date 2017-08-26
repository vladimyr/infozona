const request = require('pify')(require('request'), { multiArgs: true });
const cheerio = require('cheerio');
const entities = require('entities');
const urlJoin = require('url-join');
const scrape = require('./scraper.js');

const baseUrl = 'http://infozona.hr';

module.exports = fetchCalendar;

function fetchCalendar(options = {}) {
  const { lang = 'hr' } = options;
  const url = calendarUrl(lang);
  return request.get(url, options)
    .then(([, body]) => {
      const html = entities.decode(body);
      const $ = cheerio.load(html);
      const $calendar = $('#kalendar');
      return scrape($, $calendar);
    });
}

function calendarUrl(lang = 'hr') {
  const path = lang === 'en' ? '/calendar' : '/kalendar';
  return urlJoin(baseUrl, path, '/mobile');
}
