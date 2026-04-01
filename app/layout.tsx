import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Se Busca Intendente Godoy Cruz - Inteligencia Territorial",
    description: "Plataforma de auditoría ciudadana para el departamento de Godoy Cruz, Mendoza.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
            </head>
            <body suppressHydrationWarning>
                <main>{children}</main>
            </body>
        </html>
    );
}
