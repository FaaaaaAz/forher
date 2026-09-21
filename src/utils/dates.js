export const RELATIONSHIP_START = { year: 2024, month: 4, day: 28 };

const boliviaFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/La_Paz',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});
const boliviaClockFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/La_Paz',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function getBoliviaClock(now = new Date()) {
  const parts = Object.fromEntries(
    boliviaClockFormatter.formatToParts(now)
      .filter(({ type }) => ['hour', 'minute', 'second'].includes(type))
      .map(({ type, value }) => [type, Number(value)]),
  );
  return { hours: parts.hour, minutes: parts.minute, seconds: parts.second };
}

export function getBoliviaDate(now = new Date()) {
  const parts = Object.fromEntries(
    boliviaFormatter.formatToParts(now)
      .filter(({ type }) => ['year', 'month', 'day'].includes(type))
      .map(({ type, value }) => [type, Number(value)]),
  );

  return { year: parts.year, month: parts.month, day: parts.day };
}

export function getTimeTogether(today, start = RELATIONSHIP_START) {
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  if (todayUtc < startUtc) return { years: 0, months: 0, days: 0, totalDays: 0 };

  let years = today.year - start.year;
  let months = today.month - start.month;
  let days = today.day - start.day;

  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(today.year, today.month - 1, 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, totalDays: (todayUtc - startUtc) / 86400000 };
}
