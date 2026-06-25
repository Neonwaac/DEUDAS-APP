import { useState } from "react";
import { colorFor } from "../utils/helpers";

export default function PlayerSection({ players, onAddPlayer, onDeletePlayer }) {
  const [name, setName] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setName('');
      setPlaceholder('Ya existe');
      return;
    }
    onAddPlayer(trimmed);
    setName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <section>
      <div className="section-head">
        <h2>Deudores</h2>
        <div className="underline"></div>
      </div>
      <div className="card">
        <div className="players">
          {players.map(p => (
            <div className="chip" key={p.id}>
              <span className="dot" style={{ background: colorFor(p.id) }}></span>
              <span>{p.name}</span>
              <button title="Eliminar" onClick={() => onDeletePlayer(p.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className="add-player">
          <input
            type="text"
            maxLength="24"
            value={name}
            placeholder={placeholder}
            onChange={e => { setName(e.target.value); setPlaceholder(''); }}
            onKeyDown={handleKeyDown}
          />
          <button className="btn" onClick={handleAdd}>→</button>
        </div>
      </div>
    </section>
  );
}
