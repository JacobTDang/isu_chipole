import { TIME_SLOTS } from "../data/locations";

export type Schedule = { date: string; time: string };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEAD_MINUTES = 30;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_MONTH = /^\d{4}-\d{2}$/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISO(iso: string): Date {
  if (!isISODate(iso)) throw new Error(`schedule: ${iso} is not a calendar date`);
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function slotMinutes(slot: string): number {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(slot);
  if (!match) throw new Error(`schedule: ${slot} is not a time slot`);
  const hours = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  return hours * 60 + Number(match[2]);
}

export function isISODate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function todayISO(now: Date): string {
  return toISO(now);
}

export function formatDate(iso: string): string {
  const date = parseISO(iso);
  return `${WEEKDAYS[date.getDay()].slice(0, 3)}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function weekdayName(iso: string): string {
  return WEEKDAYS[parseISO(iso).getDay()];
}

export function availableSlots(dateISO: string, now: Date): string[] {
  const today = todayISO(now);
  if (dateISO < today) return [];
  if (dateISO > today) return TIME_SLOTS;
  const earliest = now.getHours() * 60 + now.getMinutes() + LEAD_MINUTES;
  return TIME_SLOTS.filter((slot) => slotMinutes(slot) >= earliest);
}

export function defaultSchedule(now: Date): Schedule {
  const today = todayISO(now);
  const slots = availableSlots(today, now);
  if (slots.length > 0) return { date: today, time: slots[0] };
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { date: toISO(tomorrow), time: TIME_SLOTS[0] };
}

export function nextDateForWeekday(fromISO: string, weekday: string): string {
  const target = WEEKDAYS.indexOf(weekday);
  if (target === -1) throw new Error(`schedule: ${weekday} is not a weekday`);
  const from = parseISO(fromISO);
  const ahead = (target - from.getDay() + 7) % 7;
  return toISO(new Date(from.getFullYear(), from.getMonth(), from.getDate() + ahead));
}

export function monthGrid(yearMonth: string): Array<string | null> {
  if (!YEAR_MONTH.test(yearMonth)) throw new Error(`schedule: ${yearMonth} is not a year and month`);
  const [year, month] = yearMonth.split("-").map(Number);
  if (month < 1 || month > 12) throw new Error(`schedule: ${yearMonth} is not a year and month`);
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  const grid: Array<string | null> = Array.from({ length: 42 }, () => null);
  for (let day = 1; day <= days; day += 1) {
    grid[first.getDay() + day - 1] = toISO(new Date(year, month - 1, day));
  }
  return grid;
}
