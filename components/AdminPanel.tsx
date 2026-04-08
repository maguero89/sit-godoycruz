'use client';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Camera } from 'lucide-react';

export default function AdminPanel() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
        if (data) setReports(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        const updateData: any = { status: newStatus };
        if (newStatus === 'Resuelto') {
            updateData.resolved_at = new Date().toISOString();
        } else {
            updateData.resolved_at = null;
        }

        const { error } = await supabase.from('reports').update(updateData).eq('id', id);
        if (error) {
            alert("No se pudo actualizar el estado. Verifica si tienes permisos (RLS policies) en tu base de datos.\nDetalle: " + error.message);
        } else {
            fetchReports(); 
        }
    };

    const deleteReport = async (id: string) => {
        if(confirm("¿Estás seguro de eliminar este reclamo definitivamente? Esta acción vaciará este punto del mapa general.")) {
            const { error } = await supabase.from('reports').delete().eq('id', id);
            if (error) {
                alert("No se pudo eliminar el reporte. Verifica las políticas RLS en Supabase.\nDetalle: " + error.message);
            } else {
                fetchReports();
            }
        }
    };

    return (
        <div className="space-y-12">
            <Dashboard />
            
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Auditoría de Reclamos Recientes</h3>
                    <p className="text-sm text-slate-400 mt-1">Gestiona el estado visible de los reportes generados por la comunidad.</p>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse">Cargando base de datos segura...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-6 py-4">Fecha / Hora</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4 w-48">Contacto</th>
                                    <th className="px-6 py-4">Descripción Ciudadana</th>
                                    <th className="px-6 py-4">Estado Actual</th>
                                    <th className="px-6 py-4 text-right">Acciones Peligrosas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reports.map(r => (
                                    <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                            {new Date(r.created_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{r.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {r.is_anonymous ? (
                                                <span className="text-xs text-slate-500 italic bg-white/5 px-2 py-1 rounded-md">Denuncia Anónima</span>
                                            ) : (
                                                <div className="flex flex-col gap-1 text-xs text-slate-400">
                                                    {r.name && <span className="text-blue-300 font-bold">{r.name}</span>}
                                                    {r.phone && (
                                                        <div className="flex items-center gap-2 mt-0.5 mb-1">
                                                            <span className="flex items-center gap-1">📞 {r.phone}</span>
                                                            <a
                                                                href={`https://wa.me/${r.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Gracias ${r.name || ''} por dejar tu reclamo, estamos revisando el mismo, este es nuestro numero de contacto, juntos podremos hacer el seguimiento del mismo. Saludos`)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-green-500/20 text-green-400 hover:bg-green-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-500/30 transition-colors uppercase"
                                                                title="Enviar WhatsApp automático"
                                                            >
                                                                WhatsApp
                                                            </a>
                                                        </div>
                                                    )}
                                                    {r.email && <span className="flex items-center gap-1">✉️ {r.email}</span>}
                                                    {!r.name && !r.phone && !r.email && <span className="italic opacity-50">Sin Datos</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm max-w-[300px] truncate" title={r.description}>
                                            <div className="flex items-center gap-2">
                                                {r.photo_url && (
                                                    <a href={r.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0" title="Ver foto adjunta">
                                                        <Camera size={16} />
                                                    </a>
                                                )}
                                                <span className="truncate">{r.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                value={r.status}
                                                onChange={(e) => updateStatus(r.id, e.target.value)}
                                                className={`bg-slate-950 appearance-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider outline-none cursor-pointer border transition-colors hover:shadow-lg ${r.status === 'Verificado' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:border-green-500/60' : r.status === 'Resuelto' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-500/60' : r.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/60' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/60'}`}
                                            >
                                                <option value="Pendiente">⏳ Pendiente</option>
                                                <option value="Verificado">🔍 Verificado</option>
                                                <option value="Resuelto">✅ Resuelto</option>
                                                <option value="Desestimado">❌ Desestimado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => deleteReport(r.id)} 
                                                className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100" 
                                                title="Eliminar Definitivamente"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {reports.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            La base de datos se encuentra limpia. No hay reclamos activos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
