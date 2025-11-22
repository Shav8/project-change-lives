import React, { useState, useMemo } from "react";

// Project Change Lives
// Single-file React component (Tailwind CSS assumed in host app)
// Features: compound growth simulator, trades-needed estimator, betting planner, coloring-book SVG generator, VA/business toolkit, privacy-first AI chat.

export default function ProjectChangeLivesApp() {
  const [view, setView] = useState("dashboard");
  const [balance, setBalance] = useState(100);
  const [days, setDays] = useState(300);
  const [dailyTargetPct, setDailyTargetPct] = useState(0.03);
  const [riskPerTradePct, setRiskPerTradePct] = useState(0.05);
  const [chatMessages, setChatMessages] = useState([
    { from: "system", text: "Welcome to Project Change Lives — built for traders, creators & small-business owners." },
  ]);

  // Compound growth simulator
  function simulateCompound(initial, dailyRate, daysToSim) {
    const timeline = [];
    let bal = initial;
    for (let i = 1; i <= daysToSim; i++) {
      bal = +(bal * (1 + dailyRate)).toFixed(8);
      timeline.push({ day: i, balance: +bal.toFixed(2) });
    }
    return timeline;
  }

  const compoundData = useMemo(() => simulateCompound(balance, dailyTargetPct, days), [balance, dailyTargetPct, days]);

  // Trades needed per day (deterministic model, 1:1 R:R)
  function tradesNeededForDay(bal) {
    const dailyTarget = dailyTargetPct * bal;
    const profitPerWin = riskPerTradePct * bal; // assumes 1:1 R:R
    if (profitPerWin <= 0) return Infinity;
    return Math.ceil(dailyTarget / profitPerWin);
  }

  // Demo accumulator generator
  function generateAccumulatorTickets(matches, ticketsCount = 5, selectionsPerTicket = 12) {
    const tickets = [];
    for (let t = 0; t < ticketsCount; t++) {
      const picks = [];
      const shuffled = [...matches].sort(() => 0.5 - Math.random());
      for (let i = 0; i < Math.min(selectionsPerTicket, shuffled.length); i++) {
        const m = shuffled[i];
        const sorted = [...m.options].sort((a, b) => b.prob - a.prob);
        const pick = Math.random() < 0.2 && sorted[1] ? sorted[1] : sorted[0];
        picks.push({ match: `${m.home} vs ${m.away}`, pick: pick.name, confidence: pick.prob });
      }
      tickets.push({ id: t + 1, picks });
    }
    return tickets;
  }

  const mockMatches = [
    { home: "Team A", away: "Team B", options: [{ name: "1", prob: 0.58 }, { name: "X", prob: 0.22 }, { name: "2", prob: 0.20 }] },
    { home: "Team C", away: "Team D", options: [{ name: "1", prob: 0.35 }, { name: "X", prob: 0.25 }, { name: "2", prob: 0.40 }] },
    { home: "Team E", away: "Team F", options: [{ name: "1", prob: 0.20 }, { name: "X", prob: 0.30 }, { name: "2", prob: 0.50 }] },
  ];

  const [tickets, setTickets] = useState(() => generateAccumulatorTickets(mockMatches, 6, 6));

  // Number-to-color SVG generator
  function generateNumberToColorSVG(gridSize = 8, palette = ["#fef3c7", "#fde68a", "#fb923c", "#f97316", "#c2410c"]) {
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 ${gridSize} ${gridSize}'>`;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const value = ((x + 1) * (y + 2)) % palette.length;
        svg += `<rect x='${x}' y='${y}' width='1' height='1' fill='${palette[value]}' stroke='#111' stroke-width='0.02'/>`;
      }
    }
    svg += `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Mock AI chat send
  function sendChat(prompt) {
    setChatMessages((m) => [...m, { from: "user", text: prompt }]);
    setTimeout(() => {
      setChatMessages((m) => [...m, { from: "assistant", text: `Demo reply: consider 2–3 trades/day with strict stops. Connect your LLM backend for live advice.` }]);
    }, 600);
  }

  function exportCSVFromCompound(data) {
    const header = "day,balance\n";
    const body = data.map((r) => `${r.day},${r.balance}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compound_simulation.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans">
      <header className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center font-bold text-slate-900">CL</div>
          <div>
            <h1 className="text-lg font-semibold">Project Change Lives</h1>
            <div className="text-xs text-slate-400">Tools for traders, creators & small-business founders</div>
          </div>
        </div>
        <nav className="flex gap-3">
          <button onClick={() => setView("dashboard")} className={`px-3 py-2 rounded ${view === "dashboard" ? "bg-slate-700" : "hover:bg-slate-700/40"}`}>Dashboard</button>
          <button onClick={() => setView("trade-tools")} className={`px-3 py-2 rounded ${view === "trade-tools" ? "bg-slate-700" : "hover:bg-slate-700/40"}`}>Trade Tools</button>
          <button onClick={() => setView("betting")} className={`px-3 py-2 rounded ${view === "betting" ? "bg-slate-700" : "hover:bg-slate-700/40"}`}>Betting Planner</button>
          <button onClick={() => setView("creator")} className={`px-3 py-2 rounded ${view === "creator" ? "bg-slate-700" : "hover:bg-slate-700/40"}`}>Creator Tools</button>
          <button onClick={() => setView("chat")} className={`px-3 py-2 rounded ${view === "chat" ? "bg-slate-700" : "hover:bg-slate-700/40"}`}>AI Chat</button>
        </nav>
      </header>

      <main className="p-6 grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-slate-900/40 p-4 rounded-lg border border-slate-700">
          <h2 className="text-sm font-medium text-slate-300">Account Snapshot</h2>
          <div className="mt-3 space-y-2">
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Simulate growth, plan trades, and export results.</div>
            <div className="mt-3 flex gap-2">
              <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full rounded p-2 bg-slate-800 border border-slate-700" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs text-slate-400">Daily target</div>
              <input type="range" min={0.001} max={0.2} step={0.001} value={dailyTargetPct} onChange={(e) => setDailyTargetPct(Number(e.target.value))} />
              <div className="text-sm">{(dailyTargetPct * 100).toFixed(2)}% / day</div>

              <div className="text-xs text-slate-400 mt-2">Risk per trade</div>
              <input type="range" min={0.01} max={0.2} step={0.005} value={riskPerTradePct} onChange={(e) => setRiskPerTradePct(Number(e.target.value))} />
              <div className="text-sm">{(riskPerTradePct * 100).toFixed(2)}% per trade</div>
            </div>

            <div className="mt-4">
              <button onClick={() => exportCSVFromCompound(compoundData)} className="px-3 py-2 rounded bg-emerald-400 text-slate-900 font-semibold">Export CSV</button>
            </div>
          </div>
        </aside>

        <section className="col-span-9">
          {view === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                  <div className="text-xs text-slate-400">Projected balance (day {days})</div>
                  <div className="text-2xl font-bold mt-2">${compoundData[compoundData.length - 1].balance.toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mt-2">Projected using { (dailyTargetPct*100).toFixed(2)}% daily growth</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                  <div className="text-xs text-slate-400">Trades needed/day (approx.)</div>
                  <div className="text-2xl font-bold mt-2">{tradesNeededForDay(balance)}</div>
                  <div className="text-xs text-slate-400 mt-2">Assumes 1:1 R:R and deterministic wins</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                  <div className="text-xs text-slate-400">Simulation length</div>
                  <div className="mt-2 flex gap-2 items-center">
                    <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-28 p-2 bg-slate-800 border border-slate-700 rounded" />
                    <div className="text-xs text-slate-400">days</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                <h3 className="font-medium">Balance timeline</h3>
                <div className="mt-3 h-48 bg-slate-800/30 rounded p-4 overflow-auto">
                  <svg viewBox={`0 0 ${compoundData.length} 100`} preserveAspectRatio="none" className="w-full h-full">
                    {compoundData.map((d, i) => {
                      const max = compoundData[compoundData.length - 1].balance;
                      const y = 100 - (d.balance / max) * 100;
                      return <circle key={i} cx={i} cy={y} r={0.6} fill="#34d399" />;
                    })}
                  </svg>
                </div>
                <div className="mt-2 text-xs text-slate-400">Tip: export CSV to analyze in Excel or Power BI.</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Quick trade plan</h3>
                  <div className="mt-2 text-sm text-slate-300">To reach {(dailyTargetPct*100).toFixed(2)}% daily from ${balance.toFixed(2)}, you need approximately:</div>
                  <div className="mt-3 text-3xl font-bold">{tradesNeededForDay(balance)} trades/day</div>
                  <div className="mt-3 text-xs text-slate-400">This is a best-case deterministic estimate. Use strict stops and realistic expectations.</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Coloring-book demo</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 items-center">
                    <img src={generateNumberToColorSVG(16)} alt="number-to-color demo" className="border border-slate-700 rounded" />
                    <div>
                      <div className="text-sm text-slate-300">Downloadable SVG for fast proof-of-concept.</div>
                      <a className="mt-2 inline-block px-3 py-2 bg-emerald-400 text-slate-900 rounded font-semibold" href={generateNumberToColorSVG(16)} download="coloring_book.svg">Download SVG</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "trade-tools" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Trade Tools</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Compound simulator</h3>
                  <div className="mt-2 text-sm text-slate-300">Starting ${balance.toFixed(2)} | {days} days | {(dailyTargetPct*100).toFixed(2)}%/day</div>
                  <div className="mt-3 overflow-auto max-h-64">
                    <table className="w-full text-xs table-auto">
                      <thead>
                        <tr className="text-left text-slate-400">
                          <th>Day</th><th>Balance</th><th>Trades needed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compoundData.slice(0, 100).map((r) => (
                          <tr key={r.day} className="border-t border-slate-700">
                            <td className="py-1">{r.day}</td>
                            <td className="py-1">${r.balance.toFixed(2)}</td>
                            <td className="py-1">{tradesNeededForDay(r.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Risk planner</h3>
                  <div className="mt-2 text-sm text-slate-300">Change risk or target and see required trades instantly.</div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400">Risk per trade</label>
                      <input type="number" step={0.01} value={riskPerTradePct} onChange={(e) => setRiskPerTradePct(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Daily target</label>
                      <input type="number" step={0.01} value={dailyTargetPct} onChange={(e) => setDailyTargetPct(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm">On current balance of ${balance.toFixed(2)}, trades/day ≈ <strong>{tradesNeededForDay(balance)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "betting" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Betting Planner</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Generate accumulator tickets</h3>
                  <div className="mt-2 text-sm text-slate-300">Demo generator that picks high-prob picks and adds small randomness.</div>
                  <div className="mt-3">
                    <button onClick={() => setTickets(generateAccumulatorTickets(mockMatches, 8, 6))} className="px-3 py-2 bg-emerald-400 text-slate-900 rounded font-semibold">Generate Tickets</button>
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Tickets</h3>
                  <div className="mt-2 space-y-2 max-h-64 overflow-auto">
                    {tickets.map((t) => (
                      <div key={t.id} className="p-2 rounded bg-slate-800/40 border border-slate-700">
                        <div className="text-sm font-semibold">Ticket {t.id}</div>
                        <ul className="text-xs mt-1">
                          {t.picks.map((p, i) => <li key={i}>{p.match} — {p.pick} (conf {Math.round(p.confidence*100)}%)</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "creator" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Creator & Small-Biz Toolkit</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">Number-to-Color Book Builder</h3>
                  <div className="mt-2 text-sm text-slate-300">Fast proofs for landmarks, export SVGs for printing.</div>
                  <div className="mt-3">
                    <a className="px-3 py-2 bg-emerald-400 rounded font-semibold text-slate-900" href={generateNumberToColorSVG(24)} download="landmark_demo.svg">Download Demo SVG</a>
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-900/40 border border-slate-700">
                  <h3 className="font-medium">VA Business Starter Kit</h3>
                  <div className="mt-2 text-sm text-slate-300">Templates: outreach email, pricing table, service list.</div>
                  <div className="mt-3 text-xs text-slate-300">
                    <strong>Outreach subject:</strong> "Remote VA support — 2 years experience, ready to help your team"
                    <div className="mt-2">Pricing suggestion: Starter — $150/mo (10 hrs), Growth — $400/mo (35 hrs), Scale — custom</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "chat" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">AI Chat (Privacy-first)</h2>
              <div className="p-4 rounded bg-slate-900/40 border border-slate-700 max-h-96 overflow-auto">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`py-2 ${m.from === 'assistant' ? 'text-emerald-200' : 'text-slate-200'}`}>
                    <div className="text-xs text-slate-400">{m.from}</div>
                    <div className="mt-1">{m.text}</div>
                  </div>
                ))}
              </div>
              <ChatInput onSend={(txt) => sendChat(txt)} />
            </div>
          )}
        </section>
      </main>

      <footer className="p-4 text-xs text-slate-500 border-t border-slate-800 text-center">Project Change Lives • Demo prototype — replace mock AI with your LLM endpoint for production</footer>
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about trading, bets, or business..." className="flex-1 p-2 rounded bg-slate-800 border border-slate-700" />
      <button onClick={() => { if (text.trim()) { onSend(text); setText(""); } }} className="px-3 py-2 bg-emerald-400 text-slate-900 rounded">Send</button>
    </div>
  );
}
