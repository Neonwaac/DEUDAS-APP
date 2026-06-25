import { useState, useMemo } from "react";
import { updateDebt } from "../services/debtService";
import { nameOf, fmt } from "../utils/helpers";

export default function HistorySection({ players, debts }) {
  const [filterPlayer, setFilterPlayer] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleTogglePaid = async (id, paid) => {
    await updateDebt(id, { paid: !paid });
  };

  const filtered = useMemo(() => {
    let entries = [...debts];
    if (filterPlayer) {
      entries = entries.filter(d => d.from === filterPlayer || d.to === filterPlayer);
    }
    if (filterStatus === 'open') {
      entries = entries.filter(d => !d.paid);
    } else if (filterStatus === 'paid') {
      entries = entries.filter(d => d.paid);
    }
    return entries;
  }, [debts, filterPlayer, filterStatus]);

  return (
    <section>
      <div className="section-head">
        <h2>Historial de Pagos</h2>
        <div className="underline"></div>
      </div>
      <div className="filters">
        <select value={filterPlayer} onChange={e => setFilterPlayer(e.target.value)}>
          <option value="">Todos</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Todo</option>
          <option value="open">Pendiente</option>
          <option value="paid">Pagado</option>
        </select>
      </div>
      <div className="card" id="history-list">
        {filtered.length > 0 && (
          filtered.map(d => {
            const date = new Date(d.createdAt);
            return (
              <div className={`entry${d.paid ? ' paid' : ''}`} key={d.id}>
                <div className="entry-main">
                  <div className="entry-route">
                    {nameOf(d.from, players)} <span className="arrow-sm">→</span> {nameOf(d.to, players)}
                    {d.note ? <span className="for-suffix"> — {d.note}</span> : ''}
                  </div>
                  <div className="entry-meta">
                    {date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="entry-side">
                  <div className="entry-amt">${fmt(d.amount)}</div>
                  <button
                    className={`badge${d.paid ? ' is-paid' : ''}`}
                    onClick={() => handleTogglePaid(d.id, d.paid)}
                  >
                    {d.paid ? '✓' : 'marcar pagado'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
