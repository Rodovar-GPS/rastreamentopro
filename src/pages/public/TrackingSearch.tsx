import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export function TrackingSearch() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/rastrear/${code.trim()}`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-brand-black p-4">
      <div className="w-full max-w-lg bg-brand-gray rounded-2xl shadow-xl overflow-hidden border border-brand-border shadow-black/50">
        <div className="bg-[#151515] p-8 text-center border-b border-brand-border">
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Consultar Carga</h2>
          <p className="text-brand-muted">Acompanhe o status e a localização em tempo real.</p>
        </div>
        
        <form onSubmit={handleSearch} className="p-8 space-y-6">
          <div>
            <label htmlFor="code" className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">
              Código de Rastreio
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: ROD-2025-0001"
              className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-black text-white focus:ring-2 focus:ring-brand-yellow outline-none transition-shadow placeholder-[#555]"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow-dark text-[#050505] font-bold uppercase tracking-wide py-3 px-4 rounded-lg transition-colors shadow-lg shadow-brand-yellow/10"
          >
            <Search className="w-5 h-5" />
            Buscar Encomenda
          </button>
        </form>
      </div>
    </div>
  );
}
