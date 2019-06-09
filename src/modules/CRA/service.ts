import {
  getDaysInMonth,
  format,
  startOfMonth,
  addDays,
  isWeekend,
  getYear
} from "date-fns";
import frLocale from "date-fns/locale/fr";
import { craCol, userCol, db, extractQueries } from "../FirebaseHelper";

export { userCol };

export function getMyCras({ user, month, year }) {
  return db()
    .collection("cra")
    .where("month", "==", month)
    .where("year", "==", year)
    .where("userid", "==", user.uid)
    .get()
    .then(extractQueries);
}

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

export function craCollection() {
  async function createOrUpdate(id, craToSave) {
    if (id === "new") await craCol().add(craToSave);
    else
      await craCol()
        .doc(id)
        .set(craToSave, { merge: true });
  }

  function remove(id: string) {
    return craCol()
      .doc(id)
      .delete();
  }

  return {
    createOrUpdate,
    remove
  };
}
