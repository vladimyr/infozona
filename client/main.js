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

  return <div className={ `event list-group-item ${ eventCategory ? eventCategory.toLowerCase() : null }` }>
    <h2>{ event.title } <EventTime time={event.time} /> </h2>
    <p>
      <span>{ event.info && event.info.Lokacija ? event.info.Lokacija : null }</span>
      <span> | </span>
      <span>{ eventCategory }</span>
    </p>
    <p dangerouslySetInnerHTML={ eventDescription(event.description) }></p>
    <EventLink link={ event.link } />
  </div>;
}

function Date({ date, events }) {
  const eventList = events.map(event => <Event event={event} />);
  const dateChunks = date.split('/');
  const normalizedDateString = `${dateChunks[1]}/${dateChunks[0]}`
  const formatedDate = format(normalizedDateString, 'D. MMMM', { locale: hrLocale })

  return <div className="date list-group">
    <h1>
      { formatedDate }
    </h1>
    <div>
      { eventList }
    </div>
  </div>
}

function Dates(dates) {
  const dateList = dates.map(({ date, events }) => <Date date={date} events={events} />)

  return <div className="dateList container">
    <div>{ dateList }</div>;
  </div>
}

http.get('/api/calendar')
  .then(({ data }) => Dates(data))
  .then((dates) => {
    render(dates,
      document.getElementById('app')
    );
  });
