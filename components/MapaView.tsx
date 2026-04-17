'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import { Plus, ListFilter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-transparent animate-pulse flex items-center justify-center text-slate-400 font-bold">Cargando Mapa Territorial...</div>
});

const ReportModal = dynamic(() => import('@/components/ReportModal'), { ssr: false }) as any;

function LegendItem({ iconSrc, label, dbCategory, isActive, onClick }: { iconSrc: string, label: string, dbCategory: string, isActive: boolean, onClick: () => void }) {
    const safeUrl = encodeURI(iconSrc);
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-4 group p-2 rounded-xl transition-all ${isActive ? 'bg-blue-600/30 border border-blue-500/50' : 'hover:bg-white/5 border border-transparent'}`}
        >
            <div className={`relative w-10 h-10 flex items-center justify-center drop-shadow-md transition-transform flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <img src={safeUrl} alt={label} className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <span className={`font-medium text-sm transition-colors ${isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-white'}`}>{label}</span>
        </button>
    );
}

function MapaViewContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('report') === 'new') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    return (
        <div className="w-full h-screen relative pt-4 pb-24 md:pt-8 md:pb-28 px-4 md:px-8 lg:px-12">
            <div className="w-full h-full relative rounded-3xl md:rounded-[40px] overflow-hidden border-4 md:border-[6px] border-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-slate-950">
                <MapComponent activeFilter={activeFilter} />
            </div>

            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-6 z-[1000] bg-red-600 hover:bg-red-500 text-white p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 group"
            >
                <Plus size={32} className="group-hover:rotate-90 transition-transform" />
            </button>

            <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Botón flotante exclusivo móvil para las referencias/filtros */}
            <button
                className="fixed top-4 right-4 z-[1001] md:hidden bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl text-white transition-transform active:scale-95"
                onClick={() => setIsLegendOpen(!isLegendOpen)}
            >
                {isLegendOpen ? <X size={24} /> : <ListFilter size={24} />}
            </button>

            <div className={`fixed z-[1000] bg-slate-900/95 backdrop-blur-xl p-5 rounded-3xl border border-white/10 text-xs shadow-2xl transition-all duration-300 md:block 
                ${isLegendOpen ? 'top-20 right-4 w-[calc(100vw-32px)] max-w-[300px] opacity-100 pointer-events-auto' : 'top-20 right-4 w-[calc(100vw-32px)] max-w-[300px] opacity-0 pointer-events-none md:top-4 md:right-4 md:w-52 md:opacity-100 md:pointer-events-auto'}`}>
                <div className="mb-3 text-center border-b border-white/10 pb-2 flex justify-center items-center gap-2">
                    <ListFilter size={14} className="text-slate-400" />
                    <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Filtros Territoriales</span>
                </div>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                    <LegendItem isActive={activeFilter === 'Arbolado'} onClick={() => { setActiveFilter(activeFilter === 'Arbolado' ? null : 'Arbolado'); setIsLegendOpen(false); }} iconSrc="/icons/Arbolado.png" label="Arbolado" dbCategory="Arbolado" />
                    <LegendItem isActive={activeFilter === 'Veredas Rotas'} onClick={() => { setActiveFilter(activeFilter === 'Veredas Rotas' ? null : 'Veredas Rotas'); setIsLegendOpen(false); }} iconSrc="/icons/Veredas Rotas.png" label="Veredas Rotas" dbCategory="Veredas Rotas" />
                    <LegendItem isActive={activeFilter === 'Higiene Urbana'} onClick={() => { setActiveFilter(activeFilter === 'Higiene Urbana' ? null : 'Higiene Urbana'); setIsLegendOpen(false); }} iconSrc="/icons/Higiene Urbana.png" label="Higiene Urbana" dbCategory="Higiene Urbana" />
                    <LegendItem isActive={activeFilter === 'Alumbrado Público'} onClick={() => { setActiveFilter(activeFilter === 'Alumbrado Público' ? null : 'Alumbrado Público'); setIsLegendOpen(false); }} iconSrc="/icons/Alumbrado Publico.png" label="Alumbrado Púb." dbCategory="Alumbrado Público" />
                    <LegendItem isActive={activeFilter === 'Seguridad'} onClick={() => { setActiveFilter(activeFilter === 'Seguridad' ? null : 'Seguridad'); setIsLegendOpen(false); }} iconSrc="/icons/Seguridad.png" label="Seguridad" dbCategory="Seguridad" />
                    <LegendItem isActive={activeFilter === 'Cortes de Agua'} onClick={() => { setActiveFilter(activeFilter === 'Cortes de Agua' ? null : 'Cortes de Agua'); setIsLegendOpen(false); }} iconSrc="/icons/Cortes de Agua.png" label="Cortes de Agua" dbCategory="Cortes de Agua" />
                    <LegendItem isActive={activeFilter === 'Problemas Cloacales'} onClick={() => { setActiveFilter(activeFilter === 'Problemas Cloacales' ? null : 'Problemas Cloacales'); setIsLegendOpen(false); }} iconSrc="/icons/Problemas Cloacales.png" label="Prob. Cloacales" dbCategory="Problemas Cloacales" />
                    <LegendItem isActive={activeFilter === 'Baches'} onClick={() => { setActiveFilter(activeFilter === 'Baches' ? null : 'Baches'); setIsLegendOpen(false); }} iconSrc="/icons/Baches.png" label="Baches" dbCategory="Baches" />
                </div>
                {activeFilter && (
                    <button onClick={() => { setActiveFilter(null); setIsLegendOpen(false); }} className="w-full mt-3 py-3 md:py-2 text-red-100 bg-red-600/80 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-lg font-bold text-[11px] uppercase tracking-wider border border-red-500/50">
                        Quitar Filtro ({activeFilter})
                    </button>
                )}
            </div>
        </div>
    );
}

export default function MapaView() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-transparent flex items-center justify-center animate-pulse text-slate-400 font-bold">Cargando Plataforma...</div>}>
            <MapaViewContent />
        </Suspense>
    );
}
