'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reabrirVistoria } from './actions';

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
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Olá, {primeiroNome}! 👋</h1>
                        <p className="text-gray-600 mt-1">Aqui estão suas vistorias.</p>
                    </div>
                    <Link 
                        href="/vistoria/nova" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-sm"
                    >
                        + Nova Vistoria
                    </Link>
                </header>

                {/* Cards de Resumo Clicáveis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button 
                        onClick={() => setFiltro('todos')}
                        className={`text-left bg-white p-5 rounded-xl border-2 transition-all ${filtro === 'todos' ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
                    >
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{vistorias?.length || 0}</p>
                    </button>
                    
                    <button 
                        onClick={() => setFiltro('rascunho')}
                        className={`text-left bg-white p-5 rounded-xl border-2 transition-all ${filtro === 'rascunho' ? 'border-yellow-500 shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
                    >
                        <p className="text-sm text-gray-500">Em Andamento</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{rascunhos.length}</p>
                    </button>
                    
                    <button 
                        onClick={() => setFiltro('finalizado')}
                        className={`text-left bg-white p-5 rounded-xl border-2 transition-all ${filtro === 'finalizado' ? 'border-green-500 shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}
                    >
                        <p className="text-sm text-gray-500">Finalizadas</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{finalizadas.length}</p>
                    </button>
                </div>

                {/* Lista Filtrada */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className={`w-2 h-6 rounded-full ${filtro === 'rascunho' ? 'bg-yellow-500' : filtro === 'finalizado' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        {filtro === 'todos' ? 'Todas as Vistorias' : filtro === 'rascunho' ? 'Vistorias em Andamento' : 'Vistorias Finalizadas'}
                    </h2>
                    
                    {vistoriasExibidas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vistoriasExibidas.map((v: any) => (
                                <Link 
                                    key={v.id} 
                                    href={`/vistoria/${v.id}`}
                                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                                >
                                    {v.status === 'RASCUNHO' && v.reaberto_em && (
                                        <div className="mb-3 bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-2 rounded-lg flex items-start gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>
                                                Reaberta em {new Date(v.reaberto_em).toLocaleDateString('pt-BR')} às {new Date(v.reaberto_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Clique para continuar a edição.
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${v.status === 'RASCUNHO' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {v.status === 'RASCUNHO' ? 'EM ANDAMENTO' : v.status === 'FINALIZADO' ? 'FINALIZADA' : v.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 font-medium truncate">
                                            <span className="text-gray-500 font-normal">Proprietário:</span> {v.nome_cliente}
                                        </p>
                                        {v.nome_locatario && (
                                            <p className="text-sm text-gray-500 truncate">
                                                <span className="text-gray-400">Inquilino:</span> {v.nome_locatario}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                        {v.endereco_rua}, {v.endereco_numero}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-medium">
                                                {v.tipo === 'ENTRADA' ? 'Entrada' : v.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
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
                                                className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors font-medium"
                                            >
                                                Reabrir
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg">Nenhuma vistoria encontrada nesta categoria.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}