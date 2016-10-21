import time from 'time-js';

export default function formatTime(t) {
  if (!t) {
    return t;
  }

  let [hours, minutes, seconds] = t.split(':');

  let isEvening = false;
  if (parseInt(hours, 10) > 12) {
    isEvening = true;
    hours = parseInt(hours, 10) - 12;
  }

  if (hours == '00') {
    return 'Midnight';
  }

  let timeString = `${hours}:${minutes}${isEvening ? 'pm' : 'am'}`;
  return time(timeString).format('h:mm AM');
}
