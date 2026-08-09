import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { processarDescricaoIA } from './actions';
import BotaoGerarPDF from './BotaoGerarPDF';
import BotaoCompartilhar from '@/components/vistorias/BotaoCompartilhar';

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

    // Buscar o perfil do usuário logado (nome e CRECI para exibir no PDF)
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('nome, creci')
        .eq('id', user?.id)
        .single();

    const isFinalizada = vistoria.status === 'FINALIZADO';

    // Buscar cômodos da vistoria
    const { data: comodos } = await supabase
        .from('comodos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('criado_em', { ascending: true });

    return (
        <main className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
            {/* Header com título e botão de voltar condicionais */}
            <header className="p-4 shadow-sm flex items-center sticky top-0 z-10" style={{ backgroundColor: 'var(--surface)' }}>
                <Link 
                    href={`/vistoria/${vistoriaId}`} 
                    className="vr-back-link mr-4 font-medium px-3 py-1 rounded-lg border-2"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                    ← {isFinalizada ? 'Voltar aos Detalhes' : 'Voltar para Edição'}
                </Link>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                    {isFinalizada ? 'Visualização do Laudo (Somente Leitura)' : 'Revisão Final'}
                </h1>
            </header>

            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                {/* Resumo da Vistoria */}
                <div className="p-6 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Resumo do Imóvel</h2>
                    <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                        {vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento && `- ${vistoria.endereco_complemento}`}
                    </p>
                    <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{vistoria.endereco_bairro} - {vistoria.endereco_cidade}</p>
                    
                    <div className="mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: '2px solid var(--border)' }}>
                        <div>
                            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Tipo de Vistoria</p>
                            <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                                {vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Partes Envolvidas</p>
                            <p className="text-sm" style={{ color: 'var(--text)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Proprietário:</span> {vistoria.nome_cliente || 'Não informado'}
                            </p>
                            {vistoria.nome_locatario && (
                                <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Inquilino:</span> {vistoria.nome_locatario}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Cômodos para Revisão (COM BLOQUEIOS DE EDIÇÃO) */}
                <div>
                    <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                        {isFinalizada ? 'Cômodos Vistoriados (Somente Leitura)' : `Cômodos Vistoriados (${comodos?.length || 0})`}
                    </h2>
                    <div className="space-y-4">
                        {comodos?.map((comodo: any) => (
                            <div key={comodo.id} className="p-5 rounded-xl border-2 shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-xl" style={{ color: 'var(--text)' }}>{comodo.nome_comodo}</h3>
                                    {comodo.descricao_processada_ia && (
                                        <span className="flex items-center text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)', color: '#9333EA' }}>
                                            ✨ Otimizado por IA
                                        </span>
                                    )}
                                </div>
                                
                                {comodo.descricao_processada_ia ? (
                                    <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{comodo.descricao_processada_ia}</p>
                                ) : (
                                    <p className="text-base italic p-3 rounded-lg" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg)' }}>{comodo.descricao_bruta || "Sem descrição."}</p>
                                )}

                                {/* BOTÃO DE IA: SÓ APARECE SE NÃO ESTIVER FINALIZADA E NÃO TIVER IA */}
                                {!isFinalizada && !comodo.descricao_processada_ia && (
                                    <form action={processarDescricaoIA} className="mt-4 pt-4" style={{ borderTop: '2px solid var(--border)' }}>
                                        <input type="hidden" name="comodo_id" value={comodo.id} />
                                        <input type="hidden" name="vistoria_id" value={vistoriaId} />
                                        <button type="submit" className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: '#9333EA' }}>
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
                            <div className="text-center py-8 rounded-xl border-2 border-dashed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Nenhum cômodo cadastrado nesta vistoria.</p>
                                {!isFinalizada && (
                                    <Link href={`/vistoria/${vistoriaId}/editar`} className="text-sm mt-2 inline-block font-semibold" style={{ color: 'var(--primary)' }}>
                                        Adicionar cômodos na edição
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação Final */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3" style={{ borderTop: '2px solid var(--border)' }}>
                    <Link 
                        href={`/vistoria/${vistoriaId}`} 
                        className="vr-btn-ghost flex-1 px-4 py-3 rounded-lg font-semibold text-base text-center border-2"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                        {isFinalizada ? 'Voltar aos Detalhes' : 'Voltar e Editar'}
                    </Link>
                    <BotaoCompartilhar vistoria={vistoria} comodos={comodos || []} />
                    <BotaoGerarPDF vistoria={vistoria} comodos={comodos || []} profile={profile} />
                </div>
            </div>
        </main>
    );
}