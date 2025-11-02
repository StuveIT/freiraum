export const FREIRAUM_NAME = 'Freiraum';

export function dateFromTime(dayString, timeString) {
  return new Date(`${dayString} ${timeString}:00`);
}
