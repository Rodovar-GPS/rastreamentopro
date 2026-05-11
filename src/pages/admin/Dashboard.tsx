import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Truck, CheckCircle2, Users } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { ShipmentMap } from '../../components/ShipmentMap';
import { Loading } from '../../components/Loading';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    emTransito: 0,
    entregue: 0,
    motoristas: 0
  });
  const [activePoints, setActivePoints] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      
      const [
        { count: totalCount },
        { count: inTransitCount },
        { count: deliveredCount },
        { count: driversCount },
        { data: pointsData }
      ] = await Promise.all([
        supabase.from('shipments').select('*', { count: 'exact', head: true }),
        supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'em_transito'),
        supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'entregue'),
        supabase.from('drivers').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('tracking_points').select('latitude, longitude, shipment_id, created_at').order('created_at', { ascending: false }).limit(50)
      ]);

      setStats({
        total: totalCount || 0,
        emTransito: inTransitCount || 0,
        entregue: deliveredCount || 0,
        motoristas: driversCount || 0
      });

      if (pointsData) {
        // Simple distinct logic for recent points per shipment
        const distinctPoints = pointsData.filter((v, i, a) => a.findIndex(t => (t.shipment_id === v.shipment_id)) === i);
        setActivePoints(distinctPoints);
      }

      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Cargas" value={stats.total} icon={Package} trend={{ value: 12, isPositive: true }} />
        <StatCard 
          title="Em Trânsito" 
          value={stats.emTransito} 
          icon={Truck} 
          subtitle="Ativas agora"
          subtitleClass="text-brand-yellow font-bold text-xs"
          progress={{ value: stats.total > 0 ? (stats.emTransito / stats.total) * 100 : 0, colorClass: "bg-brand-yellow" }}
        />
        <StatCard 
          title="Entregues" 
          value={stats.entregue} 
          icon={CheckCircle2} 
          subtitle={`Taxa de sucesso: ${stats.total > 0 ? ((stats.entregue / stats.total) * 100).toFixed(1) : '100'}%`}
          subtitleClass="text-brand-muted"
        />
        <StatCard 
          title="Motoristas On" 
          value={stats.motoristas} 
          icon={Users} 
          subtitle={`Disponíveis para frete: ${Math.floor(stats.motoristas * 0.4)}`} /* Simulated availability */
          subtitleClass="text-green-500"
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
        
        {/* Map Column (Spans 2) */}
        <div className="lg:col-span-2 bg-brand-gray border border-brand-border rounded-xl flex flex-col shadow-lg overflow-hidden">
          <div className="p-4 border-b border-brand-border flex justify-between items-center bg-[#151515]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Centro de Monitoramento</h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-brand-muted font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-brand-yellow status-pulse"></div>Sinal Operante
              </span>
            </div>
          </div>
          <div className="flex-1 relative map-grid">
            <ShipmentMap points={activePoints} className="h-full w-full opacity-90" zoom={4} defaultCenter={[-15.7801, -47.9292]} />
          </div>
        </div>

        {/* Latest Shipments (Spans 1) */}
        <div className="bg-brand-gray border border-brand-border rounded-xl flex flex-col shadow-lg overflow-hidden">
          <div className="p-4 border-b border-brand-border bg-[#151515]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cargas em Trânsito</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#151515] shadow-sm z-10">
                <tr className="text-[10px] uppercase font-bold text-brand-muted border-b border-brand-border">
                  <th className="p-4 tracking-wider">Últimas Atualizações</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {activePoints.slice(0, 8).map((point, i) => (
                  <tr key={i} className="border-b border-brand-border hover:bg-brand-black transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-brand-yellow status-pulse"></div>
                         <div>
                            <p className="font-bold text-white font-mono text-[10px]">PING GPS RODOVAR</p>
                            <p className="text-brand-muted mt-0.5">{point.latitude?.toFixed(4)}, {point.longitude?.toFixed(4)}</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {activePoints.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-brand-muted text-sm font-medium">Nenhum sinal no momento</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-brand-border bg-[#151515] text-center">
            <a href="/admin/cargas" className="text-[10px] font-bold text-brand-yellow hover:text-brand-yellow-dark uppercase tracking-widest transition-colors">Visualizar Malha &rarr;</a>
          </div>
        </div>

      </div>
    </>
  );
}
