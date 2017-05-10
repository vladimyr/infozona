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
  if (reDate.test(date)) return date;
  return formatDate(new Date());
}

function readTime($time) {
  let [ time ] = $time.text().trim().split(/\s+/);
  return time.replace(/\./, ':');
}

function readInfo($info) {
  let html = entities.decode($info.html());
  let records = html.trim().split('<br>');
  records = records.filter(r => r.length > 0);

  let info = {};
  records.forEach(record => {
    let [key, val] = record.split(/:\s*/);
    info[key] = val;
  });
  return info;
}

function readPhotoUrl($photo) {
  if ($photo.length <= 0) return;

  let style = $photo.attr('style');
  let match = style.match(reUrl);
  if (!match || !match[1]) return;

  let path = unquote(match[1].trim());
  return url.resolve(baseUrl, path);
}

function readLink($link) {
  if ($link.length <= 0) return;
  let url = $link.attr('href');
  let label = $link.text();
  return { url, label };
}

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${ day }/${ month }/${ year }`;
}
