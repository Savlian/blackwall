import React, { ComponentProps } from 'react';
import { Text, as } from 'folds';
import { timeDayMonYear, timeHourMinute, today, yesterday } from '../../utils/time';

export type TimeProps = {
  compact?: boolean;
  ts: number;
  hour24Clock: boolean;
};

export const Time = as<'span', TimeProps & ComponentProps<typeof Text>>(
  ({ compact, hour24Clock, ts, ...props }, ref) => {
    const formattedTime = timeHourMinute(ts, hour24Clock);

    let time = '';
    if (compact) {
      time = formattedTime;
    } else if (today(ts)) {
      time = formattedTime;
    } else if (yesterday(ts)) {
      time = `Yesterday ${formattedTime}`;
    } else {
      time = `${timeDayMonYear(ts)} ${formattedTime}`;
    }

    return (
      <Text as="time" style={{ flexShrink: 0 }} size="T200" priority="300" {...props} ref={ref}>
        {time}
      </Text>
    );
  }
);
