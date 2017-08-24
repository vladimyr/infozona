'use strict';

const url = require('url');
const entities = require('entities');
const unquote = require('unquote');

const reDate = /^\d{1,2}\/\d{1,2}\d{4}$/;
const reUrl = /url\((.*?)\)/;

const baseUrl = 'http://infozona.hr';

module.exports = {
  readDate, readTime,
  readInfo, readPhotoUrl, readLink
};

function readDate($date) {
  let date = $date.text().trim();
  date = normalizeDateString(date);
  return reDate.test(date) ? date : formatDate(new Date());
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

  const match = $photo
    .attr('style')
    .match(reUrl);
  if (!match || !match[1]) return;

  const path = unquote(match[1].trim());
  return url.resolve(baseUrl, path);
}

function readLink($link) {
  if ($link.length <= 0) return;

  const url = $link.attr('href');
  const label = $link.text();
  return { url, label };
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${ month }/${ day }/${ year }`;
}

function normalizeDateString(date) {
  const dateChunks = date.split('/');
  dateChunks.splice(0,0, dateChunks.splice(1,1)[0]);
  return dateChunks.join('/');
}
