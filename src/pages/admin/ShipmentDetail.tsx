import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shipment, TrackingPoint, DeliveryProof } from '../../types';
import { Loading } from '../../components/Loading';
import { ArrowLeft, Save, FileImage } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { ShipmentMap } from '../../components/ShipmentMap';

export function ShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const [proof, setProof] = useState<DeliveryProof | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    if (!id) return;
    setLoading(true);

    const { data: shipmentData } = await supabase
      .from('shipments')
      .select('*, driver:drivers(*)')
      .eq('id', id)
      .single();

    if (shipmentData) {
      setShipment(shipmentData as Shipment);
      
      const { data: pointsData } = await supabase
        .from('tracking_points')
        .select('*')
        .eq('shipment_id', shipmentData.id)
        .order('created_at', { ascending: true });

      if (pointsData) setPoints(pointsData as TrackingPoint[]);

      if (shipmentData.status === 'entregue') {
         const { data: proofData } = await supabase
          .from('delivery_proofs')
          .select('*')
          .eq('shipment_id', shipmentData.id)
          .single();
          if (proofData) setProof(proofData as DeliveryProof);
      }
    }
    setLoading(false);
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!shipment) return;
    setSaving(true);
    const newStatus = e.target.value;
    
    // In a real app we might handle proof deletion or other state transitions here
    const { error } = await supabase
      .from('shipments')
      .update({ status: newStatus })
      .eq('id', shipment.id);
      
    if (!error) {
      setShipment({ ...shipment, status: newStatus as any });
    }
    setSaving(false);
  };

  if (loading) return <Loading />;
  if (!shipment) return <div>Carga não encontrada.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/cargas" className="text-brand-muted hover:text-brand-yellow border border-brand-border p-2 rounded-lg bg-brand-gray shadow-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white tracking-tight">Carga <span className="text-brand-yellow">{shipment.tracking_code}</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider hidden sm:inline">Alterar Status</span>
            <select 
              value={shipment.status} 
              onChange={handleStatusChange}
              disabled={saving}
              className="px-3 py-1.5 border border-brand-border bg-brand-black text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:opacity-50"
            >
              <option value="pendente">Pendente</option>
              <option value="em_transito">Em Trânsito</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <StatusBadge status={shipment.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
           <div className="bg-brand-gray rounded-xl shadow-lg shadow-black/50 border border-brand-border p-6">
              <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-brand-border pb-2">Informações Detalhadas</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                 <div className="bg-[#151515] p-3 rounded-lg border border-brand-border">
                   <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Cliente</p>
                   <p className="font-bold text-white">{shipment.customer_name}</p>
                   <p className="text-xs text-brand-muted mt-1 font-mono">{shipment.customer_document}</p>
                 </div>
                 <div className="bg-[#151515] p-3 rounded-lg border border-brand-border">
                   <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Rota</p>
                   <p className="font-bold text-white">{shipment.origin}</p>
                   <p className="font-bold text-white"><span className="text-brand-yellow/50">&rarr;</span> {shipment.destination}</p>
                 </div>
                 <div className="col-span-2 bg-[#151515] p-3 rounded-lg border border-brand-border">
                   <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Descrição do Item</p>
                   <p className="font-bold text-white">{shipment.description}</p>
                 </div>
                 <div className="col-span-2 bg-[#151515] p-3 rounded-lg border border-brand-border flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Nota Fiscal</p>
                      <p className="font-bold text-white text-lg tracking-tight">R$ {shipment.value.toFixed(2)}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-wider mb-1">Frete Total</p>
                      <p className="font-bold text-brand-yellow text-lg tracking-tight">R$ {shipment.freight_value.toFixed(2)}</p>
                   </div>
                 </div>
              </div>
           </div>

           <div className="bg-brand-black rounded-xl overflow-hidden border border-brand-border relative map-grid h-[400px]">
             <div className="absolute top-4 left-4 z-10 bg-brand-gray shadow-lg border border-brand-border px-3 py-1.5 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-yellow status-pulse"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tracking GPS Ativo</span>
             </div>
             <ShipmentMap points={points} className="h-full w-full opacity-90" />
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-brand-gray rounded-xl shadow-lg border border-brand-border p-6 shadow-black/50">
              <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-brand-border pb-2">Motorista Atribuído</h2>
              {shipment.driver ? (
                 <div className="space-y-4 text-sm mt-4">
                   <div>
                     <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Nome</p>
                     <p className="font-bold text-white">{shipment.driver.name}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Contato</p>
                     <p className="font-bold text-white font-mono">{shipment.driver.phone}</p>
                   </div>
                   <div className="bg-[#151515] p-3 rounded-lg border border-brand-border flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Veículo</p>
                       <p className="font-bold text-white text-xs">{shipment.driver.vehicle_model}</p>
                     </div>
                     <span className="font-mono bg-brand-black border border-brand-border px-2 py-0.5 rounded text-[10px] uppercase font-bold text-brand-yellow tracking-widest">{shipment.driver.plate}</span>
                   </div>
                   
                   <div className="pt-4 border-t border-brand-border">
                      <div className="flex justify-between items-center bg-brand-yellow/5 p-3 rounded-lg border border-brand-yellow/20 border-dashed">
                        <div>
                          <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-wider mb-1">Repasse Motorista ({shipment.driver_percentage}%)</p>
                          <p className="font-bold text-brand-yellow text-xl tracking-tight">R$ {((shipment.freight_value * shipment.driver_percentage) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                   </div>
                 </div>
              ) : (
                <p className="text-sm text-brand-muted mt-4 font-medium">Nenhum motorista vinculado.</p>
              )}
           </div>

           {proof && (
             <div className="bg-brand-gray rounded-xl shadow-lg border border-brand-border p-6 shadow-black/50">
                <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-brand-border pb-2 flex items-center justify-between">
                  <span>Comprovante de Entrega</span>
                  <FileImage className="w-3.5 h-3.5 text-green-500" />
                </h2>
                <a href={proof.image_url} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-brand-border bg-brand-black hover:border-brand-yellow transition-colors shadow-sm mt-4">
                  <img src={proof.image_url} alt="Comprovante" className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100" />
                </a>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
