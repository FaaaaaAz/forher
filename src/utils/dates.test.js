import test from 'node:test';
import assert from 'node:assert/strict';
import { getBoliviaDate, getTimeTogether } from './dates.js';
import { getSeason } from './season.js';

test('cuenta los años, meses y días al 21 de septiembre de 2026', () => {
  assert.deepEqual(getTimeTogether({ year: 2026, month: 9, day: 21 }), {
    years: 2,
    months: 4,
    days: 24,
    totalDays: 876,
  });
});

test('usa el calendario de Bolivia al cambiar de día', () => {
  assert.deepEqual(getBoliviaDate(new Date('2026-09-21T03:00:00Z')), { year: 2026, month: 9, day: 20 });
  assert.deepEqual(getBoliviaDate(new Date('2026-09-21T05:00:00Z')), { year: 2026, month: 9, day: 21 });
});

test('cambia la decoración de flores a Halloween en octubre', () => {
  assert.equal(getSeason({ month: 9, day: 21 }).id, 'yellow-flowers');
  assert.equal(getSeason({ month: 10, day: 1 }).id, 'halloween');
  assert.equal(getSeason({ month: 11, day: 1 }).id, 'spring');
});
