const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  return n.toString().replace(/[0-9]/g, (char) => PERSIAN_DIGITS[parseInt(char, 10)] || char);
}

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${toPersianDigits(hours)}:${toPersianDigits(minutes)}`;
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${toPersianDigits(hours)}:${toPersianDigits(minutes)}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const PERSIAN_WEEK_DAYS = [
  { key: 'sa', short: 'ش', name: 'شنبه' },
  { key: 'su', short: 'ی', name: 'یکشنبه' },
  { key: 'mo', short: 'د', name: 'دوشنبه' },
  { key: 'tu', short: 'س', name: 'سه‌شنبه' },
  { key: 'we', short: 'چ', name: 'چهارشنبه' },
  { key: 'th', short: 'پ', name: 'پنج‌شنبه' },
  { key: 'fr', short: 'ج', name: 'جمعه' },
];
