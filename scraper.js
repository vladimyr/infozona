'use strict';

const {
  readDate, readTime,
  readInfo, readPhotoUrl, readLink
} = require('./helpers.js');

module.exports = function ($, $el) {
  return $el.find('li a')
    .map((_, el) => readDay($, $(el)))
    .get();
};

function readDay($, $el) {
  let href = $el.attr('href');
  let date = readDate($el.find('.dan'));

  let events = $(href).find('a')
    .map((_, el) => readEvent($, $(el)))
    .get();

  return { date, events };
}

function readEvent($, $el) {
  let href = $el.attr('href');
  let time = readTime($el.find('.dan'));

  let $event = $(href);
  let $content = $(href).find('p');

  let title = $event.find('h2').text();
  let info = readInfo($content.eq(0));
  let description = $content.eq(1).text();

  let event = { title, time, info, description };

  // Extract event photo.
  let image = readPhotoUrl($event.find('.foto'));
  if (image) event.image = image;

  // Parse read more link.
  let link = readLink($content.eq(1).next('a'));
  if (link) event.link = link;

  return event;
}
