import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Package, LogIn, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('E-mail ou senha inválidos.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
           <div className="w-16 h-16 bg-brand-yellow text-brand-black rounded flex items-center justify-center font-bold text-3xl mb-4">R</div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight uppercase">
          RODOVAR Admin
        </h2>
        <p className="mt-2 text-center text-brand-yellow text-sm font-medium uppercase tracking-widest">
           Sistema de Gestão Logística
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-gray py-8 px-4 shadow-2xl rounded-xl sm:px-10 border border-brand-border shadow-black/80">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-md flex items-center gap-3 text-red-500 text-sm font-bold">
                 <AlertCircle className="w-5 h-5" />
                 {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">
                E-mail Corporativo
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow text-white placeholder-brand-muted sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-brand-muted mb-1.5 uppercase tracking-widest">
                Senha Segura
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-brand-border rounded-lg bg-brand-black shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow text-white placeholder-brand-muted sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-brand-yellow/10 text-sm font-bold uppercase tracking-widest text-brand-black bg-brand-yellow hover:bg-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black focus:ring-brand-yellow disabled:opacity-50 transition-colors"
              >
                {loading ? 'Acessando...' : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Autenticar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
