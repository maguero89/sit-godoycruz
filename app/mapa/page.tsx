import dynamic from 'next/dynamic';

const MapaView = dynamic(() => import('@/components/MapaView'), { ssr: false });

export default function MapaPage() {
    return (
        <MapaView />
    );
}
