import React from 'react';
import { render } from 'react-dom';
import { linkifier } from 'react-linkifier';
import fecha from 'fecha';

const formatDate = (date, fmt) => fecha.format(new window.Date(date), fmt);

const Link = ({ link }) => <a href={ link.url } target="_blank">{ link.label }</a>;
const Time = ({ time }) => <span>@{ time } h</span>;
const Category = ({ type, label }) => (
  <span className={ `label label-primary ${type}` }>{ label }</span>
);

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
        <Category { ...category } />
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>
        { linkifier(description, { target: '_blank' }) }
      </p>
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

const data = window.__PRELOADED_DATA__;
delete window.__PRELOADED_DATA__;
render(
  Dates(data),
  document.getElementById('app')
)
