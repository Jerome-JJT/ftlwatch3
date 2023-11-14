


// const year = date.getFullYear();
// const month = String(date.getMonth() + 1).padStart(2, '0');
// const day = String(date.getDate()).padStart(2, '0');
// const hours = String(date.getHours()).padStart(2, '0');
// const minutes = String(date.getMinutes()).padStart(2, '0');
// const seconds = String(date.getSeconds()).padStart(2, '0');
// const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
// const timeZoneOffset = -date.getTimezoneOffset();
// const offsetHours = String(Math.floor(timeZoneOffset / 60)).padStart(2, '0');
// const offsetMinutes = String(timeZoneOffset % 60).padStart(2, '0');


function dateToDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dateToTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes() + 1).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

export function shortDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const display = dateToDay(date);

  return display;
}

export function longDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const display = `${dateToDay(date)} ${dateToTime(date)}`;

  return display;
}
