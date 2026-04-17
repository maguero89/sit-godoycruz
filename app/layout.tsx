import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "GODOY CRUZ SIN GESTIÓN",
    description: "Plataforma de auditoría ciudadana para visibilizar el estado real de Godoy Cruz.",
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
