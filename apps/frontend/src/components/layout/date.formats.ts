import dayjs, { Dayjs } from 'dayjs';
import { isUSCitizen } from '@gitroom/frontend/components/launches/helpers/isuscitizen.utils';

// English keeps the month-first order, every other language gets day-first
// ("8 listopada 2026"); the time follows the "Date Metrics" setting
const english = () => dayjs.locale() === 'en';

const timeFormat = () => {
  try {
    return isUSCitizen() ? 'h:mm A' : 'HH:mm';
  } catch (err) {
    return 'HH:mm';
  }
};

export const formatDate = (date: Dayjs) =>
  date.format(english() ? 'MMMM D, YYYY' : 'D MMMM YYYY');

export const formatShortDate = (date: Dayjs) =>
  date.format(english() ? 'MMM D, YYYY' : 'D MMM YYYY');

export const formatDateTime = (date: Dayjs, short = false) =>
  `${short ? formatShortDate(date) : formatDate(date)}${
    english() ? ' ' : ', '
  }${date.format(timeFormat())}`;
