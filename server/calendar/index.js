'use strict';

const request = require('pify')(require('request'), { multiArgs: true });
const cheerio = require('cheerio');
const entities = require('entities');
const { parse } = require('url');
const urlJoin = require('url-join');
const scrape = require('./scraper.js');

const baseUrl = 'http://infozona.hr';

module.exports = (req, res, next) => {
  const { query = {} } = parse(req.url, true);
  return fetchCalendar(query.lang)
    .then(calendar => res.json(calendar))
    .catch(err => next(err));
};

function fetchCalendar(lang = 'hr') {
  const url = calendarUrl(lang);
  return request.get(url)
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
