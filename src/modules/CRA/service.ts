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
import { userType } from "../UserHelper";

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

async function getCraFirebase(
  id: number,
  user: userType,
  month: number,
  year: number
) {
  if (user) {
    const doc = await db()
      .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
      .doc(String(id))
      .get();
    const cra = doc.data();
    return cra;
  }
  return undefined;
}

export async function getCRA({ id, date, user, month, year }) {
  const calendarData = await getCraFirebase(id, user, month, year);
  if (calendarData) {
    return calendarData;
  } else {
    const calendar = await getCalculatedCalendar(date);
    return { calendar, isSaved: false };
  }
}

export function getCraIdsFirebase({ user, year, month }) {
  return db()
    .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
    .get()
    .then(query => {
      const ids = [] as string[];
      query.forEach(doc => {
        ids.push(doc.id);
      });
      return ids.length ? ids : ["1"];
    });
}

export async function addNewCalendarFirebase({ date, user, month, year }) {
  const newCalendar = await getCalculatedCalendar(date);
  const { id } = await db()
    .collection(`users/${user.uid}/years/${year}/month/${month}/cra`)
    .add({ calendar: newCalendar });
  return id;
}
