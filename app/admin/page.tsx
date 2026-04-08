'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, LogIn } from 'lucide-react';
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), { ssr: false });

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        }
        setLoading(false);
    };

    if (loading) return <div className="w-full h-screen bg-slate-950 flex items-center justify-center text-slate-400 animate-pulse">Cargando Administrativo...</div>;

    if (!session) {
        return (
            <div className="w-full h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 justify-center">
                        <ShieldAlert className="text-red-500" size={32} />
                        <h2 className="text-2xl font-bold text-white">Acceso Restringido</h2>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <p className="text-xs text-red-400 bg-red-400/10 p-2 border border-red-500/20 rounded-lg">{error}</p>}
                        <input
                            type="email"
                            placeholder="Email Administrador"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
                            <LogIn size={20} /> Entrar al Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-950 pb-32 pt-8 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-red-500" /> Panel de Gestión Inteligente
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Usuario: <strong className="text-white">{session.user.email}</strong></span>
                        <button 
                            onClick={() => supabase.auth.signOut()}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-white/10"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
                <AdminPanel />
            </div>
        </div>
    );
}
