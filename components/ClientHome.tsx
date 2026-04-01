'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Plus, BarChart2, ShieldAlert, Filter, Info as HelpInfo } from 'lucide-react';
import { Target, CheckCircle2, Star, Shield, Zap, Search, Users, MapPin } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-slate-950 animate-pulse flex items-center justify-center text-slate-400 font-bold">Cargando Mapa Territorial...</div>
});

const ReportModal = dynamic(() => import('@/components/ReportModal'), { ssr: false }) as any;
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false }) as any;
const SITInfo = dynamic(() => import('@/components/SITInfo'), { ssr: false }) as any;

function InfoCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all flex flex-col gap-4">
            <div className="bg-slate-800 p-3 rounded-xl w-fit">{icon}</div>
            <div>
                <h4 className="font-bold text-white mb-2">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function AdvantageItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-slate-200 mb-1">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}


function AdminRow({ id, cat, dist, status }: any) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-sm font-mono text-slate-400">#{id}</td>
            <td className="px-6 py-4 font-medium">{cat}</td>
            <td className="px-6 py-4 text-slate-400 text-sm">{dist}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Verificado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                    Gestionar
                </button>
            </td>
        </tr>
    );
}

export default function ClientHome() {
    const [activeTab, setActiveTab] = useState<'mapa' | 'dashboard' | 'admin' | 'info'>('mapa');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sync state with URL hash to survive remounts/hydration resets
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '') as any;
            if (['mapa', 'dashboard', 'admin', 'info'].includes(hash)) {
                setActiveTab(hash);
            }
        };

        // Initial check
        if (window.location.hash) {
            handleHashChange();
        } else {
            // Default hash if none present
            window.location.hash = 'mapa';
        }

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const changeTab = (tab: 'mapa' | 'dashboard' | 'admin' | 'info') => {
        window.location.hash = tab;
        setActiveTab(tab);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans">
            {/* Header / Nav */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl transition-all hover:bg-slate-900/60">
                <button
                    type="button"
                    onClick={() => changeTab('mapa')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'mapa' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <Filter size={20} />
                    <span className="font-medium">Mapa</span>
                </button>
                <button
                    type="button"
                    onClick={() => changeTab('dashboard')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <BarChart2 size={20} />
                    <span className="font-medium">2026</span>
                </button>
                <button
                    type="button"
                    onClick={() => changeTab('info')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <HelpInfo size={20} />
                    <span className="font-medium">Info</span>
                </button>
                <button
                    type="button"
                    onClick={() => changeTab('admin')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <ShieldAlert size={20} />
                    <span className="font-medium">Admin</span>
                </button>
            </nav>

            {/* Main Content Area */}
            <div className="w-full h-full relative">
                {/* Mapa Tab */}
                <div className={`w-full h-full ${activeTab === 'mapa' ? 'block' : 'hidden'}`}>
                    <MapComponent />

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="fixed bottom-24 right-6 z-[1000] bg-red-600 hover:bg-red-500 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 group"
                    >
                        <Plus size={32} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                    <div className="fixed top-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs hidden md:block">
                        <h4 className="font-bold text-slate-300 mb-2 border-b border-white/10 pb-1">Leyenda Territorial</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Seguridad</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Infraestructura</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Agua / Cloacas</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Alumbrado</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tab */}
                <div className={`w-full h-full overflow-y-auto bg-slate-950 ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
                    <div className="p-8 pb-32">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <BarChart2 className="text-blue-500" /> Plataforma de Análisis Se Busca Intendente 2026
                        </h2>
                        {activeTab === 'dashboard' && <Dashboard />}
                    </div>
                </div>

                {/* Info Tab */}
                <div className={`w-full h-full overflow-y-auto bg-slate-950 ${activeTab === 'info' ? 'block' : 'hidden'}`}>
                    <div className="p-8 pb-32 max-w-4xl mx-auto space-y-12">
                        {activeTab === 'info' && <SITInfo goToMap={() => changeTab('mapa')} openReport={() => { changeTab('mapa'); setIsModalOpen(true); }} />}
                    </div>
                </div>

                {/* Admin Tab */}
                <div className={`w-full h-full overflow-y-auto bg-slate-950 ${activeTab === 'admin' ? 'block' : 'hidden'}`}>
                    <div className="p-8 pb-32">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <ShieldAlert className="text-red-500" /> Panel de Control (Personal Abocado)
                        </h2>
                        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-slate-400 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Categoría</th>
                                        <th className="px-6 py-4">Distrito</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AdminRow id="GC-1204" cat="Seguridad" dist="Centro" status="Pendiente" />
                                    <AdminRow id="GC-1198" cat="Alumbrado" dist="Las Tortugas" status="Verificado" />
                                    <AdminRow id="GC-1185" cat="Infraest." dist="Sarmiento" status="Pendiente" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
