import { formatDistanceToNow, isValid } from 'date-fns';

import type { DateRange } from 'react-day-picker';

export function formatTimeDifference(timestamp1: string, timestamp2: string) {
  const seconds = Number(timestamp2) - Number(timestamp1);
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = safeSeconds / 60;
  const hours = safeSeconds / 3600;

  if (hours >= 1) {
    return `${Math.floor(hours)} hour${Math.floor(hours) === 1 ? '' : 's'}`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} min${Math.floor(minutes) === 1 ? '' : 's'}`;
  } else {
    return `${Math.floor(safeSeconds)} second${Math.floor(safeSeconds) === 1 ? '' : 's'}`;
  }
}

export function formatTimeAgo(timestamp: string) {
  const date = new Date(Number(timestamp) * 1000);
  if (!isValid(date)) {
    return '';
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatTimestampStable(timestamp: string) {
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    return '';
  }

  const date = new Date(timestampSeconds * 1000);
  if (!isValid(date)) {
    return '';
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`;
}

export function formatTimeAgoShort(timestamp: string) {
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    return '';
  }

  const date = new Date(timestampSeconds * 1000);
  if (!isValid(date)) {
    return '';
  }

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  }
  if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)}m ago`;
  }
  if (diffSeconds < 86_400) {
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  }
  if (diffSeconds < 2_592_000) {
    return `${Math.floor(diffSeconds / 86_400)}d ago`;
  }
  if (diffSeconds < 31_536_000) {
    return `${Math.floor(diffSeconds / 2_592_000)}mo ago`;
  }
  return `${Math.floor(diffSeconds / 31_536_000)}y ago`;
}

type TimestampQuery = {
  _gte?: number;
  _lte?: number;
};

export function createTimestampQuery(date?: DateRange): TimestampQuery {
  const query: TimestampQuery = {};

  if (date?.from && isValid(date.from)) {
    query._gte = Math.floor(date?.from.getTime() / 1000);
  }

  if (date?.to && isValid(date.to)) {
    const endOfDay = new Date(date.to);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setMilliseconds(-1);
    query._lte = Math.floor(endOfDay.getTime() / 1000);
  }

  return query;
}
