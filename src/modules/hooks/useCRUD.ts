import { useState, useEffect } from "react";
import { userCol, extractQueries } from "../FirebaseHelper";

export type FileType = {
  name: string;
  type: string;
  size: number;
};

interface myType {
  id?: string;
  file?: FileType;
}

export function useCRUD<T extends myType>(
  { user, month, year },
  { collection, storageRefPath }: { collection: any; storageRefPath: any }
) {
  const [data, setData] = useState([] as T[]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async function init() {
      if (user) {
        setLoading(true);
        const mycharges = await collection()
          .where("userid", "==", user.uid)
          .where("month", "==", month)
          .where("year", "==", year)
          .get()
          .then(extractQueries);
        if (mycharges.length) setData(mycharges);
        else setData([{ id: "new" }] as T[]);
        setLoading(false);
      }
    })();
  }, [collection, month, user, year]);

  async function addData() {
    const { id } = await collection().add({
      userid: user.uid,
      month,
      year,
      user: collection().doc(user.uid)
    });
    setData(state => [...state, { id }] as T[]);
  }

  function removeData(id: string | undefined) {
    collection()
      .doc(id)
      .delete();
    setData(state => state.filter(v => v.id !== id));
    const myData = data.find(d => d.id === id);
    if (myData && myData.file && myData.file.name) {
      storageRefPath({ user, year, month })(myData.file.name).delete();
    }
  }

  async function handleChange(id: string | undefined, value: T) {
    if (id === "new") {
      const dataCreated = await collection().add({
        ...value,
        userid: user.uid,
        month,
        year,
        user: userCol().doc(user.uid),
        createdAt: new Date()
      });
      value.id = dataCreated.id;
    } else {
      collection()
        .doc(id)
        .update(value);
    }
    setData(state => state.map(s => (s.id === id ? { ...s, ...value } : s)));
  }

  function updateFile(file: FileType) {
    storageRefPath({ user, year, month })(file.name).put(file);
  }

  return {
    data,
    isLoading,
    addData,
    removeData,
    handleChange,
    updateFile
  };
}
