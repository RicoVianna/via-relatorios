'use client';

import { useState } from 'react';

export default function HistoricoModal({ historico }: { historico: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    // Se não houver histórico, não renderiza nada
    if (!historico || historico.length === 0) return null;

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver Histórico
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Histórico de Alterações</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {historico.map((item: any, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-blue-700">{item.acao}</span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(item.data_hora).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">IP: {item.ip_usuario || 'Não capturado'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}