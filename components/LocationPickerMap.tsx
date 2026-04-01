'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom pin icon using a simple SVG
const redPinIcon = L.divIcon({
    className: 'custom-pin',
    html: `<div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg -mt-4 -ml-4 animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
});

function MapEvents({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPickerMap({ 
    selectedPos, 
    onPosChange 
}: { 
    selectedPos: [number, number] | null;
    onPosChange: (pos: [number, number]) => void;
}) {
    const center: [number, number] = [-32.923, -68.868]; // Godoy Cruz Center approx

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden relative border border-white/10">
            <MapContainer
                center={center}
                zoom={14}
                className="w-full h-full z-0"
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onLocationSelected={(lat, lng) => onPosChange([lat, lng])} />
                {selectedPos && (
                    <Marker position={selectedPos} icon={redPinIcon} />
                )}
            </MapContainer>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 shadow-lg pointer-events-none">
                Toca el mapa para fijar el punto exacto
            </div>
        </div>
    );
}
