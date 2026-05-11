import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col font-sans">
      <header className="bg-brand-black text-white shadow-md z-10 sticky top-0 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-brand-yellow text-[#050505] rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-brand-yellow/20 group-hover:scale-105 transition-transform">R</div>
             <div>
                <h1 className="text-xl font-bold leading-none uppercase tracking-wider text-white">Rodovar</h1>
                <p className="text-xs text-brand-yellow font-medium uppercase tracking-widest mt-0.5">Tracking</p>
             </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/rastrear" className="text-sm font-semibold hover:text-brand-yellow text-slate-300 transition-colors uppercase tracking-wide">
              Rastrear Carga
            </Link>
            <Link to="/admin/login" className="text-xs font-bold bg-brand-dark hover:bg-[#222] border border-brand-border text-white px-4 py-2 rounded-lg transition-colors uppercase">
              Acesso Restrito
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-brand-black text-brand-muted py-8 text-center text-sm border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} RODOVAR Logística. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
