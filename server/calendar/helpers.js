'use strict';

const url = require('url');
const entities = require('entities');
const moment = require('moment');
const sanitizeHtml = require('sanitize-html');
const unquote = require('unquote');

const reDate = /^\d{1,2}\/\d{1,2}\d{4}$/;
const reUrl = /url\((.*?)\)/;

const baseUrl = 'http://infozona.hr';

const textFilter = text => text.replace(/\n/g, '<br>');

const sanitizeHTML = html => sanitizeHtml(html, textFilter);

module.exports = {
  readDate, readTime, readInfo,
  readPhotoUrl, readLink, sanitizeHTML
};

function readDate($date) {
  let date = $date.text().trim();
  return moment(date, 'DD/MM/YYYY').isValid() ? moment(date, 'DD/MM/YYYY').format() : moment().format();
}

function readTime($time) {
  const [ time ] = $time.text().trim().split(/\s+/);
  return time.replace(/\./, ':');
}

function readInfo($info) {
  const html = entities.decode($info.html());
  return html
    .trim()
    .split('<br>')
    .filter(r => r.length > 0)
    .reduce((info, record) => {
      const [key, val] = record.split(/:\s*/);
      info[key] = val;
      return info
    }, {});
}

function readPhotoUrl($photo) {
  if ($photo.length <= 0) return;

  const [match] = $photo.attr('style').match(reUrl) || [];
  if (!match) return;

  const path = unquote(match.trim());
  return url.resolve(baseUrl, path);
}

function readLink($link) {
  if ($link.length <= 0) return;

  const url = $link.attr('href');
  const label = $link.text();
  return { url, label };
}
