import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function getDebtsRealtime(callback) {
  const q = query(collection(db, "debts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const debts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        from: data.from,
        to: data.to,
        amount: data.amount,
        note: data.note || '',
        paid: data.paid || false,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
      };
    });
    callback(debts);
  });
}

export async function createDebt(data) {
  return addDoc(collection(db, "debts"), {
    from: data.from,
    to: data.to,
    amount: data.amount,
    note: data.note || '',
    paid: false,
    createdAt: new Date()
  });
}

export async function updateDebt(id, data) {
  return updateDoc(doc(db, "debts", id), data);
}

export async function deleteDebt(id) {
  return deleteDoc(doc(db, "debts", id));
}
