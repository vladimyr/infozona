import React from 'react';
import { render } from 'react-dom';
import http from 'axios';
import fecha from 'fecha';

const formatDate = (date, fmt) => fecha.format(new window.Date(date), fmt);

const Link = ({ link }) => <a href={ link.url }>{ link.label }</a>;
const Time = ({ time }) => <span>@{ time } h</span>;

function Event({ event }) {
  const { category, title, date, time, location, description, image, link } = event;

  return (
    <li className="event list-group-item">
      <h3>{ title }</h3>
      <div>
        <h4>
          <span>{ location }</span>
          &nbsp;
          { time && <Time time={ time }/>}
        </h4>
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
      <h2>{ formatDate(date, 'D. MMMM') }</h2>
      <ul className="list-group">
        { events.map(event => <Event event={ event } key={ event.id } />) }
      </ul>
    </div>
  );
}

function Dates(dates) {
  return (
    <div className="dateList container">
      { dates.map(({ date, events }) => <Date date={ date } events={ events } key={ date } />) }
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
