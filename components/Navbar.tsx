'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Filter, Info as HelpInfo, ShieldAlert } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl transition-all hover:bg-slate-900/60">
            <Link
                href="/mapa"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${pathname === '/mapa' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Filter size={20} />
                <span className="font-medium hidden sm:inline">Mapa</span>
            </Link>
            <Link
                href="/"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${pathname === '/' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <HelpInfo size={20} />
                <span className="font-medium hidden sm:inline">Info</span>
            </Link>
            <Link
                href="/admin"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${pathname?.startsWith('/admin') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <ShieldAlert size={20} />
                <span className="font-medium hidden sm:inline">Admin</span>
            </Link>
        </nav>
    );
}
