import { usePlayers } from "../hooks/usePlayers";
import { useDebts } from "../hooks/useDebts";
import { createPlayer, deletePlayer as deletePlayerService } from "../services/playerService";
import { deleteDebt } from "../services/debtService";
import { nameOf } from "../utils/helpers";
import PlayerSection from "../components/PlayerSection";
import DebtForm from "../components/DebtForm";
import BalancesBoard from "../components/BalancesBoard";
import HistorySection from "../components/HistorySection";

export default function App() {
  const { players } = usePlayers();
  const { debts } = useDebts();

  const handleAddPlayer = async (name) => {
    await createPlayer(name);
  };

  const handleDeletePlayer = async (id) => {
    const involved = debts.some(d => d.from === id || d.to === id);
    if (involved) {
      if (!confirm(`${nameOf(id, players)} tiene deudas registradas. ¿Eliminar de todos modos?`)) return;
      const related = debts.filter(d => d.from === id || d.to === id);
      await Promise.all(related.map(d => deleteDebt(d.id)));
    }
    await deletePlayerService(id);
  };

  return (
    <div className="wrap">
      <header>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 7vw, 3.2rem)', margin: 0, letterSpacing: '0.01em', color: '#ededea' }}>
          Tablero de <span style={{ color: '#e0463a', fontStyle: 'italic' }}>Deudas</span>
        </h1>
        <div className="tagline" style={{ fontSize: '0.92rem', color: 'rgba(237,237,234,0.55)', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
          quién le debe a quién, y cuánto
        </div>
      </header>
      <PlayerSection players={players} onAddPlayer={handleAddPlayer} onDeletePlayer={handleDeletePlayer} />
      <DebtForm players={players} />
      <BalancesBoard players={players} debts={debts} />
      <HistorySection players={players} debts={debts} />
      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.75rem', color: 'rgba(237,237,234,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
        los datos se comparten entre todos los que usan este tablero
      </footer>
    </div>
  );
}
