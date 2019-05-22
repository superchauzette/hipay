import {
  getDaysInMonth,
  format,
  startOfMonth,
  addDays,
  isWeekend,
  getYear
} from "date-fns";
import frLocale from "date-fns/locale/fr";
import { appDoc, storageRef } from "../FirebaseHelper";
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

export function calendarCol({ user, month, year }) {
  return appDoc()
    .cra({ user, month, year })
    .collection("calendar");
}

export async function getCraFirebase(
  id: string,
  user: userType,
  month: number,
  year: number
) {
  if (user) {
    const doc = await calendarCol({ user, month, year })
      .doc(id)
      .get();
    const cra = doc.data();
    return cra;
  }
  return undefined;
}

export function getCraIdsFirebase({ user, year, month }) {
  return calendarCol({ user, month, year })
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
  const { id } = await calendarCol({ user, month, year }).add({
    calendar: newCalendar
  });
  return id;
}

export const storageCRA = props => storageRef().cra(props);
