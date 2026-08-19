'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputSenhaProps {
    id: string;
    name: string;
    autoComplete?: string;
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
}

export default function InputSenha(props: InputSenhaProps) {
    const [visivel, setVisivel] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                type={visivel ? 'text' : 'password'}
                className="vr-input mt-1 block w-full rounded-lg px-4 py-3 pr-12 shadow-sm"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '2px solid var(--border)',
                    color: 'var(--text)',
                }}
            />
            <button
                type="button"
                onClick={() => setVisivel((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title={visivel ? 'Ocultar senha' : 'Mostrar senha'}
                aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
                {visivel ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}