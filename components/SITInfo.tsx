'use client';

import { Target, CheckCircle2, Star, Shield, Zap, Search, Users, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false }) as any;
import { useRouter } from 'next/navigation';

export default function SITInfo() {
    const router = useRouter();
    
    const goToMap = () => router.push('/mapa');
    const openReport = () => router.push('/mapa?report=new');
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Se Busca Intendente Godoy Cruz: El Mapa de la Realidad Vecinal
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
                    Se Busca Intendente Godoy Cruz es una plataforma de tecnología cívica, independiente y colaborativa, diseñada para que los vecinos de Godoy Cruz puedan visibilizar el estado real de sus barrios. Nuestro objetivo es transformar la queja individual en un dato colectivo e irrefutable que ayude a mejorar la seguridad y la gestión de nuestro departamento.
                </p>
            </div>

            {/* Mini Map Preview & CTAs */}
            <section className="flex flex-col items-center gap-8 py-4">
                <div className="w-full max-w-3xl h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl shadow-blue-500/10 group cursor-pointer" onClick={goToMap}>
                    {/* Hover Overlay para incitar clic */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors z-[2000] flex items-center justify-center pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">
                            Abrir modo interactivo
                        </div>
                    </div>
                    {/* Contenedor del mapa */}
                    <div className="absolute inset-0 z-10 pointer-events-none"></div>
                    <MapComponent isMini={true} />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                    <button 
                        onClick={openReport}
                        className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        <Zap size={20} /> Hacer un Reporte
                    </button>
                    <button 
                        onClick={goToMap}
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-white/10 shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        <Search size={20} /> Explorar el Mapa Completo
                    </button>
                </div>
            </section>

            {/* How it works */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                    <Zap className="text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">¿Cómo funciona?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoCard
                        icon={<MapPin className="text-blue-400" />}
                        title="1. Reporte Georeferenciado"
                        description="Cuando detectás un problema de seguridad o gestión, lo reportás en la web. El sistema utiliza tu GPS para validar la ubicación real dentro de Godoy Cruz."
                    />
                    <InfoCard
                        icon={<CheckCircle2 className="text-green-400" />}
                        title="2. Validación Técnica"
                        description="Un equipo técnico verifica la veracidad de cada reporte para garantizar información seria y confiable, evitando datos falsos."
                    />
                    <InfoCard
                        icon={<Target className="text-red-400" />}
                        title="3. Mapa de Gestión Real"
                        description="Los datos alimentan un mapa interactivo público donde se ven los &apos;puntos calientes&apos; y el tiempo de resolución."
                    />
                </div>
            </section>

            {/* Purpose */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                    <Search className="text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">¿Para qué sirve?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-slate-200 mb-2">Visibilizar lo invisible</h4>
                        <p className="text-sm text-slate-400">Darle entidad a problemas que muchas veces quedan archivados en expedientes oficiales.</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-slate-200 mb-2">Generar Alertas Comunitarias</h4>
                        <p className="text-sm text-slate-400">Funciona como un radar donde los vecinos pueden advertirse sobre fallas o inseguridad en tiempo real.</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-slate-200 mb-2">Auditoría Ciudadana</h4>
                        <p className="text-sm text-slate-400">Registro histórico preciso sobre el desempeño de la gestión pública en cada distrito.</p>
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="bg-blue-600/10 rounded-3xl border border-blue-500/20 p-8 space-y-8">
                <div className="flex items-center gap-3">
                    <Star className="text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Ventajas para el Vecino</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AdvantageItem
                        icon={<Shield className="text-blue-400" />}
                        title="Anonimato Garantizado"
                        description="Podés reportar con total libertad. Protegemos tu identidad y solo usamos el dato geográfico para el análisis."
                    />
                    <AdvantageItem
                        icon={<CheckCircle2 className="text-blue-400" />}
                        title="Información de Calidad"
                        description="Accedés a un mapa libre de &apos;ruido&apos; o datos falsos, útil para tomar decisiones diarias sobre seguridad."
                    />
                    <AdvantageItem
                        icon={<Users className="text-blue-400" />}
                        title="Fuerza Colectiva"
                        description="Un reclamo individual puede ser ignorado; un mapa con decenas de reportes es una presión técnica imposible de omitir."
                    />
                    <AdvantageItem
                        icon={<Target className="text-blue-400" />}
                        title="Geolocalización Inteligente"
                        description="Análisis quirúrgico enfocado exclusivamente en Godoy Cruz, conocemos cada rincón del departamento."
                    />
                </div>
            </section>

            {/* Footer Quote */}
            <div className="text-center pt-8 border-t border-white/10">
                <blockquote className="text-xl italic text-slate-300 font-medium">
                    &quot;Lo que no se mide, no se puede mejorar. Se Busca Intendente Godoy Cruz es la herramienta para que nuestra realidad sea vista, medida y finalmente transformada.&quot;
                </blockquote>
            </div>
        </div>
    );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all flex flex-col gap-4">
            <div className="bg-slate-800 p-3 rounded-xl w-fit">
                {icon}
            </div>
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
