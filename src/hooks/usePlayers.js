import { useState, useEffect } from "react";
import { getPlayersRealtime } from "../services/playerService";

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getPlayersRealtime((data) => {
      setPlayers(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { players, loading };
}
