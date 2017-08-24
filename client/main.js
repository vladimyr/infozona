'use strict';

import React from 'react';
import { render } from 'react-dom';
import http from 'axios';
import format from 'date-fns/format';
import hrLocale from 'date-fns/locale/hr'

function Event({ event }) {
  const { category, title, date, time, location, description, image, link } = event;
  const Description = desc => ({ __html: desc });
  const EventLink = ({ link }) => link ? <a href={ link.url }>{ link.label }</a> : null;
  const EventTime = ({ time }) => time ? <span>@{ time } h</span> : null;

  return (
    <li className="event list-group-item">
      <h2>{ title }</h2>
      <div>
        <h4>
          { location }
          &nbsp;
          <EventTime time={time}/>
        </h4>
        <span className="label label-primary">{ category }</span>
      </div>
      <p dangerouslySetInnerHTML={ Description(description) }></p>
      <EventLink link={ link } />
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
