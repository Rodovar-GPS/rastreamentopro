import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Shipment } from '../../types';
import { Loading } from '../../components/Loading';
import { MapPin, Navigation, CheckCircle, UploadCloud, AlertCircle } from 'lucide-react';

export function DriverTracking() {
  const { codigo } = useParams<{ codigo: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingActive, setTrackingActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastPos, setLastPos] = useState<{lat: number, lng: number} | null>(null);
  
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!codigo) return;
      const { data } = await supabase
        .from('shipments')
        .select('*, driver:drivers(*)')
        .eq('tracking_code', codigo)
        .single();
      
      if (data) setShipment(data as Shipment);
      setLoading(false);
    }
    load();

    return () => stopTracking();
  }, [codigo]);

  const startTracking = async () => {
    if (!shipment) return;
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    // Update status to em_transito
    if (shipment.status === 'pendente') {
      await supabase.from('shipments').update({ status: 'em_transito' }).eq('id', shipment.id);
      setShipment({ ...shipment, status: 'em_transito' });
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        setLastPos({ lat: latitude, lng: longitude });

        // Save tracking point
        await supabase.from('tracking_points').insert([{
          shipment_id: shipment.id,
          latitude,
          longitude,
          accuracy,
          speed,
          heading
        }]);
      },
      (err) => {
        setError(`Erro de GPS: ${err.message}`);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    watchIdRef.current = id;
    setTrackingActive(true);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingActive(false);
  };

  const handleFinish = async () => {
    if (!file || !shipment) {
      setError('Selecione uma foto do comprovante.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${shipment.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('delivery-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('delivery-proofs')
        .getPublicUrl(filePath);

      const proofUrl = publicUrlData.publicUrl;

      // Insert proof record
      await supabase.from('delivery_proofs').insert([{
        shipment_id: shipment.id,
        image_url: proofUrl,
        latitude: lastPos?.lat || null,
        longitude: lastPos?.lng || null
      }]);

      // Update shipment
      await supabase.from('shipments').update({ 
        status: 'entregue',
        proof_url: proofUrl
      }).eq('id', shipment.id);

      setShipment({ ...shipment, status: 'entregue', proof_url: proofUrl });
      stopTracking();

    } catch (err: any) {
      setError(`Erro ao finalizar: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!shipment) return <div className="p-8 text-center">Carga não encontrada.</div>;

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      <div className="bg-[#050505] text-white p-8 pb-12 rounded-b-3xl shadow-xl shadow-black border-b border-brand-border">
        <h1 className="text-2xl font-bold mb-1 uppercase tracking-wider">Monitoramento</h1>
        <p className="text-brand-yellow font-mono font-bold text-sm">OS: {shipment.tracking_code}</p>
      </div>

      <div className="px-4 space-y-4 -mt-6 relative">
        <div className="bg-brand-gray rounded-2xl shadow-xl border border-brand-border p-6 shadow-black/50">
           <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4">Resumo da Viagem</h2>
           <div className="space-y-4 text-sm mt-2">
             <div className="flex gap-4">
               <MapPin className="w-6 h-6 text-brand-yellow shrink-0 mt-0.5" />
               <div className="space-y-2">
                 <p className="font-bold text-white uppercase tracking-wide">{shipment.origin}</p>
                 <div className="h-4 w-0.5 bg-brand-yellow/30 ml-2"></div>
                 <p className="font-bold text-white uppercase tracking-wide">{shipment.destination}</p>
               </div>
             </div>
             <div className="pt-4 mt-2 border-t border-brand-border flex justify-between items-center bg-[#151515] p-4 rounded-xl">
               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">A Receber:</span>
               <span className="font-bold text-brand-yellow tracking-tight text-xl">
                 R$ {((shipment.freight_value * shipment.driver_percentage) / 100).toFixed(2)}
               </span>
             </div>
             {shipment.description && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block mb-1">Carga:</span>
                  <span className="font-bold text-white uppercase">{shipment.description}</span>
                </div>
             )}
           </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-bold flex items-start gap-3 border border-red-500/20 shadow-lg">
             <AlertCircle className="w-5 h-5 shrink-0" />
             <p>{error}</p>
          </div>
        )}

        {shipment.status === 'entregue' ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center shadow-xl">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-500 uppercase tracking-widest">Entrega Concluída</h3>
            <p className="text-green-500/80 mt-2 font-medium">Operação registrada no sistema com sucesso.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {!trackingActive ? (
              <button 
                onClick={startTracking}
                className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black rounded-2xl p-5 font-bold text-lg uppercase tracking-wider flex justify-center items-center gap-3 transition-colors shadow-lg shadow-brand-yellow/10"
              >
                 <Navigation className="w-6 h-6" />
                 {shipment.status === 'pendente' ? 'Aceitar e Iniciar Viagem' : 'Retomar Telemetria'}
              </button>
            ) : (
              <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg">
                 <Navigation className="w-10 h-10 text-brand-yellow animate-pulse" />
                 <p className="font-bold uppercase tracking-widest text-brand-yellow text-center text-sm">Sinal de Telemetria Operante<br/><span className="text-xs text-brand-yellow/70">Transmitindo localização...</span></p>
                 <button onClick={stopTracking} className="mt-2 text-xs font-bold text-brand-muted uppercase tracking-widest hover:text-white transition-colors">Pausar Transmissão</button>
              </div>
            )}

            {trackingActive && (
               <div className="bg-brand-gray border text-center border-brand-border rounded-2xl p-6 shadow-xl">
                 <h3 className="font-bold uppercase tracking-widest text-white mb-6">Finalização Operacional</h3>
                 
                 <label className="block w-full cursor-pointer bg-brand-black border-2 border-brand-border border-dashed rounded-xl p-8 hover:border-brand-yellow transition-colors group">
                   <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                   <UploadCloud className="w-10 h-10 text-brand-muted mx-auto mb-3 group-hover:text-brand-yellow transition-colors" />
                   <span className="text-xs font-bold uppercase tracking-widest text-brand-muted group-hover:text-white transition-colors block">
                     {file ? file.name : 'Capturar Comprovante'}
                   </span>
                 </label>

                 <button 
                  onClick={handleFinish}
                  disabled={!file || uploading}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 rounded-xl p-5 font-bold uppercase tracking-wider text-lg transition-colors shadow-lg shadow-green-500/20"
                 >
                   {uploading ? 'Transmitindo...' : 'Confirmar Entrega'}
                 </button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
