import { format, formatDistanceToNowStrict, isToday, isTomorrow } from 'date-fns';
import { da } from 'date-fns/locale';

/** Format a time as "14:30". */
export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm', { locale: da });
}

/** Format a date like "man. 1. jul." (Danish). */
export function formatDate(iso: string): string {
  return format(new Date(iso), 'EEE d. MMM', { locale: da });
}

/** Human friendly scheduling label: "I dag 14:30", "I morgen 09:00" or date. */
export function formatSchedule(iso: string): string {
  const d = new Date(iso);
  const time = format(d, 'HH:mm', { locale: da });
  if (isToday(d)) return `I dag ${time}`;
  if (isTomorrow(d)) return `I morgen ${time}`;
  return `${format(d, 'd. MMM', { locale: da })} ${time}`;
}

/** "for 5 min. siden" style relative time. */
export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { locale: da, addSuffix: true });
}

/** Danish kroner formatting, e.g. "1.250 kr.". */
export function formatDkk(amount: number): string {
  return `${new Intl.NumberFormat('da-DK').format(Math.round(amount))} kr.`;
}
