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
        <div className="flex min-h-screen flex-col bg-gray-50">
            <main className="flex-1 pb-24">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
                <div className="flex justify-around items-center h-16 pb-2">
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center justify-center w-full h-full ${
                            pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500'
                        }`}
                    >
                        <Home size={24} />
                        <span className="text-xs mt-1">Início</span>
                    </Link>

                    <Link
                        href="/vistoria/nova"
                        className={`flex flex-col items-center justify-center w-full h-full ${
                            pathname === '/vistoria/nova' ? 'text-blue-600' : 'text-gray-500'
                        }`}
                    >
                        <PlusCircle size={24} />
                        <span className="text-xs mt-1">Nova</span>
                    </Link>

                    <Link
                        href="/perfil"
                        className={`flex flex-col items-center justify-center w-full h-full ${
                            pathname === '/perfil' ? 'text-blue-600' : 'text-gray-500'
                        }`}
                    >
                        <User size={24} />
                        <span className="text-xs mt-1">Perfil</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}