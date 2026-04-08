import React from 'react';

// Interfaces para props base
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const defaultProps = {
  size: 24,
  fill: "currentColor",
};

// 1. Arbolado (Árbol con rama caída/rota)
export const IconArbolado = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Tronco */}
    <path d="M13,22 L11,22 L11,13 C11,10.6 9.4,9.1 7.2,8.8 L8,6.8 C10.6,7.5 12.6,9.5 13,12 L13,22 Z" />
    {/* Copa del árbol principal */}
    <circle cx="10" cy="5" r="4" />
    <circle cx="6" cy="8" r="3.5" />
    <circle cx="13" cy="7" r="3.5" />
    {/* Rama caída (rota) separada */}
    <path d="M19.5,14 L17,11 L14.5,13 L15,14 L12.5,15.5 L13.5,17 Z" />
    {/* Hojas de la rama caída */}
    <circle cx="18" cy="11.5" r="2.5" />
    <circle cx="16" cy="14" r="2" />
    <circle cx="19" cy="14" r="2" />
  </svg>
);

// 2. Veredas Rotas (Pie pisando baldosas partidas)
export const IconVeredasRotas = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Zapato/Pie */}
    <path d="M15,2 L10,12 L6,10 L4,13 L10,17 C12,18 15,17 16,16 L19,10 L15,2 Z" />
    {/* Baldosa izquierda (partida) */}
    <path d="M2,18 L9,18 L10,21 L4,21 Z" />
    {/* Baldosa derecha (levantada) */}
    <path d="M11,18 L20,18 L16,21 L11,21 Z" transform="rotate(-15 15 19.5)" />
    {/* grietas */}
    <path d="M9.5,18 L10.5,16 L12,18" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// 3. Higiene Urbana (Tacho de basura rebasado y bolsa)
export const IconHigieneUrbana = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Tacho (Cuerpo) */}
    <path d="M6,8 L14,8 L13,20 L7,20 Z" />
    {/* Tacho (Tapa abierta) */}
    <path d="M4,7 L13,3 L15,6 L6,10 Z" />
    {/* Basura sobresaliendo */}
    <circle cx="8" cy="7" r="1.5" />
    <circle cx="11" cy="6.5" r="2" />
    <circle cx="10" cy="8" r="1.5" />
    {/* Bolsa de basura al lado */}
    <path d="M19,13 C19,13 17,14 16,16 C15,18 16,20 18,20 C20,20 21.5,19 21,17 C20.5,15 19,13 19,13 Z" />
    {/* Nudo de la bolsa */}
    <path d="M19,13 L18,11 L20,11 Z" />
  </svg>
);

// 4. Alumbrado Público (Faro roto/apagado)
export const IconAlumbradoPublico = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Poste doblado */}
    <path d="M8,22 L10,22 L10,12 Q10,6 16,8" />
    {/* Lámpara */}
    <path d="M17,9 L15,12 L19,11 Z" fill="currentColor" />
    {/* Cruz de "Roto" */}
    <path d="M18,3 L22,7" strokeWidth="2.5" />
    <path d="M22,3 L18,7" strokeWidth="2.5" />
  </svg>
);

// 5. Seguridad (Ladrón corriendo)
export const IconSeguridad = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Cabeza (máscara) */}
    <circle cx="12" cy="5" r="3" />
    <path d="M9,4.5 L15,4.5" stroke="white" strokeWidth="1" /> {/* Ranura de ojos */}
    
    {/* Bolsa al hombro */}
    <circle cx="6" cy="8" r="3" />
    
    {/* Cuerpo dinámico corriendo */}
    <path d="M12,8 L14,14 L10,18" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14,14 L18,17" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" />
    {/* Brazos */}
    <path d="M8,11 L12,9 L16,11" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 6. Cortes de Agua (Grifo seco tachado)
export const IconCortesAgua = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Grifo */}
    <path d="M4,7 L12,7 L12,11 L10,11 L10,14" />
    <path d="M8,4 L8,7" />
    <path d="M6,4 L10,4" />
    
    {/* Gota vacía */}
    <path d="M10,18 C10,20 12,21 12,21 C12,21 14,20 14,18 C14,16 12,15 12,15 C12,15 10,16 10,18 Z" fill="currentColor" />
    
    {/* Cruz grande sobre la gota */}
    <path d="M15,13 L21,19" strokeWidth="2.5" />
    <path d="M21,13 L15,19" strokeWidth="2.5" />
  </svg>
);

// 7. Problemas Cloacales (Caño volcando/Derrame)
export const IconProblemasCloacales = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Caño inclinado */}
    <path d="M2,6 L12,8 L10,14 L2,10 Z" />
    {/* Brida / borde del tubo */}
    <ellipse cx="11" cy="11" rx="1.5" ry="3.5" transform="rotate(-15 11 11)" />
    
    {/* Derrame viscoso (líquido cayendo) */}
    <path d="M11,13 Q16,14 16,18 Q16,22 19,22 Q22,22 22,20 Q22,17 19,16 Q16,15 15,10 Z" />
    {/* Burbujas salpicadas */}
    <circle cx="16" cy="9" r="1.5" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="21" cy="10" r="1.5" />
  </svg>
);

// 8. Baches (Llanta/Neumático en un pozo)
export const IconBaches = ({ size = 24, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props} fill="currentColor">
    {/* Pozo / Grietas base */}
    <path d="M3,16 C6,20 18,20 21,16 L18,17 C15,19 9,19 6,17 Z" />
    <path d="M8,17 L6,21 M12,18 L12,22 M16,17 L18,20" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Neumático hundiéndose */}
    <path d="M16,15 A4,4 0 0,0 8,15 L6,15 A6,6 0 0,1 18,15 Z" />
    {/* Tapa llanta */}
    <circle cx="12" cy="11" r="2" />
    <path d="M12,4 L12,6 M12,16 L12,18 M6,11 L8,11 M16,11 L18,11 M8,7 L9,8 M15,14 L16,15 M15,8 L16,7 M8,15 L9,14" stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="12" cy="11" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
