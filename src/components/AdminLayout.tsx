import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, Truck, Users, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Cargas', path: '/admin/cargas', icon: Package },
    { label: 'Motoristas', path: '/admin/motoristas', icon: Users },
  ];

  const getPageTitle = () => {
    if (location.pathname.includes('/cargas')) return 'Gerenciar Cargas';
    if (location.pathname.includes('/motoristas')) return 'Motoristas Parceiros';
    return 'Dashboard Operacional';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-black">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black border-r border-brand-border text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-brand-border flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-3 group">
             <div className="w-8 h-8 bg-brand-yellow text-brand-black rounded flex items-center justify-center font-bold text-lg group-hover:bg-brand-yellow-dark transition-colors">R</div>
             <div>
                <h1 className="text-lg font-bold leading-none uppercase tracking-wider text-white">Rodovar</h1>
                <p className="text-[10px] text-brand-yellow uppercase tracking-tighter">Logistics & Tracking</p>
             </div>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive 
                    ? "sidebar-active text-brand-black border-l-[3px] border-brand-yellow" 
                    : "text-brand-muted hover:bg-brand-gray hover:text-brand-yellow"
                )}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="uppercase tracking-wide font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-brand-border">
          <div className="bg-brand-gray rounded-lg p-3 flex items-center gap-3 border border-brand-border">
             <div className="w-8 h-8 rounded-full bg-brand-black border border-brand-border text-brand-yellow flex items-center justify-center font-bold text-xs">
                A
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-white truncate uppercase">Admin Rodovar</p>
               <p className="text-[10px] text-brand-muted truncate">admin@rodovar.com.br</p>
             </div>
             <button
               onClick={handleLogout}
               className="text-brand-muted hover:text-red-500 transition-colors"
               title="Sair"
             >
               <LogOut className="w-[14px] h-[14px]" strokeWidth={2} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-brand-black text-white">
        <header className="h-16 bg-brand-black border-b border-brand-border px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-white uppercase tracking-wider">{getPageTitle()}</h2>
             <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase tracking-wide hidden sm:inline-block border border-green-500/20">Sistemas Online</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Buscar tracking ID..." className="pl-10 pr-4 py-2 border border-brand-border bg-brand-gray rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-yellow text-white placeholder-brand-muted" />
              <svg className="absolute left-3 top-2.5 text-brand-muted" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <Link to="/admin/cargas/nova" className="bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors shadow-lg shadow-brand-yellow/10">
              Nova Carga
            </Link>
          </div>
        </header>
        <section className="p-8 flex-1 overflow-auto flex flex-col gap-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
