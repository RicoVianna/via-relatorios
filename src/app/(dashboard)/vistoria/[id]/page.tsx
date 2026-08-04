import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ModalAdicionarComodo from './ModalAdicionarComodo';
import { finalizarVistoria } from './actions';
import HistoricoModal from './HistoricoModal';

export default async function DetalhesVistoriaPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id: vistoriaId } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: vistoria } = await supabase.from('vistorias').select('*').eq('id', vistoriaId).eq('user_id', user.id).single();
    if (!vistoria) redirect('/dashboard');

    const { data: comodos } = await supabase.from('comodos').select('*').eq('vistoria_id', vistoriaId).order('criado_em', { ascending: true });

        const { data: historico } = await supabase
        .from('historico_alteracoes')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('data_hora', { ascending: false });

    const dataFormatada = new Date(vistoria.data_vistoria).toLocaleDateString('pt-BR');
    const isFinalizada = vistoria.status === 'FINALIZADO';

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
            {isFinalizada && (
                <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-[1px] z-40 pointer-events-none flex items-start justify-center pt-20">
                    <div className="bg-orange-100 border-2 border-orange-400 text-orange-800 px-6 py-3 rounded-lg shadow-lg font-semibold text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Vistoria Finalizada - Documento Bloqueado para Edição
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/dashboard" className="relative z-50 flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300">
                        ← Voltar ao Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <HistoricoModal historico={historico || []} />
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{vistoria.status}</span>
                    </div>
                </div>

                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Vistoria de {vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                                </h1>
                                <p className="text-gray-500 mt-1">Realizada em {dataFormatada}</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                                {/* O botão de PDF fica SEMPRE visível, pois é o produto final do serviço */}
                                <Link 
                                    href={`/vistoria/${vistoriaId}/revisao`} 
                                    className="relative z-50 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {isFinalizada ? 'Visualizar e Baixar PDF' : 'Revisar e Gerar PDF'}
                                </Link>

                                {/* Botões de edição e finalização só aparecem se NÃO estiver finalizada */}
                                {!isFinalizada && (
                                    <>
                                        <Link href={`/vistoria/${vistoriaId}/editar`} className="relative z-50 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center border border-gray-300">
                                            Editar Dados
                                        </Link>
                                        
                                        <form action={finalizarVistoria.bind(null, vistoriaId)}>
                                            <button 
                                                type="submit" 
                                                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Finalizar Vistoria
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Proprietário / Cliente</h3>
                            <p className="text-lg font-medium text-gray-900">{vistoria.nome_cliente}</p>
                        </div>
                        {vistoria.nome_locatario && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Locatário / Inquilino</h3>
                                <p className="text-lg font-medium text-gray-900">{vistoria.nome_locatario}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Endereço do Imóvel</h3>
                            <p className="text-gray-900">{vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento && `- ${vistoria.endereco_complemento}`}</p>
                            <p className="text-gray-600">{vistoria.endereco_bairro}</p>
                            <p className="text-gray-600">{vistoria.endereco_cidade} {vistoria.endereco_cep && `- CEP: ${vistoria.endereco_cep}`}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Cômodos Vistoriados</h2>
                    </div>
                    
                    {comodos && comodos.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            {comodos.map((comodo: any) => (
                                <div key={comodo.id} className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-900">{comodo.nome_comodo}</h3>
                                        {comodo.descricao_processada_ia && (
                                            <span className="flex items-center text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                                ✨ Otimizado por IA
                                            </span>
                                        )}
                                    </div>
                                    {comodo.descricao_processada_ia ? (
                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comodo.descricao_processada_ia}</p>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">{comodo.descricao_bruta || "Sem descrição."}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mb-6">
                            <p>Nenhum cômodo adicionado ainda.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}