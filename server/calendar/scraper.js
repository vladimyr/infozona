const fecha = require('fecha');
const urlJoin = require('url-join');
const { resolve } = require('url');
const {
  readDate, readTime, readInfo,
  readPhotoUrl, readLink
} = require('./helpers.js');

const baseUrl = 'http://infozona.hr';
const DATE_FORMAT = 'DD/MM/YYYY';
const HR_LOCALES = {
  location: 'Lokacija',
  date: 'Datum',
  ticket: 'Ulaznica',
  category: 'Kategorija'
}

const getProp = (obj, prop, lc = HR_LOCALES) => obj[lc[prop]];
const parseDate = (str, fmt = DATE_FORMAT) => fecha.parse(str, fmt);
const formatDate = date => date.toISOString();

module.exports = function scrape($, $calendar) {
  return $calendar.find('li a')
    .map((_, day) => readDay($, $(day))).get();
};

function readDay($, $el) {
  const href = $el.attr('href');
  const dateStr = $el.find('.dan').text().trim();
  // Parse date if possible.
  let date = dateStr !== 'Danas' && formatDate(parseDate(dateStr));
  // Collect events.
  const events = $(href).find('a')
    .map((_, el) => readEvent($, $(el))).get();
  // Take date of first event if needed.
  date = date || events[0].date;
  return { date, events };
}

function readEvent($, $el) {
  const href = $el.attr('href');
  const $event = $(href);
  const $content = $(href).find('p');

  // Extract event information.
  const info = readInfo($content.eq(0));

  const [_, id] = href.split('_');
  const url = urlJoin(baseUrl, `/kalendar/${id}`);
  const category = getProp(info, 'category');
  const date = formatDate(parseDate(getProp(info, 'date')));
  const time = readTime($el.find('.dan'));
  const location = getProp(info, 'location');
  const title = $event.find('h2').text().trim();
  const description = $content.eq(1).text().trim();
  const image = resolve(baseUrl, readPhotoUrl($event.find('.foto')));
  const link = readLink($content.eq(1).next('a'));
  const ticket = getProp(info, 'ticket');

  return {
    id, url,
    category,
    date, time, location,
    title, description,
    image, link,
    ticket
  };
}
