import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
            <body suppressHydrationWarning className="bg-slate-950 text-white min-h-screen">
                <main>{children}</main>
                <Navbar />
            </body>
        </html>
    );
}
