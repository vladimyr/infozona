'use strict';

const { resolve } = require('url');
const entities = require('entities');
const sanitizeHtml = require('sanitize-html');
const unquote = require('unquote');

const reUrl = /url\((.*?)\)/;

module.exports = {
  readTime, readInfo,
  readPhotoUrl, readLink
};

function readTime($time) {
  const [time] = $time.text().trim().split(/\s+/);
  return time.replace(/\./, ':');
}

function readInfo($info) {
  const html = entities.decode($info.html().trim());
  return sanitizeHtml(html).split('<br />')
    .filter(r => r.length > 0)
    // Process key-value line records.
    .reduce((info, record) => {
      const [key, val] = record.split(/:\s*/);
      info[key] = val;
      return info
    }, {});
}

function readPhotoUrl($photo) {
  if ($photo.length <= 0) return;
  const [_, path] = $photo.attr('style').match(reUrl) || [];
  if (!path) return;
  return unquote(path.trim());
}

function readLink($link) {
  if ($link.length <= 0) return;
  const url = $link.attr('href');
  const label = $link.text().trim();
  return { url, label };
}
