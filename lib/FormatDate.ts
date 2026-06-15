import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';

dayjs.extend(jalaliday);

export type CalendarType = 'jalali' | 'gregorian';

interface FormatDateOptions {
  calendar?: CalendarType;
  format?: string;
  locale?: string;
}

export const formatDate = (
  date: Date | string,
  {
    calendar = 'gregorian',
    format = 'DD/MM/YYYY',
    locale = 'en',
  }: FormatDateOptions = {}
) => {
  const d = new Date(date);

  if (calendar === 'jalali') {
    return dayjs(d).calendar('jalali').locale(locale).format(format);
  }

  return dayjs(d).locale(locale).format(format);
};
