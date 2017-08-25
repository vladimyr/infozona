'use strict';

const moment = require('moment');
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
  Object.assign(event, {
    category: info[HR_LOCALES.category],
    title: $event.find('h2').text(),
    date: moment(info[HR_LOCALES.date], 'DD/MM/YYYY').format(),
    time: readTime($el.find('.dan')),
    location: info[HR_LOCALES.location],
    description: sanitizeHTML($content.eq(1).text()),
    ticket: info[HR_LOCALES.ticket],
    image: readPhotoUrl($event.find('.foto')),
    link: readLink($content.eq(1).next('a'))
  })

  return event;
}
