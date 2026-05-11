import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Driver } from '../../types';
import { Users, Search, Plus } from 'lucide-react';

export function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    setLoading(true);
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .order('name');
    if (data) setDrivers(data);
    setLoading(false);
  }

  const filtered = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-brand-gray rounded-xl shadow-lg shadow-black/50 border border-brand-border overflow-hidden">
        <div className="p-4 border-b border-brand-border bg-[#151515] flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou placa..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-brand-border rounded-lg w-full bg-brand-black focus:outline-none focus:ring-2 focus:ring-brand-yellow block text-sm text-white placeholder-brand-muted"
            />
          </div>
          <button className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black px-4 py-2 rounded-lg font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors text-sm w-full sm:w-auto shadow-lg shadow-brand-yellow/10">
            <Plus className="w-4 h-4" />
            Novo Motorista
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#151515] shadow-sm z-10">
              <tr className="text-[10px] uppercase text-brand-muted border-b border-brand-border tracking-wider">
                <th className="p-4 font-bold">Nome</th>
                <th className="p-4 font-bold">Telefone</th>
                <th className="p-4 font-bold">Veículo / Placa</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-brand-muted font-medium">Carregando frota operacional...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-brand-muted text-sm font-medium">Nenhum motorista encontrado no controle interno.</td></tr>
              ) : (
                filtered.map(driver => (
                  <tr key={driver.id} className="border-b border-brand-border hover:bg-brand-black transition-colors">
                    <td className="p-4 font-bold text-white uppercase">{driver.name}</td>
                    <td className="p-4 text-brand-muted font-mono">{driver.phone}</td>
                    <td className="p-4 text-brand-muted">
                      {driver.vehicle_model} <span className="ml-2 font-mono bg-brand-black px-2 py-1 rounded text-[10px] font-bold text-brand-yellow border border-brand-border uppercase tracking-widest">{driver.plate}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${driver.status === 'ativo' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#1A1A1A] text-brand-muted border-brand-border'}`}>
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
