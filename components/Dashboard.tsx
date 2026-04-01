'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DISTRICTS } from '@/lib/mockData';
import { ChevronDown, Calendar } from 'lucide-react';

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
    const [selectedMonth, setSelectedMonth] = useState('Marzo');
    const [isYearOpen, setIsYearOpen] = useState(false);

    // Dynamic metrics based on month
    const metrics = useMemo(() => {
        const seed = selectedMonth.length;
        return {
            abandonment: (12 + (seed % 5)).toFixed(1) + '%',
            responseDays: (7 + (seed % 4)).toFixed(1),
            verified: 100 + (seed * 3)
        };
    }, [selectedMonth]);

    // Generate stable but "filtered" look data based on the selected month
    const abandonmentData = useMemo(() => {
        // Seed based on month name to keep it stable during re-renders but different per month
        const seed = selectedMonth.length;
        return DISTRICTS.map((d, i) => ({
            name: d.split(' ')[0],
            value: Math.floor((Math.sin(seed + i) * 10) + 15) // Dynamic but deterministic
        }));
    }, [selectedMonth]);

    const responseTimeData = useMemo(() => {
        const seed = selectedMonth.length;
        return [
            { name: '0-2 días', value: 30 + (seed % 20), color: '#22c55e' },
            { name: '3-7 días', value: 25 + (seed % 15), color: '#a3e635' },
            { name: '7-15 días', value: 15 + (seed % 10), color: '#f59e0b' },
            { name: '+15 días', value: 10 + (seed % 5), color: '#ef4444' },
        ];
    }, [selectedMonth]);

    const categoriesData = useMemo(() => {
        const seed = selectedMonth.length;
        return [
            { name: 'Seguridad', value: 40 + (seed * 2), time: (5 + (seed % 3)).toFixed(1) },
            { name: 'Infraestructura', value: 30 + (seed * 1.5), time: (12 + (seed % 5)).toFixed(1) },
            { name: 'Agua/Cloacas', value: 20 + (seed * 1), time: (8 + (seed % 4)).toFixed(1) },
            { name: 'Alumbrado', value: 25 + (seed * 1.2), time: (3 + (seed % 2)).toFixed(1) },
        ].sort((a, b) => b.value - a.value);
    }, [selectedMonth]);

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
                        {categoriesData.map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-medium">{cat.name}</span>
                                    <span className="text-blue-400 font-bold">{cat.value} reportes</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(cat.value / 60) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                                        Tiempo medio de solución: <span className="text-amber-400 font-bold">{cat.time} días</span>
                                    </span>
                                </div>
                            </div>
                        ))}
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
