'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Report } from '@/lib/mockData';
// Geofencing data still used for logic, map now uses GeoJSON
import { ShieldAlert, MapPin, TreePine, Footprints, Trash2, LightbulbOff, Droplet, Waves, CircleDashed } from 'lucide-react';

// Rediseño de iconos: Estética tecnológica y premium
const createCustomIcon = (category: string, status: string) => {
    let iconSrc = '';

    switch (category) {
        case 'Arbolado': iconSrc = '/icons/Arbolado.png'; break;
        case 'Veredas Rotas': iconSrc = '/icons/Veredas Rotas.png'; break;
        case 'Higiene Urbana': iconSrc = '/icons/Higiene Urbana.png'; break;
        case 'Alumbrado Público': iconSrc = '/icons/Alumbrado Publico.png'; break;
        case 'Seguridad': iconSrc = '/icons/Seguridad.png'; break;
        case 'Cortes de Agua': iconSrc = '/icons/Cortes de Agua.png'; break;
        case 'Problemas Cloacales': iconSrc = '/icons/Problemas Cloacales.png'; break;
        case 'Baches': iconSrc = '/icons/Baches.png'; break;
    }

    const isPending = status === 'Pendiente';

    const safeUrl = encodeURI(iconSrc);
    // Increase size and use inline CSS for absolute safety in Leaflet markers
    const iconMarkup = `<div class="relative flex items-center justify-center ${isPending ? 'animate-marker-pulse' : ''} cursor-pointer" style="width: 50px; height: 50px; filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.4)); transform-origin: center bottom; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <img src="${safeUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>`;

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-div-icon bg-transparent border-none',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
    });
};

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center);
    return null;
}

export default function MapComponent({ isMini = false, activeFilter = null }: { isMini?: boolean, activeFilter?: string | null }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const center: [number, number] = [-32.923, -68.868]; // Godoy Cruz Center approx

    useEffect(() => {
        const fetchReports = async () => {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && !error) {
                const formatted = data.map((r: any) => ({
                    id: r.id,
                    category: r.category,
                    subCategory: r.subcategory || '',
                    description: r.description,
                    coords: [r.lat, r.lng] as [number, number],
                    timestamp: r.created_at,
                    status: r.status,
                    daysWithoutResponse: Math.floor((Date.now() - new Date(r.created_at).getTime()) / (1000 * 3600 * 24)),
                    district: r.district || 'Desconocido',
                    isAnonymous: r.is_anonymous,
                    photo_url: r.photo_url,
                }));
                setReports(formatted as any); // Type cast until we replace the strict mock interface entirely
            }
        };

        fetchReports();

        // Suscribirse a cambios en vivo en la base de datos
        const channel = supabase.channel('map_realtime_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
                fetchReports(); // Refrescar los puntos en vivo
            })
            .subscribe();

        // Cargar GeoJSON de límites departamentales
        fetch('/mendoza-departments.json')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error('Error loading GeoJSON:', err));

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const geoJsonStyle = (feature: any) => {
        const isGodoyCruz = feature.properties.departamen === 'GODOY CRUZ';

        return {
            fillColor: isGodoyCruz ? 'transparent' : '#000000',
            weight: isGodoyCruz ? 3 : 1,
            opacity: isGodoyCruz ? 0.8 : 0.3,
            color: isGodoyCruz ? '#3b82f6' : '#475569',
            fillOpacity: isGodoyCruz ? 0 : 0.7, // Interior claro para GC, oscuro para el resto
        };
    };

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={center}
                zoom={isMini ? 12 : 13}
                scrollWheelZoom={true}
                dragging={true}
                zoomControl={false}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Límites departamentales desde GeoJSON */}
                {geoJsonData && (
                    <GeoJSON
                        data={geoJsonData}
                        style={geoJsonStyle}
                    />
                )}

                {reports.filter(r => !activeFilter || r.category === activeFilter).map((report) => (
                    <Marker
                        key={report.id}
                        position={report.coords}
                        icon={createCustomIcon(report.category, report.status)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-lg text-slate-900">{report.category} {report.subCategory ? `- ${report.subCategory}` : ''}</h3>
                                {(report as any).photo_url && (
                                    <div className="w-full h-32 mt-2 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                                        <img src={(report as any).photo_url} alt="Evidencia ciudadana" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <p className="text-sm text-slate-700 mt-2">{report.description}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'Verificado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {report.status}
                                    </span>
                                    <span className="text-xs text-slate-500">Hace {report.daysWithoutResponse} días</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Distrito: {report.district}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <ChangeView center={center} />
            </MapContainer>

            {/* Overlays / UI Buttons */}
            {!isMini && (
                <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                        <h1 className="text-xl font-bold text-white tracking-tight">Se Busca Intendente Godoy Cruz</h1>
                        <p className="text-xs text-slate-400">Sistema de Inteligencia Territorial</p>
                    </div>
                </div>
            )}
        </div>
    );
}
