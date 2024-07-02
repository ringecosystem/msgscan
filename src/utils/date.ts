import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { MessagePortBoolExp } from '@/graphql/type';
import { DateRange } from 'react-day-picker';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export function formatTimeDifference(timestamp1: string, timestamp2: string) {
  const date1 = dayjs.unix(Number(timestamp1));
  const date2 = dayjs.unix(Number(timestamp2));
  const diff = date2.diff(date1);

  const durationObj = dayjs.duration(diff);

  const seconds = durationObj.asSeconds();
  const minutes = durationObj.asMinutes();
  const hours = durationObj.asHours();

  if (hours >= 1) {
    return `${Math.floor(hours)} hour${Math.floor(hours) === 1 ? '' : 's'}`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} min${Math.floor(minutes) === 1 ? '' : 's'}`;
  } else {
    return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'}`;
  }
}

export function formatTimeAgo(timestamp: string) {
  const date = dayjs.unix(Number(timestamp));
  return dayjs().from(date);
}

type TimestampQuery = MessagePortBoolExp['sourceBlockTimestamp'];

export function createTimestampQuery(date?: DateRange): TimestampQuery {
  const query: TimestampQuery = {};

  if (date?.from) {
    query._gte = Math.floor(date.from.getTime() / 1000);
  }

  if (date?.to) {
    const endOfDay = new Date(date.to);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setMilliseconds(-1);
    query._lte = Math.floor(endOfDay.getTime() / 1000);
  }

  return query;
}
