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
  price: 'Ulaznica',
  category: 'Kategorija'
};
const EN_LOCALES = {
  location: 'Location',
  date: 'Date',
  price: 'Price',
  category: 'Category'
};

const getProp = (obj, prop, lc = HR_LOCALES) => obj[lc[prop]];
const parseDate = (str, fmt = DATE_FORMAT) => fecha.parse(str, fmt);
const formatDate = date => date.toISOString();

module.exports = function scrape($, $calendar, lang = 'hr') {
  const days = $calendar.find('li a')
    .map((i, day) => readDay($, $(day), lang, i !== 0 /* hasDate */)).get();
  // Determine start date.
  const startDate = dayBefore(new Date(days[1].date));
  days[0].date = formatDate(startDate);
  return days;
};

function readDay($, $el, lang = 'hr', hasDate = false) {
  const href = $el.attr('href');
  // Parse date.
  const dateStr = $el.find('.dan').text().trim();
  let date = hasDate && formatDate(parseDate(dateStr));
  // Collect events.
  const events = $(href).find('a')
    .map((_, el) => readEvent($, $(el), lang)).get();
  return { date, events };
}

function readEvent($, $el, lang = 'hr') {
  const href = $el.attr('href');
  const $event = $(href);
  const $content = $(href).find('p');

  const dateFormat = lang === 'en' ? 'DD/M/YYYY' : DATE_FORMAT;
  const lc = lang === 'en' ? EN_LOCALES : HR_LOCALES;

  // Extract event information.
  const info = readInfo($content.eq(0));

  const [_, id] = href.split('_');
  const url = urlJoin(baseUrl, `/kalendar/${id}`);
  const category = getProp(info, 'category', lc);
  const date = formatDate(parseDate(getProp(info, 'date', lc)), dateFormat);
  const time = readTime($el.find('.dan'));
  const location = getProp(info, 'location', lc);
  const title = $event.find('h2').text().trim();
  const description = $content.eq(1).text().trim();
  const image = resolve(baseUrl, readPhotoUrl($event.find('.foto')));
  const link = readLink($content.eq(1).next('a'));
  const price = getProp(info, 'price', lc);

  return {
    id, url,
    category,
    date, time, location,
    title, description,
    image, link,
    price
  };
}

function dayBefore(date) {
  const d = new Date(date.getTime());
  d.setDate(date.getDate() - 1);
  return d;
}
