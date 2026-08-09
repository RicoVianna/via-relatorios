'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reabrirVistoria } from './actions';
import BotaoCompartilhar from '@/components/vistorias/BotaoCompartilhar';

export default function ListaVistorias({ vistorias, profile }: { vistorias: any[] | null, profile: any }) {
    const router = useRouter();
    const [filtro, setFiltro] = useState<'todos' | 'rascunho' | 'finalizado'>('todos');
    
    const nomeExibicao = profile?.nome || 'Usuário';
    const primeiroNome = nomeExibicao.split(' ')[0];

    const rascunhos = vistorias?.filter(v => v.status === 'RASCUNHO') || [];
    const finalizadas = vistorias?.filter(v => v.status === 'FINALIZADO') || [];

    const vistoriasExibidas = filtro === 'rascunho' 
        ? rascunhos 
        : filtro === 'finalizado' 
        ? finalizadas 
        : vistorias || [];

    return (
        <main className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Olá, {primeiroNome}! 👋</h1>
                        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Aqui estão suas vistorias.</p>
                    </div>
                    <Link 
                        href="/vistoria/nova" 
                        className="text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center shadow-sm"
                        style={{ backgroundColor: 'var(--primary)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                    >
                        + Nova Vistoria
                    </Link>
                </header>

                {/* Cards de Resumo Clicáveis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button 
                        onClick={() => setFiltro('todos')}
                        className="text-left p-5 rounded-xl border-2 transition-all shadow-sm"
                        style={{ 
                            backgroundColor: 'var(--surface)', 
                            borderColor: filtro === 'todos' ? 'var(--primary)' : 'var(--border)',
                            color: 'var(--text)'
                        }}
                    >
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text)' }}>{vistorias?.length || 0}</p>
                    </button>
                    
                    <button 
                        onClick={() => setFiltro('rascunho')}
                        className="text-left p-5 rounded-xl border-2 transition-all shadow-sm"
                        style={{ 
                            backgroundColor: 'var(--surface)', 
                            borderColor: filtro === 'rascunho' ? 'var(--accent)' : 'var(--border)'
                        }}
                    >
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Em Andamento</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{rascunhos.length}</p>
                    </button>
                    
                    <button 
                        onClick={() => setFiltro('finalizado')}
                        className="text-left p-5 rounded-xl border-2 transition-all shadow-sm"
                        style={{ 
                            backgroundColor: 'var(--surface)', 
                            borderColor: filtro === 'finalizado' ? '#10B981' : 'var(--border)'
                        }}
                    >
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Finalizadas</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: '#10B981' }}>{finalizadas.length}</p>
                    </button>
                </div>

                {/* Lista Filtrada */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                        <span 
                            className="w-2 h-6 rounded-full" 
                            style={{ 
                                backgroundColor: filtro === 'rascunho' 
                                    ? 'var(--accent)' 
                                    : filtro === 'finalizado' 
                                    ? '#10B981' 
                                    : 'var(--primary)' 
                            }}
                        />
                        {filtro === 'todos' ? 'Todas as Vistorias' : filtro === 'rascunho' ? 'Vistorias em Andamento' : 'Vistorias Finalizadas'}
                    </h2>
                    
                    {vistoriasExibidas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vistoriasExibidas.map((v: any) => (
                                <Link 
                                    key={v.id} 
                                    href={`/vistoria/${v.id}`}
                                    className="vr-card-link p-5 rounded-xl border-2 shadow-sm group"
                                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                >
                                    {v.status === 'RASCUNHO' && v.reaberto_em && (
                                        <div className="mb-3 text-xs px-3 py-2 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FED7AA', border: '1px solid #FDBA74', color: '#9A3412' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>
                                                Reaberta em {new Date(v.reaberto_em).toLocaleDateString('pt-BR')} às {new Date(v.reaberto_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Clique para continuar a edição.
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-3">
                                        <span 
                                            className="px-2 py-1 text-xs font-medium rounded-full" 
                                            style={{ 
                                                backgroundColor: v.status === 'RASCUNHO' ? 'rgba(194, 162, 75, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: v.status === 'RASCUNHO' ? 'var(--accent)' : '#10B981'
                                            }}
                                        >
                                            {v.status === 'RASCUNHO' ? 'EM ANDAMENTO' : v.status === 'FINALIZADO' ? 'FINALIZADA' : v.status}
                                        </span>
                                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                            <BotaoCompartilhar vistoria={v} comodos={v.comodos || []} variante="icone" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                                            <span className="font-normal" style={{ color: 'var(--text-secondary)' }}>Proprietário:</span> {v.nome_cliente}
                                        </p>
                                        {v.nome_locatario && (
                                            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                                <span style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>Inquilino:</span> {v.nome_locatario}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                                        {v.endereco_rua}, {v.endereco_numero}
                                    </p>
                                    <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)' }}>
                                        <div>
                                            <p className="text-xs uppercase font-medium" style={{ color: 'var(--text-secondary)' }}>
                                                {v.tipo === 'ENTRADA' ? 'Entrada' : v.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                                {new Date(v.data_vistoria).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        
                                        {v.status === 'FINALIZADO' && (
                                            <button 
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const resultado = await reabrirVistoria(v.id);
                                                    if (resultado.success) {
                                                        router.refresh();
                                                    } else {
                                                        alert(resultado.message);
                                                    }
                                                }}
                                                className="text-xs px-3 py-1 rounded-full transition-colors font-medium"
                                                style={{ backgroundColor: '#FED7AA', color: '#9A3412' }}
                                            >
                                                Reabrir
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 rounded-xl border-2 border-dashed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Nenhuma vistoria encontrada nesta categoria.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}