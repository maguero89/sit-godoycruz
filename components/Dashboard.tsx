'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ChevronDown, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function DashboardCard({ title, value, subtitle }: any) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
            <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
    );
}

export default function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        // Obtenemos reportes de todo el sistema para análisis real
        const fetchAll = async () => {
            const { data } = await supabase.from('reports').select('*');
            if (data) setReports(data);
        };
        fetchAll();

        // Suscribirse a cambios en vivo
        const channel = supabase.channel('dashboard_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
                fetchAll();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Filter reports by selected month (basic approach matching month index)
    const filteredReports = useMemo(() => {
        const monthIndex = MONTHS.indexOf(selectedMonth);
        return reports.filter(r => new Date(r.created_at).getMonth() === monthIndex);
    }, [reports, selectedMonth]);

    // Dynamic metrics 
    const metrics = useMemo(() => {
        if (filteredReports.length === 0) return { abandonment: '0%', responseDays: '0', verified: 0 };
        
        const unresolved = filteredReports.filter(r => r.status === 'Pendiente').length;
        const verified = filteredReports.filter(r => r.status === 'Verificado').length;
        
        let totalDays = 0;
        filteredReports.forEach(r => {
            const days = Math.floor((Date.now() - new Date(r.created_at).getTime()) / (1000 * 3600 * 24));
            totalDays += days;
        });

        return {
            abandonment: ((unresolved / filteredReports.length) * 100).toFixed(1) + '%',
            responseDays: (totalDays / filteredReports.length).toFixed(1),
            verified: verified
        };
    }, [filteredReports]);

    // Data distribution by district
    const abandonmentData = useMemo(() => {
        if (filteredReports.length === 0) return [];
        const counts: Record<string, number> = {};
        filteredReports.forEach(r => {
            const dist = r.district || 'Desconocido';
            counts[dist] = (counts[dist] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredReports]);

    // Time buckets
    const responseTimeData = useMemo(() => {
        let buckets = [0, 0, 0, 0]; // 0-2, 3-7, 7-15, +15
        filteredReports.forEach(r => {
            const days = Math.floor((Date.now() - new Date(r.created_at).getTime()) / (1000 * 3600 * 24));
            if (days <= 2) buckets[0]++;
            else if (days <= 7) buckets[1]++;
            else if (days <= 15) buckets[2]++;
            else buckets[3]++;
        });
        
        if (filteredReports.length === 0) return []; // Empty state

        return [
            { name: '0-2 días', value: buckets[0], color: '#22c55e' },
            { name: '3-7 días', value: buckets[1], color: '#a3e635' },
            { name: '7-15 días', value: buckets[2], color: '#f59e0b' },
            { name: '+15 días', value: buckets[3], color: '#ef4444' },
        ].filter(d => d.value > 0);
    }, [filteredReports]);

    // Categories
    const categoriesData = useMemo(() => {
        const catMap: Record<string, { count: number, totalDays: number }> = {};
        filteredReports.forEach(r => {
            const c = r.category || 'Otros';
            const days = Math.floor((Date.now() - new Date(r.created_at).getTime()) / (1000 * 3600 * 24));
            if (!catMap[c]) catMap[c] = { count: 0, totalDays: 0 };
            catMap[c].count++;
            catMap[c].totalDays += days;
        });
        
        return Object.entries(catMap)
            .map(([name, data]) => ({
                name,
                value: data.count,
                time: (data.totalDays / data.count).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredReports]);

    return (
        <div className="space-y-8">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <DashboardCard title="Índice de Abandono" value={metrics.abandonment} subtitle="Promedio Departamental" />
                <DashboardCard title="Días sin Respuesta" value={metrics.responseDays} subtitle="Promedio de incidentes" />
                <DashboardCard title="Reportes Verificados" value={metrics.verified} subtitle={`Mes de ${selectedMonth}`} />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 px-3 py-2 border-r border-white/10 mr-2">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">Filtro Temporal</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsYearOpen(!isYearOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-white font-bold border border-white/10 hover:bg-slate-700 transition-all"
                    >
                        2026 <ChevronDown size={16} />
                    </button>
                    {isYearOpen && (
                        <div className="absolute top-full left-0 mt-2 w-32 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-[1001] overflow-hidden">
                            <button className="w-full px-4 py-2 text-left hover:bg-blue-600 transition-colors text-white font-medium">2026</button>
                            <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors text-slate-400 cursor-not-allowed">2027 (Próx.)</button>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {MONTHS.map(month => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedMonth === month
                                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                : 'bg-slate-800/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Abandono por Distrito */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-200">Abandono por Distrito (%) - {selectedMonth}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={abandonmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reportes por Categoría e Índice de Tiempo */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-200">Tipos de Reclamos y Respuesta - {selectedMonth}</h3>
                    <div className="space-y-4">
                        {categoriesData.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">Sin reportes registrados en este mes.</p>
                        ) : (
                            categoriesData.map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300 font-medium">{cat.name}</span>
                                        <span className="text-blue-400 font-bold">{cat.value} reportes</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, (cat.value / Math.max(1, filteredReports.length)) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                                            Tiempo promedio abierto: <span className="text-amber-400 font-bold">{cat.time} días</span>
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Tiempo de Respuesta */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-200">Distribución Tiempo de Respuesta - {selectedMonth}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={responseTimeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {responseTimeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {responseTimeData.map((d: any, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-tighter">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                {d.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mapa de Calor Mock (Mensaje) */}
            <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-500/20 flex flex-col items-center text-center">
                <h4 className="text-xl font-bold text-blue-400 mb-2">Análisis de Zonas Críticas (Heatmap) - Proyección {selectedMonth} 2026</h4>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                    Este módulo procesa la acumulación de reportes no resueltos para identificar sectores que requieren intervención urgente.
                    Para el mes de **{selectedMonth}**, los distritos de **Villa del Parque** y **Sarmiento** muestran proyectivamente la mayor concentración de reportes pendientes.
                </p>
            </div>
        </div>
    );
}
