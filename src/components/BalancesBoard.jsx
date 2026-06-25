import { useState, useMemo } from "react";
import { computeBalances, colorFor, fmt, nameOf } from "../utils/helpers";

export default function BalancesBoard({ players, debts }) {
  const [expandedId, setExpandedId] = useState(null);

  const totals = useMemo(() => computeBalances(players, debts), [players, debts]);

  return (
    <section>
      <div className="section-head">
        <h2>Tablero de deudas</h2>
        <div className="underline"></div>
      </div>
      <div className="card" id="balances-list">
        {players.map(p => {
          const t = totals[p.id];
          const net = t.owed - t.owes;
          const isOpen = expandedId === p.id;

          const owedToThem = t.detail.filter(d => d.dir === 'owed');
          const theyOwe = t.detail.filter(d => d.dir === 'owes');

          const handleToggle = () => {
            setExpandedId(prev => prev === p.id ? null : p.id);
          };

          let amtClass = 'balance-amt';
          let amtText = '—';
          if (net > 0.001) {
            amtClass += ' owed';
            amtText = `+$${fmt(net)}`;
          } else if (net < -0.001) {
            amtClass += ' owes';
            amtText = `-$${fmt(Math.abs(net))}`;
          } else {
            amtClass += ' even';
          }

          let delayIndex = 0;

          return (
            <div className={`balance-item${isOpen ? ' open' : ''}`} key={p.id}>
              <div className="balance-row" onClick={handleToggle}>
                <div className="balance-name">
                  <span className="chevron">▸</span>
                  <span className="dot" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: colorFor(p.id) }}></span>
                  <span>{p.name}</span>
                </div>
                <div className="balance-right">
                  <div className={amtClass}>{amtText}</div>
                </div>
              </div>
              <div className="balance-detail-wrap">
                <div className="balance-detail-inner">
                  <div className="balance-detail-content">
                    <div>
                      <div className="detail-col-title">Le deben</div>
                      {owedToThem.length > 0 ? (
                        owedToThem.map((d, i) => {
                          const idx = delayIndex++;
                          return (
                            <div className="detail-item" key={i} style={{ transitionDelay: `${idx * 0.06}s` }}>
                              <span>{nameOf(d.to, players)}</span>
                              <span className="detail-amt" style={{ color: 'var(--green)' }}>+${fmt(d.amount)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="detail-empty" style={{ transitionDelay: `${delayIndex++ * 0.06}s` }}>
                          Nadie le debe
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="detail-col-title">Debe a</div>
                      {theyOwe.length > 0 ? (
                        theyOwe.map((d, i) => {
                          const idx = delayIndex++;
                          return (
                            <div className="detail-item" key={i} style={{ transitionDelay: `${idx * 0.06}s` }}>
                              <span>{nameOf(d.to, players)}</span>
                              <span className="detail-amt" style={{ color: 'var(--red-bright)' }}>-${fmt(d.amount)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="detail-empty" style={{ transitionDelay: `${delayIndex++ * 0.06}s` }}>
                          No le debe a nadie
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
