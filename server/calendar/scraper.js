'use strict';

const {
  readDate, readTime,
  readInfo, readPhotoUrl, readLink
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
  const time = readTime($el.find('.dan'));

  const $event = $(href);
  const $content = $(href).find('p');

  const title = $event.find('h2').text();
  const info = readInfo($content.eq(0));
  const description = $content.eq(1).text();
  const image = readPhotoUrl($event.find('.foto'));
  const link = readLink($content.eq(1).next('a'));

  return {
    category: info[HR_LOCALES.category],
    title,
    date: info[HR_LOCALES.date],
    time,
    location: info[HR_LOCALES.location],
    ticket: info[HR_LOCALES.ticket],
    description,
    image,
    link
  };
}
