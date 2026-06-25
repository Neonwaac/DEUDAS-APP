import { useState, useEffect } from "react";
import { getDebtsRealtime } from "../services/debtService";

export function useDebts() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getDebtsRealtime((data) => {
      setDebts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { debts, loading };
}
