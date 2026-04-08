import MapaView from '@/components/MapaView';
import { Suspense } from 'react';

export default function MapaPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-slate-950 flex items-center justify-center animate-pulse text-slate-400 font-bold">Cargando Sistema Geoespacial...</div>}>
            <MapaView />
        </Suspense>
    );
}
