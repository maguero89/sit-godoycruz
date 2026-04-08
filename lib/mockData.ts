export type ReportStatus = 'Pendiente' | 'Verificado' | 'Resuelto' | 'Desestimado';

export interface Report {
    id: string;
    category: 'Arbolado' | 'Veredas Rotas' | 'Higiene Urbana' | 'Alumbrado Público' | 'Seguridad' | 'Cortes de Agua' | 'Problemas Cloacales' | 'Baches';
    subCategory: string;
    description: string;
    coords: [number, number];
    timestamp: string;
    status: ReportStatus;
    daysWithoutResponse: number;
    district: string;
    isAnonymous: boolean;
    photoUrl?: string;
}

export const DISTRICTS = [
    'Centro',
    'Gobernador Benegas',
    'San Francisco del Monte',
    'Sarmiento',
    'Las Tortugas',
    'Villa del Parque'
];

export const MOCK_REPORTS: Report[] = [
    {
        id: '1',
        category: 'Seguridad',
        subCategory: 'Robo',
        description: 'Robo a mano armada en la esquina de la plaza.',
        coords: [-32.915, -68.845],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 5,
        district: 'Centro',
        isAnonymous: true
    },
    {
        id: '2',
        category: 'Baches',
        subCategory: 'Bache Profundo',
        description: 'Bache profundo que rompe cubiertas.',
        coords: [-32.925, -68.855],
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Verificado',
        daysWithoutResponse: 12,
        district: 'Sarmiento',
        isAnonymous: false
    },
    {
        id: '3',
        category: 'Alumbrado Público',
        subCategory: 'Zona Oscura',
        description: 'Faro roto hace semanas, calle muy peligrosa.',
        coords: [-32.935, -68.865],
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 2,
        district: 'Las Tortugas',
        isAnonymous: true
    },
    {
        id: '4',
        category: 'Veredas Rotas',
        subCategory: 'Vereda Rota',
        description: 'Vereda intransitable por raíces de árboles, zona escolar.',
        coords: [-32.945, -68.875],
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 20,
        district: 'Gobernador Benegas',
        isAnonymous: false
    },
    {
        id: '5',
        category: 'Cortes de Agua',
        subCategory: 'Pérdida de Agua',
        description: 'Caño maestro roto inundando la vereda.',
        coords: [-32.920, -68.860],
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 3,
        district: 'Villa del Parque',
        isAnonymous: false
    },
    {
        id: '6',
        category: 'Arbolado',
        subCategory: 'Rama Caída',
        description: 'Rama grande obstaculizando la calle.',
        coords: [-32.930, -68.840],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 1,
        district: 'Gobernador Benegas',
        isAnonymous: true
    },
    {
        id: '7',
        category: 'Problemas Cloacales',
        subCategory: 'Desborde',
        description: 'Desborde cloacal en la esquina.',
        coords: [-32.940, -68.850],
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Verificado',
        daysWithoutResponse: 4,
        district: 'San Francisco del Monte',
        isAnonymous: false
    },
    {
        id: '8',
        category: 'Higiene Urbana',
        subCategory: 'Limpieza',
        description: 'Microbasural acumulado en el descampado.',
        coords: [-32.910, -68.870],
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pendiente',
        daysWithoutResponse: 8,
        district: 'Las Tortugas',
        isAnonymous: true
    }
];
