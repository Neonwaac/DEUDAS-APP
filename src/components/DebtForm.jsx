import { useState, useEffect } from "react";
import { createDebt } from "../services/debtService";

export default function DebtForm({ players }) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (players.length === 0) {
      setFromId('');
      setToId('');
      return;
    }
    const validFrom = fromId && players.some(p => p.id === fromId);
    const validTo = toId && players.some(p => p.id === toId);

    if (!validFrom) {
      setFromId(players[0].id);
    }
    if (!validTo) {
      const other = players.find(p => p.id !== fromId);
      setToId(other ? other.id : players[0].id);
    }
  }, [players]);

  useEffect(() => {
    if (fromId && fromId === toId && players.length > 1) {
      const idx = players.findIndex(p => p.id === fromId);
      const next = players[(idx + 1) % players.length];
      setToId(next.id);
    }
  }, [fromId, toId, players]);

  const handleSubmit = async () => {
    if (!fromId || !toId) return;
    if (fromId === toId) { alert("Elige dos personas distintas."); return; }
    const amt = Math.round(parseFloat(amount));
    if (!amt || amt <= 0) { return; }

    await createDebt({
      from: fromId,
      to: toId,
      amount: amt,
      note: note.trim()
    });

    setAmount('');
    setNote('');
  };

  const handleAmountKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <section>
      <div className="section-head">
        <h2>Modificar deuda</h2>
        <div className="underline"></div>
      </div>
      <div className="card">
        <div className="form-grid">
          <select value={fromId} onChange={e => setFromId(e.target.value)}>
            {players.length === 0 && <option value="">¿Quién?</option>}
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <span className="arrow">→</span>
          <select value={toId} onChange={e => setToId(e.target.value)}>
            {players.length === 0 && <option value="">¿Quién?</option>}
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-row2">
          <input
            type="number"
            placeholder="Cantidad"
            min="0"
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={handleAmountKeyDown}
          />
          <input
            type="text"
            placeholder="Motivo"
            maxLength="60"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div className="submit-row">
          <button className="btn" onClick={handleSubmit} disabled={players.length === 0}>✓</button>
        </div>
      </div>
    </section>
  );
}
