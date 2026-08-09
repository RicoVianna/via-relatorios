import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ViaRelatórios - Vistorias Imobiliárias',
    description: 'Gere relatórios de vistoria e captação em PDF profissional direto pelo celular.',
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#2C3A2C',
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
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                {/* Anti-flash: aplica o tema ANTES do React hidratar */}
                <Script
                    id="theme-script"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('vr-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');var s=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;if(s&&window.location.pathname==='/'){window.location.replace('/login');}}catch(e){}})();`,
                    }}
                />
                {children}
            </body>
        </html>
    );
}