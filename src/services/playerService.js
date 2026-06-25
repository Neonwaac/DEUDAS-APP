import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function getPlayersRealtime(callback) {
  const q = query(collection(db, "players"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
      };
    });
    callback(players);
  });
}

export async function createPlayer(name) {
  return addDoc(collection(db, "players"), {
    name,
    createdAt: new Date()
  });
}

export async function deletePlayer(id) {
  return deleteDoc(doc(db, "players", id));
}
