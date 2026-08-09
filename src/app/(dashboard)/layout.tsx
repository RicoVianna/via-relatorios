'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, User } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg)' }}>
            <main className="flex-1 pb-24">
                {children}
            </main>

            <nav 
                className="fixed bottom-0 left-0 right-0 z-50 border-t"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
                <div className="flex justify-around items-center h-16 pb-2">
                    <Link
                        href="/dashboard"
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{ color: pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)' }}
                    >
                        <Home size={24} />
                        <span className="text-xs mt-1">Início</span>
                    </Link>

                    <Link
                        href="/vistoria/nova"
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{ color: pathname === '/vistoria/nova' ? 'var(--primary)' : 'var(--text-secondary)' }}
                    >
                        <PlusCircle size={24} />
                        <span className="text-xs mt-1">Nova</span>
                    </Link>

                    <Link
                        href="/perfil"
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{ color: pathname === '/perfil' ? 'var(--primary)' : 'var(--text-secondary)' }}
                    >
                        <User size={24} />
                        <span className="text-xs mt-1">Perfil</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}