'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [tema, setTema] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const salvo = (localStorage.getItem('vr-theme') as 'light' | 'dark') || 'light';
        setTema(salvo);
        document.documentElement.dataset.theme = salvo;
    }, []);

    const alternar = () => {
        const novo = tema === 'light' ? 'dark' : 'light';
        setTema(novo);
        localStorage.setItem('vr-theme', novo);
        document.documentElement.dataset.theme = novo;
    };

    return (
        <button
            type="button"
            onClick={alternar}
            className="ml-auto w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            title={tema === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
            {tema === 'light' ? '🌙' : '☀️'}
        </button>
    );
}