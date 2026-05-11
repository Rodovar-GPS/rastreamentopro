import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shipment, TrackingPoint, DeliveryProof } from '../../types';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { PackageX, MapPin, Calendar, Box, Package, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { ShipmentMap } from '../../components/ShipmentMap';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TrackingDetail() {
  const { codigo } = useParams<{ codigo: string }>();
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const [proof, setProof] = useState<DeliveryProof | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!codigo) return;
      setLoading(true);

      const { data: shipmentData, error: err } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', codigo)
        .single();

      if (shipmentData) {
        setShipment(shipmentData as Shipment);
        
        // Load points
        const { data: pointsData } = await supabase
          .from('tracking_points')
          .select('*')
          .eq('shipment_id', shipmentData.id)
          .order('created_at', { ascending: true });

        if (pointsData) setPoints(pointsData as TrackingPoint[]);

        // Load proof
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

    loadData();
  }, [codigo]);

  if (loading) return <Loading fullScreen />;

  if (!shipment) {
    return (
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8">
        <EmptyState 
          icon={PackageX} 
          title="Carga não encontrada" 
          description={`Não encontramos nenhuma carga com o código ${codigo}.`}
          action={
            <Link to="/rastrear" className="text-blue-600 hover:underline font-medium">
              Tentar novamente
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <Link to="/rastrear" className="inline-flex items-center text-sm font-bold text-brand-muted hover:text-brand-yellow transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nova consulta
        </Link>

        {/* Header Card */}
        <div className="bg-brand-gray rounded-xl shadow-xl shadow-black/50 border border-brand-border overflow-hidden flex flex-col">
          <div className="border-b border-brand-border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#151515]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center border border-brand-yellow/30">
                  <Package className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">{shipment.tracking_code}</h1>
              </div>
              <p className="text-brand-muted text-[11px] font-bold uppercase tracking-wider ml-11">Atualizado em {format(new Date(shipment.updated_at), "dd/MM/yyyy 'às' HH:mm")}</p>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="space-y-6 md:col-span-2">
              <div>
                <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-3">
                  Informações da Carga
                </h3>
                <div className="bg-[#151515] p-4 rounded-xl border border-brand-border space-y-3 text-sm">
                  <p className="flex justify-between border-b border-brand-border pb-2"><span className="font-medium text-brand-muted">Cliente</span> <span className="font-semibold text-white">{shipment.customer_name}</span></p>
                  <p className="flex justify-between border-b border-brand-border pb-2"><span className="font-medium text-brand-muted">Previsão</span> <span className="font-semibold text-white">{format(new Date(shipment.expected_delivery_date), "dd/MM/yyyy")}</span></p>
                  <div>
                    <span className="font-medium text-brand-muted block mb-1">Descrição</span> 
                    <span className="font-semibold text-white text-xs">{shipment.description || '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-4">
                  Rota
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-brand-border">
                  <div className="relative flex items-start gap-4">
                     <div className="absolute left-[-24px] top-1 w-2.5 h-2.5 rounded-full bg-brand-muted ring-4 ring-brand-black" />
                     <div>
                       <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Origem</p>
                       <p className="font-semibold text-white text-sm mt-0.5">{shipment.origin}</p>
                     </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                     <div className="absolute left-[-24px] top-1 w-2.5 h-2.5 rounded-full bg-brand-yellow ring-4 ring-brand-black" />
                     <div>
                       <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Destino</p>
                       <p className="font-semibold text-white text-sm mt-0.5">{shipment.destination}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 h-[400px] bg-brand-dark rounded-xl overflow-hidden border border-brand-border relative map-grid">
              <ShipmentMap points={points} className="w-full h-full opacity-90" />
            </div>
          </div>
        </div>

        {proof && (
          <div className="bg-brand-gray rounded-xl shadow-xl shadow-black/50 border border-brand-border p-6 flex flex-col">
            <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-brand-border pb-2">Comprovante de Entrega</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-64 rounded-xl overflow-hidden border border-brand-border shadow-sm bg-brand-black">
                 <img src={proof.image_url} alt="Comprovante de entrega" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 space-y-2 text-sm bg-brand-black p-4 rounded-xl border border-brand-border w-full">
                 <p className="flex justify-between border-b border-brand-border pb-2"><span className="font-medium text-brand-muted">Data de Entrega</span> <span className="font-semibold text-white">{format(new Date(proof.created_at), "dd/MM/yyyy HH:mm")}</span></p>
                 {proof.latitude && proof.longitude && (
                   <p className="flex justify-between"><span className="font-medium text-brand-muted">Localização</span> <span className="font-mono text-xs text-xs text-brand-muted">{proof.latitude.toFixed(6)}, {proof.longitude.toFixed(6)}</span></p>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
