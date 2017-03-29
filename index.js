'use strict';

const request = require('request');
const cheerio = require('cheerio');
const entities = require('entities');
const { send } = require('micro');
const { parse } = require('url');
const extractData = require('./scraper.js');

const url = (lang='hr') =>
  `http://infozona.hr/${ lang === 'en' ? 'calendar' : 'kalendar' }/mobile`;

module.exports = (req, res) => {
  const query = parse(req.url, true).query;
  getCalendar(query.lang)
    .then(calendar => send(res, 200, calendar));
};

function getCalendar(lang='hr') {
  return new Promise((resolve, reject) => {
    request.get(url(lang), (err, resp) => {
      if (err) {
        reject(err);
        return;
      }

      let html = entities.decode(resp.body);
      let $ = cheerio.load(html);
      let $calendar = $('#kalendar');
      let data = extractData($, $calendar);
      resolve(data);
    });
  });
}
