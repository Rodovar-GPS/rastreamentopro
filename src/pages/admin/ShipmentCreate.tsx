import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Driver } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShipmentCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [formData, setFormData] = useState({
    tracking_code: `ROD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    customer_name: '',
    customer_document: '',
    origin: '',
    destination: '',
    description: '',
    value: '',
    freight_value: '',
    driver_percentage: '70',
    driver_id: '',
    expected_delivery_date: ''
  });

  useEffect(() => {
    supabase.from('drivers').select('*').eq('status', 'ativo').then(({ data }) => {
      if (data) setDrivers(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('shipments').insert([{
      tracking_code: formData.tracking_code,
      status: 'pendente',
      customer_name: formData.customer_name,
      customer_document: formData.customer_document,
      origin: formData.origin,
      destination: formData.destination,
      description: formData.description,
      value: parseFloat(formData.value) || 0,
      freight_value: parseFloat(formData.freight_value) || 0,
      driver_percentage: parseFloat(formData.driver_percentage) || 0,
      driver_id: formData.driver_id || null,
      expected_delivery_date: formData.expected_delivery_date
    }]);

    setLoading(false);
    if (!error) {
      navigate('/admin/cargas');
    } else {
      alert('Erro ao salvar carga: ' + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/cargas" className="text-brand-muted hover:text-brand-yellow border border-brand-border p-2 rounded-lg bg-brand-gray shadow-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight uppercase">Cadastrar Nova Carga</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-gray rounded-xl shadow-lg shadow-black/50 border border-brand-border p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider border-b border-brand-border pb-2">Cliente e Rastreio</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Código de Rastreio</label>
              <input type="text" name="tracking_code" value={formData.tracking_code} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Nome do Cliente</label>
              <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Documento do Cliente (CPF/CNPJ)</label>
              <input type="text" name="customer_document" value={formData.customer_document} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider border-b border-brand-border pb-2">Rota e Data</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Origem (Cidade/UF)</label>
              <input type="text" name="origin" value={formData.origin} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Destino (Cidade/UF)</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Previsão de Entrega</label>
              <input type="date" name="expected_delivery_date" value={formData.expected_delivery_date} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-brand-yellow text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors [color-scheme:dark]" />
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border pt-8">
          <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-5 border-b border-brand-border pb-2">Carga e Valores</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
               <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Descrição do Material</label>
               <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors resize-none placeholder-brand-muted" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Valor da NF (R$)</label>
                <input type="number" step="0.01" name="value" value={formData.value} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-yellow mb-1.5 uppercase tracking-widest">Valor do Frete (R$)</label>
                <input type="number" step="0.01" name="freight_value" value={formData.freight_value} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-yellow/30 rounded-lg bg-brand-yellow/10 text-brand-yellow text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-yellow/50" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Repasse Motorista (%)</label>
                <input type="number" step="1" name="driver_percentage" value={formData.driver_percentage} onChange={handleChange} required className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors placeholder-brand-muted" />
              </div>
            </div>
            
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">Vincular Motorista Parceiro</label>
              <select name="driver_id" value={formData.driver_id} onChange={handleChange} className="w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors">
                <option value="">Selecione (Opcional)</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.plate})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-border flex justify-end">
          <button type="submit" disabled={loading} className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-brand-yellow/10 text-sm">
            {loading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Carga</>}
          </button>
        </div>

      </form>
    </div>
  );
}
