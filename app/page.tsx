'use client';

import dynamic from 'next/dynamic';

const ClientHome = dynamic(() => import('@/components/ClientHome'), {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold animate-pulse">Iniciando Se Busca Intendente Godoy Cruz...</div>
});

export default function Home() {
    return <ClientHome />;
}
