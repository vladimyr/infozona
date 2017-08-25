'use strict';

const {
  readDate, readTime, readInfo,
  readPhotoUrl, readLink, sanitizeHTML
} = require('./helpers.js');

const HR_LOCALES = {
  location: 'Lokacija',
  date: 'Datum',
  ticket: 'Ulaznica',
  category: 'Kategorija'
}

module.exports = ($, $el) => {
  return $el.find('li a')
    .map((_, el) => readDay($, $(el)))
    .get();
};

function readDay($, $el) {
  const href = $el.attr('href');
  const date = readDate($el.find('.dan'));

  const events = $(href).find('a')
    .map((_, el) => readEvent($, $(el)))
    .get();

  return { date, events };
}

function readEvent($, $el) {
  const href = $el.attr('href');
  const $event = $(href);
  const $content = $(href).find('p');

  const info = readInfo($content.eq(0));

  const event = {};
  event.category = info[HR_LOCALES.category];
  event.title = $event.find('h2').text();
  event.date = info[HR_LOCALES.date];
  event.time = readTime($el.find('.dan'));
  event.location = info[HR_LOCALES.location];
  event.description = sanitizeHTML($content.eq(1).text());
  event.ticket = info[HR_LOCALES.ticket];
  event.image = readPhotoUrl($event.find('.foto'));
  event.link = readLink($content.eq(1).next('a'));

  return event;
}
