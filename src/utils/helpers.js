const COLORS = ['#d9a536','#b8453a','#5c8a72','#7a8fc9','#c98fb1','#d4915a','#8fbcd4','#a9a05a'];

export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return h;
}

export function colorFor(id) {
  const idx = Math.abs(hashStr(id)) % COLORS.length;
  return COLORS[idx];
}

export function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function nameOf(id, players) {
  const p = players.find(p => p.id === id);
  return p ? p.name : '???';
}

export function computeBalances(players, debts) {
  const net = {};
  players.forEach(p => net[p.id] = {});

  debts.forEach(d => {
    if (d.paid) return;
    if (!net[d.from]) net[d.from] = {};
    if (!net[d.from][d.to]) net[d.from][d.to] = 0;
    net[d.from][d.to] += d.amount;
  });

  const pairs = {};
  players.forEach(a => {
    players.forEach(b => {
      if (a.id >= b.id) return;
      const aOwesB = (net[a.id] && net[a.id][b.id]) || 0;
      const bOwesA = (net[b.id] && net[b.id][a.id]) || 0;
      const diff = aOwesB - bOwesA;
      if (Math.abs(diff) > 0.001) {
        if (diff > 0) pairs[a.id + '|' + b.id] = { from: a.id, to: b.id, amount: diff };
        else pairs[a.id + '|' + b.id] = { from: b.id, to: a.id, amount: -diff };
      }
    });
  });

  const totals = {};
  players.forEach(p => totals[p.id] = { owes: 0, owed: 0, detail: [] });
  Object.values(pairs).forEach(pair => {
    totals[pair.from].owes += pair.amount;
    totals[pair.from].detail.push({ to: pair.to, amount: pair.amount, dir: 'owes' });
    totals[pair.to].owed += pair.amount;
    totals[pair.to].detail.push({ to: pair.from, amount: pair.amount, dir: 'owed' });
  });
  return totals;
}
