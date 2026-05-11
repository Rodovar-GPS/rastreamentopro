import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shipment } from '../../types';
import { Plus, Search, Filter } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { format } from 'date-fns';

export function ShipmentList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    setLoading(true);
    const { data } = await supabase
      .from('shipments')
      .select('*, driver:drivers(*)')
      .order('created_at', { ascending: false });
    
    if (data) setShipments(data as any);
    setLoading(false);
  }

  const filtered = shipments.filter(s => 
    s.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-brand-gray rounded-xl shadow-lg shadow-black/50 border border-brand-border overflow-hidden">
        <div className="p-4 border-b border-brand-border flex sm:flex-row flex-col gap-4 bg-[#151515]">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Buscar por código ou cliente..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-brand-border bg-brand-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand-yellow text-sm text-white placeholder-brand-muted"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-brand-border rounded-lg text-white hover:bg-brand-black font-semibold bg-brand-gray text-sm transition-colors uppercase tracking-wide">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#151515] shadow-sm z-10">
              <tr className="text-[10px] uppercase tracking-wider text-brand-muted border-b border-brand-border">
                <th className="p-4 font-bold">Código</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Rota</th>
                <th className="p-4 font-bold">Motorista</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Previsão</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-brand-muted font-medium">Carregando dados operacionais...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-brand-muted text-sm font-medium">Nenhuma carga encontrada no sistema.</td></tr>
              ) : (
                filtered.map(shipment => (
                  <tr key={shipment.id} className="border-b border-brand-border hover:bg-brand-black transition-colors">
                    <td className="p-4">
                      <Link to={`/admin/cargas/${shipment.id}`} className="font-bold text-brand-yellow hover:text-brand-yellow-dark tracking-wide">
                        {shipment.tracking_code}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-white uppercase">{shipment.customer_name}</td>
                    <td className="p-4 text-brand-muted font-medium">{shipment.origin} <span className="mx-1 text-brand-yellow/50">&rarr;</span> {shipment.destination}</td>
                    <td className="p-4 text-brand-muted font-medium"><span className="bg-[#111] px-2 py-1 rounded text-white">{shipment.driver?.name || 'Não atribuído'}</span></td>
                    <td className="p-4"><StatusBadge status={shipment.status} /></td>
                    <td className="p-4 text-brand-muted font-mono">{format(new Date(shipment.expected_delivery_date), 'dd/MM/yyyy')}</td>
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
