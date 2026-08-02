import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ViaRelatórios - Vistorias Imobiliárias',
    description: 'Gere relatórios de vistoria e captação em PDF profissional direto pelo celular.',
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#2563eb',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={inter.className} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}