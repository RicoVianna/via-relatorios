import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { processarDescricaoIA } from './actions';
import BotaoGerarPDF from './BotaoGerarPDF';

// Next.js 15: params deve ser tipado como Promise
export default async function RevisaoPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    
    // Desempacotar o params com await
    const { id: vistoriaId } = await params;

    // Buscar dados da vistoria
    const { data: vistoria } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id', vistoriaId)
        .single();

    if (!vistoria) {
        redirect('/dashboard');
    }

    const isFinalizada = vistoria.status === 'FINALIZADO';

    // Buscar cômodos da vistoria
    const { data: comodos } = await supabase
        .from('comodos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('criado_em', { ascending: true }); // Ajustado para criado_em caso 'ordem' não exista

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header com título e botão de voltar condicionais */}
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <Link href={`/vistoria/${vistoriaId}`} className="text-gray-600 mr-4 hover:text-blue-600 transition-colors">
                    ← {isFinalizada ? 'Voltar aos Detalhes' : 'Voltar para Edição'}
                </Link>
                <h1 className="text-lg font-bold text-gray-900">
                    {isFinalizada ? 'Visualização do Laudo (Somente Leitura)' : 'Revisão Final'}
                </h1>
            </header>

            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                {/* Resumo da Vistoria */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumo do Imóvel</h2>
                    <p className="text-gray-900 font-medium">
                        {vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento && `- ${vistoria.endereco_complemento}`}
                    </p>
                    <p className="text-gray-600">{vistoria.endereco_bairro} - {vistoria.endereco_cidade}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Tipo de Vistoria</p>
                            <p className="font-medium text-gray-900">
                                {vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Partes Envolvidas</p>
                            <p className="text-sm text-gray-800">
                                <span className="text-gray-500">Proprietário:</span> {vistoria.nome_cliente || 'Não informado'}
                            </p>
                            {vistoria.nome_locatario && (
                                <p className="text-sm text-gray-800 mt-1">
                                    <span className="text-gray-500">Inquilino:</span> {vistoria.nome_locatario}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Cômodos para Revisão (COM BLOQUEIOS DE EDIÇÃO) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {isFinalizada ? 'Cômodos Vistoriados (Somente Leitura)' : `Cômodos Vistoriados (${comodos?.length || 0})`}
                    </h2>
                    <div className="space-y-4">
                        {comodos?.map((comodo: any) => (
                            <div key={comodo.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
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
                                    <p className="text-gray-500 text-sm italic bg-gray-50 p-3 rounded-lg">{comodo.descricao_bruta || "Sem descrição."}</p>
                                )}

                                {/* BOTÃO DE IA: SÓ APARECE SE NÃO ESTIVER FINALIZADA E NÃO TIVER IA */}
                                {!isFinalizada && !comodo.descricao_processada_ia && (
                                    <form action={processarDescricaoIA} className="mt-4 pt-4 border-t border-gray-100">
                                        <input type="hidden" name="comodo_id" value={comodo.id} />
                                        <input type="hidden" name="vistoria_id" value={vistoriaId} />
                                        <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Melhorar este texto com IA
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                        
                        {/* MENSAGEM DE NENHUM CÔMODO: LINK DE EDIÇÃO BLOQUEADO SE FINALIZADA */}
                        {(!comodos || comodos.length === 0) && (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">Nenhum cômodo cadastrado nesta vistoria.</p>
                                {!isFinalizada && (
                                    <Link href={`/vistoria/${vistoriaId}/editar`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                                        Adicionar cômodos na edição
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação Final */}
                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                    <Link href={`/vistoria/${vistoriaId}`} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-center transition-colors">
                        {isFinalizada ? 'Voltar aos Detalhes' : 'Voltar e Editar'}
                    </Link>
                    <BotaoGerarPDF vistoria={vistoria} comodos={comodos || []} />
                </div>
            </div>
        </main>
    );
}