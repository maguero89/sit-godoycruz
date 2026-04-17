import MapaView from '@/components/MapaView';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function MapaPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-transparent flex items-center justify-center animate-pulse text-slate-400 font-bold">Cargando Plataforma...</div>}>
            <MapaView />
        </Suspense>
    );
}
