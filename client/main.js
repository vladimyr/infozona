'use strict';

import React from 'react';
import { render } from 'react-dom';
import http from 'axios';
import format from 'date-fns/format';
import hrLocale from 'date-fns/locale/hr'

const Link = ({ link }) => <a href={ link.url }>{ link.label }</a>;

const Time = ({ time }) => <span>@{ time } h</span>;

function Event({ event }) {
  const { category, title, date, time, location, description, image, link } = event;

  return (
    <li className="event list-group-item">
      <h2>{ title }</h2>
      <div>
        <h4>
          { location }
          &nbsp;
          { time && <Time time={ time }/>}
        </h4>
        <span className="label label-primary">{ category }</span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: desc }}></p>
      { link && <Link link={ link }/>}
    </li>
  );
}

function Date({ date, events }) {
  return (
    <div className="date">
      <h1>{ format(date, 'D. MMMM', { locale: hrLocale }) }</h1>
      <ul className="list-group">
        { events.map(event => <Event event={ event } />) }
      </ul>
    </div>
  );
}

function Dates(dates) {
  return (
    <div className="dateList container">
      { dates.map(({ date, events }) => <Date date={ date } events={ events } />) }
    </div>
  );
}

http.get('/api/calendar')
  .then(({ data }) => Dates(data))
  .then((dates) => {
    render(dates,
      document.getElementById('app')
    );
  });
