'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MOCK_REPORTS, Report } from '@/lib/mockData';
// Geofencing data still used for logic, map now uses GeoJSON
import { isInsideGodoyCruz } from '@/lib/geofencing';
import { Shield, Wrench, Droplet, Lightbulb, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Rediseño de iconos: Estética tecnológica y premium
const createCustomIcon = (category: string, status: string) => {
    let color = '#3b82f6';
    let IconPath: React.ElementType = MapPin;

    switch (category) {
        case 'Seguridad': color = '#ff4b4b'; IconPath = Shield; break;
        case 'Infraestructura': color = '#f97316'; IconPath = Wrench; break;
        case 'Agua/Cloacas': color = '#0ea5e9'; IconPath = Droplet; break;
        case 'Alumbrado': color = '#fbbf24'; IconPath = Lightbulb; break;
    }

    const isPending = status === 'Pendiente';

    const iconMarkup = renderToStaticMarkup(
        <div className={`relative flex items-center justify-center ${isPending ? 'animate-marker-pulse' : ''}`}>
            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-full blur-md opacity-60"
                style={{ backgroundColor: color }}
            ></div>

            {/* Main glass container */}
            <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/40 shadow-xl backdrop-blur-md"
                style={{
                    background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
                }}
            >
                <IconPath size={22} color="white" strokeWidth={2.5} />
            </div>

            {/* Bottom pointer */}
            <div
                className="absolute -bottom-1 w-3 h-3 rotate-45 z-0 border-r-2 border-b-2 border-white/40 shadow-lg"
                style={{ backgroundColor: `${color}aa` }}
            ></div>
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-div-icon',
        iconSize: [40, 48],
        iconAnchor: [20, 48],
    });
};

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center);
    return null;
}

export default function MapComponent({ isMini = false }: { isMini?: boolean }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const center: [number, number] = [-32.923, -68.868]; // Godoy Cruz Center approx

    useEffect(() => {
        setReports(MOCK_REPORTS);

        // Cargar GeoJSON de límites departamentales
        fetch('/mendoza-departments.json')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error('Error loading GeoJSON:', err));
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
                scrollWheelZoom={!isMini}
                dragging={!isMini}
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

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={report.coords}
                        icon={createCustomIcon(report.category, report.status)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-lg text-slate-900">{report.category} - {report.subCategory}</h3>
                                <p className="text-sm text-slate-700 mt-1">{report.description}</p>
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
