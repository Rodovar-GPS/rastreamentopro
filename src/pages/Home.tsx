import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Truck, ShieldCheck } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const code = fd.get('code') as string;
    if (code) {
      navigate(`/rastrear/${code.trim()}`);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-brand-black">
      {/* Hero Section */}
      <section className="bg-brand-black border-b border-brand-border text-white py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8c738759be?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase leading-tight text-white">
            Rastreamento Inteligente <br className="hidden sm:block" /> de Cargas em Todo o Brasil
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-brand-muted font-medium">
            Acompanhe cargas, rotas, comprovantes de entrega e motoristas terceiros em tempo real. Solução profissional RODOVAR.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-10 bg-brand-gray/50 backdrop-blur-md p-2 rounded-xl flex sm:flex-row flex-col gap-2 border border-brand-border shadow-2xl">
            <input 
              type="text" 
              name="code"
              placeholder="Digite o código (Ex: ROD-2025-0001)" 
              className="flex-1 px-4 py-3 rounded-lg bg-brand-black text-white font-medium placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-brand-yellow border border-brand-border"
              required
            />
            <button type="submit" className="bg-brand-yellow hover:bg-brand-yellow-dark text-[#050505] px-8 py-3 rounded-lg font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-yellow/10">
              Rastrear Minha Carga
            </button>
          </form>
          <div className="pt-4">
             <Link to="/admin/login" className="inline-block px-8 py-3 border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-[#050505] rounded-lg font-bold transition-colors uppercase tracking-wide text-sm shadow-lg shadow-brand-yellow/10 cursor-pointer">
               Acessar Painel
             </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-brand-black flex-1 border-t border-brand-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-gray border border-brand-border text-brand-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/5">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Rastreamento Local</h3>
              <p className="text-sm text-brand-muted font-medium">Localização exata em tempo real durante as entregas.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-gray border border-brand-border text-brand-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/5">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Comprovante Digital</h3>
              <p className="text-sm text-brand-muted font-medium">Auditoria e fotos com localização no momento da entrega.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-gray border border-brand-border text-brand-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/5">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Cobertura Nacional</h3>
              <p className="text-sm text-brand-muted font-medium">Logística em todo Brasil acompanhada no painel unificado.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-gray border border-brand-border text-brand-yellow rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/5">
                <ArrowRight className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Motoristas Terceiros</h3>
              <p className="text-sm text-brand-muted font-medium">Gestão corporativa e cálculo de repasses diretos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
