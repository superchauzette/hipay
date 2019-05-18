import {
  getDaysInMonth,
  format,
  startOfMonth,
  addDays,
  isWeekend,
  getYear
} from "date-fns";
import frLocale from "date-fns/locale/fr";
import { db } from "../App/fire";

async function getJoursFeries(year: number) {
  try {
    const res = await fetch(
      `https://jours-feries-france.antoine-augusti.fr/api/${year}`
    );
    const datas: { date: string; nom_jour_ferie: string }[] = await res.json();
    return datas.map(data => new Date(data.date));
  } catch (err) {
    return [];
  }
}

export async function getCalculatedCalendar(date: Date) {
  const nbDayInMonth = getDaysInMonth(date);
  const firstDayInMMouth = startOfMonth(date);
  const year = getYear(date);
  const joursFeries = await getJoursFeries(year);
  const formatDate = (d: Date) => format(d, "MM/DD/YYYY");

  return Array.from({ length: nbDayInMonth }, (_, k) => {
    const day = addDays(firstDayInMMouth, k);
    return {
      nbOfday: k + 1,
      day,
      isWeekend: isWeekend(day),
      isJourFerie: joursFeries.map(formatDate).includes(formatDate(day)),
      dayOfWeek: format(day, "dd", { locale: frLocale })
    };
  });
}

async function getCalendarFirebase(
  id: number,
  user,
  month: number,
  year: number
) {
  if (user) {
    const doc = await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .doc(String(id))
      .get();
    const cra = doc.data();
    return cra && cra.calendar;
  }
  return undefined;
}

export async function getCalendar({ id, date, user, month, year }) {
  const calendarData = await getCalendarFirebase(id, user, month, year);
  if (calendarData) {
    return calendarData;
  } else {
    const calendar = await getCalculatedCalendar(date);
    return calendar;
  }
}
