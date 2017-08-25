'use strict';

import React from 'react';
import { render } from 'react-dom';
import http from 'axios';
import moment from 'moment';
moment.locale('hr');

const Link = ({ link }) => <a href={ link.url }>{ link.label }</a>;
const Time = ({ time }) => <span>@{ time } h</span>;

function Event({ event }) {
  const { category, title, date, time, location, description, image, link } = event;

  return (
    <li className="event list-group-item">
      <h2>{ title }</h2>
      <div>
        <h3>
          <span>{ location }</span>
          &nbsp;
          { time && <Time time={ time }/>}
        </h3>
        <span className="label label-primary">{ category }</span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      { link && <Link link={ link }/>}
    </li>
  );
}

function Date({ date, events }) {
  return (
    <div className="date">
      <h1>{ moment(date).format('D. MMMM') }</h1>
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
