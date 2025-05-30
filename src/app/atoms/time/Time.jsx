import React from 'react';
import PropTypes from 'prop-types';

import dateFormat from 'dateformat';
import { isInSameDay } from '../../../util/common';

function Time({ timestamp, fullTime, hour24Clock, dateFormatString }) {
  const date = new Date(timestamp);

  const formattedFullTime = dateFormat(
    date,
    hour24Clock ? 'dd mmmm yyyy, HH:MM' : 'dd mmmm yyyy, hh:MM TT'
  );
  let formattedDate = formattedFullTime;

  if (!fullTime) {
    const compareDate = new Date();
    const isToday = isInSameDay(date, compareDate);
    compareDate.setDate(compareDate.getDate() - 1);
    const isYesterday = isInSameDay(date, compareDate);

    const timeFormat = hour24Clock ? 'HH:MM' : 'hh:MM TT';

    formattedDate = dateFormat(date, isToday || isYesterday ? timeFormat : dateFormatString);
    if (isYesterday) {
      formattedDate = `Yesterday, ${formattedDate}`;
    }
  }

  return (
    <time dateTime={date.toISOString()} title={formattedFullTime}>
      {formattedDate}
    </time>
  );
}

Time.defaultProps = {
  fullTime: false,
};

Time.propTypes = {
  timestamp: PropTypes.number.isRequired,
  fullTime: PropTypes.bool,
  hour24Clock: PropTypes.bool.isRequired,
  dateFormatString: PropTypes.string.isRequired,
};

export default Time;
