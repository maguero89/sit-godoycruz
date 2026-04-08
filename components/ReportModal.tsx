'use client';

import { useState } from 'react';
import { X, Camera, MapPin, Send, AlertCircle, CheckCircle2, Navigation, Edit3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { isInsideGodoyCruz } from '@/lib/geofencing';
import { supabase } from '@/lib/supabase';

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), { ssr: false, loading: () => <div className="w-full h-64 bg-slate-800 animate-pulse rounded-xl"></div> });

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        isAnonymous: false,
        name: '',
        email: '',
        phone: '',
        coords: null as [number, number] | null,
    });
    const [photo, setPhoto] = useState<File | null>(null);

    const [locationMode, setLocationMode] = useState<'select' | 'gps' | 'manual' | 'map'>('select');
    const [manualAddress, setManualAddress] = useState({ street: '', number: '' });
    const [selectedMapPos, setSelectedMapPos] = useState<[number, number] | null>(null);

    // Reiniciar modal al cerrar
    const handleClose = () => {
        setStep(1);
        setLocationMode('select');
        setFormData({ category: '', description: '', isAnonymous: false, name: '', email: '', phone: '', coords: null });
        setPhoto(null);
        setSuccess(false);
        setError(null);
        setSelectedMapPos(null);
        onClose();
    };

    if (!isOpen) return null;

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Tu navegador no soporta geolocalización.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (isInsideGodoyCruz(latitude, longitude)) {
                    setFormData({ ...formData, coords: [latitude, longitude] });
                    setStep(2);
                } else {
                    setError("Error: Debes estar dentro de los límites de Godoy Cruz para emitir un reporte.");
                }
                setLoading(false);
            },
            (err: any) => {
                setError("No pudimos obtener tu ubicación. Por favor, habilita el GPS o tu navegador puede tenerlo bloqueado.");
                setLoading(false);
            }
        );
    };

    const handleManualAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const query = `${manualAddress.street} ${manualAddress.number}, Godoy Cruz, Mendoza, Argentina`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                if (isInsideGodoyCruz(lat, lon)) {
                    setFormData({ ...formData, coords: [lat, lon] });
                    setStep(2);
                } else {
                    setError("La dirección ingresada se encuentra fuera de los límites de Godoy Cruz.");
                }
            } else {
                setError("No pudimos ubicar esa calle. Revisa que esté bien escrita o utiliza el método manual de mapa.");
            }
        } catch (err) {
            setError("Error al buscar la dirección, revisa tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleMapSubmit = () => {
        if (!selectedMapPos) {
            setError("Por favor pulsa un lugar en el mapa.");
            return;
        }
        
        if (isInsideGodoyCruz(selectedMapPos[0], selectedMapPos[1])) {
            setFormData({ ...formData, coords: selectedMapPos });
            setStep(2);
        } else {
            setError("Atención: El punto seleccionado se encuentra fuera de Godoy Cruz.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.coords) {
            setError("Error: Coordenadas no disponibles.");
            setLoading(false);
            return;
        }

        try {
            let finalPhotoUrl = null;
            
            // Subir foto si existe
            if (photo) {
                const fileExt = photo.name.split('.').pop() || 'jpg';
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('report-photos')
                    .upload(fileName, photo, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Storage Error:", uploadError);
                    throw new Error("No pudimos subir la fotografía. " + uploadError.message);
                }

                if (uploadData) {
                    const { data: publicUrlData } = supabase.storage
                        .from('report-photos')
                        .getPublicUrl(fileName);
                    finalPhotoUrl = publicUrlData.publicUrl;
                }
            }

            // Insertar metadata en BD
            const { error: insertError } = await supabase
                .from('reports')
                .insert([
                    {
                        category: formData.category,
                        description: formData.description,
                        lat: formData.coords[0],
                        lng: formData.coords[1],
                        is_anonymous: formData.isAnonymous,
                        name: formData.name || null,
                        email: formData.email || null,
                        phone: formData.phone || null,
                        district: 'Desconocido', // Or derive district if needed
                        photo_url: finalPhotoUrl
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
        } catch (err: any) {
            console.error("Error al enviar a Supabase:", err);
            setError("Ocurrió un error al enviar tu reporte. Revisa tu conexión a internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">Nuevo Reporte Ciudadano</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">¡Reporte Enviado!</h3>
                            <p className="text-slate-400 mb-8">Gracias por colaborar con la inteligencia territorial de Godoy Cruz.</p>
                            <button
                                onClick={handleClose}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4">
                                    {locationMode === 'select' && (
                                        <>
                                            <p className="text-slate-400 text-sm mb-4">Para comenzar, indícanos dónde ocurrió mediante una de estas 3 opciones:</p>
                                            
                                            <button
                                                onClick={() => { setLocationMode('gps'); handleGetLocation(); }}
                                                className="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-blue-500/50 p-4 rounded-2xl flex items-center justify-between transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                        <Navigation size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-white text-lg">Usar mi GPS</h4>
                                                        <p className="text-xs text-slate-400">Detecta tu ubicación actual automáticamente</p>
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            <button
                                                onClick={() => { setLocationMode('manual'); setError(null); }}
                                                className="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-blue-500/50 p-4 rounded-2xl flex items-center justify-between transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                        <Edit3 size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-white text-lg">Escribir Dirección</h4>
                                                        <p className="text-xs text-slate-400">Ej: San Martín 500</p>
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            <button
                                                onClick={() => { setLocationMode('map'); setError(null); }}
                                                className="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-white text-lg">Elegir en el Mapa</h4>
                                                        <p className="text-xs text-slate-400">Marcar punto exacto visualmente en Godoy Cruz</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </>
                                    )}

                                    {locationMode === 'gps' && (
                                        <div className="text-center py-8">
                                            <Navigation size={48} className="mx-auto text-blue-500 mb-4 animate-pulse" />
                                            <h3 className="text-xl font-bold text-white mb-2">Obteniendo coordenadas...</h3>
                                            <p className="text-sm text-slate-400">Por favor, acepta los permisos de ubicación si el navegador te lo solicita.</p>
                                            <button onClick={() => setLocationMode('select')} className="mt-6 text-sm text-blue-400 hover:text-white hover:underline transition-colors w-full px-4 py-2">Cancelar y elegir otro método</button>
                                        </div>
                                    )}

                                    {locationMode === 'manual' && (
                                        <form onSubmit={handleManualAddressSubmit} className="space-y-4">
                                            <p className="text-slate-300 text-sm mb-4">Ingresa la dirección exacta (Asegúrate de que sea en Godoy Cruz):</p>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Calle (*)</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Ej: San Martín"
                                                        value={manualAddress.street}
                                                        onChange={(e) => setManualAddress({ ...manualAddress, street: e.target.value })}
                                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Altura (*)</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Ej: 123"
                                                        value={manualAddress.number}
                                                        onChange={(e) => setManualAddress({ ...manualAddress, number: e.target.value })}
                                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 mt-6">
                                                <button type="button" onClick={() => setLocationMode('select')} className="px-4 py-3 text-slate-400 hover:text-white transition-colors">Volver</button>
                                                <button type="submit" disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all shadow-lg hover:shadow-amber-500/20">
                                                    {loading ? "Buscando..." : "Validar Dirección"}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {locationMode === 'map' && (
                                        <div className="space-y-4">
                                            <div className="bg-slate-800/50 p-3 rounded-xl border border-emerald-500/20 mb-2">
                                                <p className="text-emerald-400 text-xs font-medium text-center">Desplaza y haz un toque sobre el lugar exacto del incidente.</p>
                                            </div>
                                            <LocationPickerMap selectedPos={selectedMapPos} onPosChange={setSelectedMapPos} />
                                            <div className="flex items-center gap-3">
                                                <button type="button" onClick={() => setLocationMode('select')} className="px-4 py-3 text-slate-400 hover:text-white transition-colors">Volver</button>
                                                <button 
                                                    onClick={handleMapSubmit} 
                                                    disabled={!selectedMapPos}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all shadow-lg hover:shadow-emerald-500/20"
                                                >
                                                    Confirmar Ubicación
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Categoría del Problema</label>
                                        <select
                                            required
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Selecciona una opción...</option>
                                            <option value="Arbolado">Arbolado</option>
                                            <option value="Veredas Rotas">Veredas Rotas</option>
                                            <option value="Higiene Urbana">Higiene Urbana</option>
                                            <option value="Alumbrado Público">Alumbrado Público</option>
                                            <option value="Seguridad">Seguridad</option>
                                            <option value="Cortes de Agua">Cortes de Agua</option>
                                            <option value="Problemas Cloacales">Problemas Cloacales</option>
                                            <option value="Baches">Baches</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Descripción Breve</label>
                                        <textarea
                                            required
                                            placeholder="Cuéntanos qué está pasando..."
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5 relative">
                                        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                                            <Camera className={photo ? "text-blue-400" : "text-slate-400"} />
                                            <span className={`text-sm truncate ${photo ? "text-blue-300 font-medium" : "text-slate-300"}`}>
                                                {photo ? photo.name : "Subir una foto principal"}
                                            </span>
                                        </div>
                                        <label className="cursor-pointer text-xs bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white font-medium transition-colors shadow-lg">
                                            <span>{photo ? "Cambiar" : "Adjuntar"}</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setPhoto(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="anon"
                                            checked={formData.isAnonymous}
                                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/10 bg-slate-800 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="anon" className="text-sm text-slate-400 italic">Deseo realizar este reporte de forma anónima</label>
                                    </div>

                                    {!formData.isAnonymous && (
                                        <div className="space-y-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 animate-in slide-in-from-top-2 duration-300">
                                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Datos de Contacto (Opcional)</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre y Apellido"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Correo Electrónico"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder="Teléfono / Celular"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 leading-tight">Si deseas que nos comuniquemos contigo, déjanos un medio de contacto. No es obligatorio.</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all mt-4"
                                    >
                                        {loading ? "Enviando..." : <><Send size={20} /> Enviar Reporte Auditor</>}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
