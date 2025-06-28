import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function App() {
  const [view, setView] = useState('menu');

  // Tool 1: Calcular pensión AFP
  const [totalAfp, setTotalAfp] = useState(() => localStorage.getItem('totalAfp') || '');
  const [pension, setPension] = useState(null);
  const calcPension = () => {
    const total = parseFloat(totalAfp) || 0;
    const mensual = (total * 0.04 / 12).toFixed(2);
    setPension(mensual);
    localStorage.setItem('totalAfp', totalAfp);
  };

  // Tool 2: Valor futuro
  const [principal, setPrincipal] = useState(() => localStorage.getItem('principal') || '');
  const [rate, setRate] = useState(() => localStorage.getItem('rate') || '');
  const [years, setYears] = useState(() => localStorage.getItem('years') || '');
  const [futureValue, setFutureValue] = useState(null);
  const [history, setHistory] = useState([]);
  const calcFuture = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const n = parseInt(years) || 0;
    const FV = +(P * Math.pow(1 + r, n)).toFixed(2);
    const newHistory = [];
    for (let i = 1; i <= n; i++) {
      newHistory.push({ year: `Year ${i}`, value: +(P * Math.pow(1 + r, i)).toFixed(2) });
    }
    setHistory(newHistory);
    setFutureValue(FV);
    setView('chartFuture');
    localStorage.setItem('principal', principal);
    localStorage.setItem('rate', rate);
    localStorage.setItem('years', years);
  };

  // Tool 3: Meta de jubilación
  const [goal, setGoal] = useState(() => localStorage.getItem('goal') || '');
  const [assetName, setAssetName] = useState('');
  const [assetAmount, setAssetAmount] = useState('');
  const [assets, setAssets] = useState(() => {
    const stored = localStorage.getItem('assets');
    return stored ? JSON.parse(stored) : [];
  });
  const addAsset = () => {
    const amount = parseFloat(assetAmount) || 0;
    if (assetName && amount > 0) {
      const updatedAssets = [...assets, { name: assetName, value: amount }];
      setAssets(updatedAssets);
      setAssetName('');
      setAssetAmount('');
      localStorage.setItem('assets', JSON.stringify(updatedAssets));
    }
  };
  useEffect(() => {
    localStorage.setItem('goal', goal);
  }, [goal]);
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const goalReached = totalAssets >= parseFloat(goal || 0);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

  const container = {
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    background: 'linear-gradient(135deg, #f2f6fa 0%, #e0eafc 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const card = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
    marginBottom: '20px'
  };
  const btn = {
    padding: '12px 24px',
    margin: '8px 0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    width: '100%',
    fontWeight: 'bold',
    fontSize: '1rem'
  };
  const backBtn = { ...btn, backgroundColor: '#6c757d' };
  const input = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  };

  return (
    <div style={container}>
      <div style={card}>
        {view === 'menu' && (
          <>
            <h2>Jubilación App</h2>
            <button style={btn} onClick={() => setView('tool1')}>Calcular pensión AFP</button>
            <button style={btn} onClick={() => setView('tool2')}>Calcular valor futuro</button>
            <button style={btn} onClick={() => setView('tool3')}>Meta de jubilación</button>
          </>
        )}

        {view === 'tool1' && (
          <>
            <h3>Calcular pensión AFP</h3>
            <input style={input} type="number" placeholder="Total ahorrado en AFP" value={totalAfp} onChange={e => setTotalAfp(e.target.value)} />
            <button style={btn} onClick={calcPension}>Calcular</button>
            {pension !== null && <p>Tu pensión mensual: <strong>${pension}</strong></p>}
            <button style={backBtn} onClick={() => setView('menu')}>Atrás</button>
          </>
        )}

        {view === 'tool2' && (
          <>
            <h3>Calcular valor futuro</h3>
            <input style={input} type="number" placeholder="Monto inicial" value={principal} onChange={e => setPrincipal(e.target.value)} />
            <input style={input} type="number" placeholder="% rentabilidad anual" value={rate} onChange={e => setRate(e.target.value)} />
            <input style={input} type="number" placeholder="Años" value={years} onChange={e => setYears(e.target.value)} />
            <button style={btn} onClick={calcFuture}>Calcular & Ver gráfico</button>
            <button style={backBtn} onClick={() => setView('menu')}>Atrás</button>
          </>
        )}

        {view === 'chartFuture' && (
          <>
            <h3>Evolución Valor Futuro</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <button style={backBtn} onClick={() => setView('menu')}>Atrás</button>
          </>
        )}

        {view === 'tool3' && (
          <>
            <h3>Meta de jubilación</h3>
            <input style={input} type="number" placeholder="Meta deseada" value={goal} onChange={e => setGoal(e.target.value)} />
            <input style={input} type="text" placeholder="Nombre del activo" value={assetName} onChange={e => setAssetName(e.target.value)} />
            <input style={input} type="number" placeholder="Cantidad en dinero" value={assetAmount} onChange={e => setAssetAmount(e.target.value)} />
            <button style={btn} onClick={addAsset}>Agregar activo</button>
            <PieChart width={280} height={200}>
              <Pie data={assets} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
            <p style={{ fontWeight: 'bold', color: goalReached ? 'green' : '#333' }}>
              Total: ${totalAssets.toFixed(2)} {goalReached && '(¡Meta lograda!)'}
            </p>
            <button style={backBtn} onClick={() => setView('menu')}>Atrás</button>
          </>
        )}
      </div>
    </div>
  );
}
