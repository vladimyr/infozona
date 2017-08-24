'use strict';

import React from 'react';
import { render } from 'react-dom';
import http from 'axios';
import format from 'date-fns/format';
import hrLocale from 'date-fns/locale/hr'

function Event({ event }) {
  const EventLink = ({ link }) => link ? <a href={ link.url }>{ link.label }</a> : null;
  const EventTime = ({ time }) => time ? <span>@{ time } h</span> : null;
  const eventDescription = desc => ({ __html: desc.replace(/\n/g, '<br>')});
  const eventCategory = event.info && event.info.Kategorija ? event.info.Kategorija : null;

  return (
    <li className={ `event list-group-item ${ eventCategory ? eventCategory.toLowerCase() : null }` }>
      <h2>{ event.title }</h2>
      <p>
        <h4>
          { event.info && event.info.Lokacija ? event.info.Lokacija : null }
          &nbsp;
          <EventTime time={event.time}/>
        </h4>
        <span className="label label-primary">{ eventCategory }</span>
      </p>
      <p dangerouslySetInnerHTML={ eventDescription(event.description) }></p>
      <EventLink link={ event.link } />
    </li>
  );
}

function Date({ date, events }) {
  const dateChunks = date.split('/');
  const normalizedDateString = `${dateChunks[1]}/${dateChunks[0]}`
  const formatedDate = format(normalizedDateString, 'D. MMMM', { locale: hrLocale })

  return (
    <div className="date">
      <h1>{ formatedDate }</h1>
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
