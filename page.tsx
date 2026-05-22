'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Dashboard() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [ticker, setTicker] = useState('ZM');
  const [scanResults, setScanResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScanner = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await res.json();
      setScanResults(data);
    } catch (e) {
      alert("Make sure your Python server is running!");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* LEFT PANEL: The Scanner */}
      <div className="w-1/2 p-8 border-r overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Yield Scanner</h1>
        
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="border-2 border-gray-300 p-3 rounded-lg w-32 font-bold text-lg uppercase"
            placeholder="TICKER"
          />
          <button onClick={runScanner} className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800">
            {loading ? "Scanning..." : "Scan Chain"}
          </button>
        </div>
        
        {scanResults && scanResults.opportunities && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-bold text-xl mb-1">{scanResults.ticker} @ ${scanResults.current_price}</h2>
            <p className="text-sm text-gray-500 mb-6">Expiring: {scanResults.expiration} ({scanResults.dte} DTE)</p>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 text-gray-400 text-sm">
                  <th className="pb-2">Strike</th>
                  <th className="pb-2">Premium</th>
                  <th className="pb-2">Yield / Wk</th>
                  <th className="pb-2">Downside Pro.</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.opportunities.map((opp: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4 font-semibold">${opp.strike}</td>
                    <td className="py-4">${opp.premium}</td>
                    <td className="py-4 text-green-600 font-bold">{opp.weekly_yield}%</td>
                    <td className="py-4">{opp.downside_protection}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: The AI Copilot */}
      <div className="w-1/2 flex flex-col p-8 bg-white">
        <h1 className="text-2xl font-bold mb-6">AI Copilot</h1>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 border rounded-xl p-6 mb-6">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">Ask me to analyze a trade or review an earnings setup...</p>
          )}
          {messages.map(m => (
            <div key={m.id} className={`mb-6 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            className="flex-1 border-2 border-gray-200 p-4 rounded-xl focus:border-blue-600 outline-none"
            value={input}
            placeholder="Type your question..."
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
      
    </div>
  );
}'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Dashboard() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [ticker, setTicker] = useState('ZM');
  const [scanResults, setScanResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScanner = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await res.json();
      setScanResults(data);
    } catch (e) {
      alert("Make sure your Python server is running!");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* LEFT PANEL: The Scanner */}
      <div className="w-1/2 p-8 border-r overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Yield Scanner</h1>
        
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="border-2 border-gray-300 p-3 rounded-lg w-32 font-bold text-lg uppercase"
            placeholder="TICKER"
          />
          <button onClick={runScanner} className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800">
            {loading ? "Scanning..." : "Scan Chain"}
          </button>
        </div>
        
        {scanResults && scanResults.opportunities && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-bold text-xl mb-1">{scanResults.ticker} @ ${scanResults.current_price}</h2>
            <p className="text-sm text-gray-500 mb-6">Expiring: {scanResults.expiration} ({scanResults.dte} DTE)</p>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 text-gray-400 text-sm">
                  <th className="pb-2">Strike</th>
                  <th className="pb-2">Premium</th>
                  <th className="pb-2">Yield / Wk</th>
                  <th className="pb-2">Downside Pro.</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.opportunities.map((opp: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4 font-semibold">${opp.strike}</td>
                    <td className="py-4">${opp.premium}</td>
                    <td className="py-4 text-green-600 font-bold">{opp.weekly_yield}%</td>
                    <td className="py-4">{opp.downside_protection}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: The AI Copilot */}
      <div className="w-1/2 flex flex-col p-8 bg-white">
        <h1 className="text-2xl font-bold mb-6">AI Copilot</h1>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 border rounded-xl p-6 mb-6">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">Ask me to analyze a trade or review an earnings setup...</p>
          )}
          {messages.map(m => (
            <div key={m.id} className={`mb-6 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            className="flex-1 border-2 border-gray-200 p-4 rounded-xl focus:border-blue-600 outline-none"
            value={input}
            placeholder="Type your question..."
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
      
    </div>
  );
}