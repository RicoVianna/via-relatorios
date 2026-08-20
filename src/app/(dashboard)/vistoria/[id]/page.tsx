import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ModalAdicionarComodo from './ModalAdicionarComodo';
import { finalizarVistoria } from './actions';
import HistoricoModal from './HistoricoModal';
import GaleriaFotos from '@/components/GaleriaFotos';

export default async function DetalhesVistoriaPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id: vistoriaId } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: vistoria } = await supabase.from('vistorias').select('*').eq('id', vistoriaId).eq('user_id', user.id).single();
    if (!vistoria) redirect('/dashboard');

    const { data: comodos } = await supabase.from('comodos').select('*').eq('vistoria_id', vistoriaId).order('criado_em', { ascending: true });

    const { data: fotos } = await supabase.from('fotos').select('*').eq('vistoria_id', vistoriaId).order('ordem', { ascending: true });

    const { data: historico } = await supabase
        .from('historico_alteracoes')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('data_hora', { ascending: false });

    const dataFormatada = new Date(vistoria.data_vistoria).toLocaleDateString('pt-BR');
    const isFinalizada = vistoria.status === 'FINALIZADO';

    return (
        <main className="min-h-screen p-4 md:p-8 relative" style={{ backgroundColor: 'var(--bg)' }}>
            {isFinalizada && (
                <div className="fixed inset-0 backdrop-blur-[1px] z-40 pointer-events-none flex items-start justify-center pt-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <div className="border-2 px-6 py-3 rounded-lg shadow-lg font-semibold text-sm flex items-center gap-2" style={{ backgroundColor: '#FED7AA', borderColor: '#FB923C', color: '#9A3412' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Vistoria Finalizada - Documento Bloqueado para Edição
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link 
                        href="/dashboard" 
                        className="vr-back-link relative z-50 flex items-center font-medium px-4 py-2 rounded-lg shadow-sm border-2"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                        ← Voltar ao Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <HistoricoModal historico={historico || []} />
                        <span 
                            className="px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ backgroundColor: 'rgba(67, 82, 64, 0.2)', color: 'var(--primary)' }}
                        >
                            {vistoria.status}
                        </span>
                    </div>
                </div>

                <div className="p-6 md:p-8 rounded-xl shadow-lg border-2 mb-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text)' }}>
                                Vistoria de {vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação'}
                            </h1>
                            <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>Realizada em {dataFormatada}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                            <Link 
                                href={`/vistoria/${vistoriaId}/revisao`} 
                                className="vr-btn-accent relative z-50 px-5 py-3 text-white rounded-lg font-semibold text-base transition-colors text-center flex items-center justify-center gap-2 shadow-md"
                                style={{ backgroundColor: '#9333EA' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {isFinalizada ? 'Visualizar e Baixar PDF' : 'Revisar e Gerar PDF'}
                            </Link>

                            {!isFinalizada && (
                                <>
                                    <Link 
                                        href={`/vistoria/${vistoriaId}/editar`} 
                                        className="vr-btn-ghost relative z-50 px-5 py-3 rounded-lg font-semibold text-base transition-colors text-center border-2"
                                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    >
                                        Editar Dados
                                    </Link>
                                    
                                    <form action={finalizarVistoria.bind(null, vistoriaId)}>
                                        <button 
                                            type="submit" 
                                            className="vr-btn-primary w-full sm:w-auto px-5 py-3 text-white rounded-lg font-semibold text-base transition-colors shadow-md"
                                            style={{ backgroundColor: '#10B981' }}
                                        >
                                            Finalizar Vistoria
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6" style={{ borderTop: '2px solid var(--border)' }}>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Proprietário / Cliente</h3>
                            <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{vistoria.nome_cliente}</p>
                        </div>
                        {vistoria.nome_locatario && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Locatário / Inquilino</h3>
                                <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{vistoria.nome_locatario}</p>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Endereço do Imóvel</h3>
                            <p className="text-base" style={{ color: 'var(--text)' }}>{vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento && `- ${vistoria.endereco_complemento}`}</p>
                            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{vistoria.endereco_bairro}</p>
                            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{vistoria.endereco_cidade} {vistoria.endereco_cep && `- CEP: ${vistoria.endereco_cep}`}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 rounded-xl shadow-lg border-2" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Cômodos Vistoriados</h2>
                    </div>
                    
                    {comodos && comodos.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            {comodos.map((comodo: any) => (
                                <div key={comodo.id} className="p-5 rounded-lg border-2 shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
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
                                        <p className="text-base italic" style={{ color: 'var(--text-secondary)' }}>{comodo.descricao_bruta || "Sem descrição."}</p>
                                    )}
                                    <GaleriaFotos
                                        comodoId={comodo.id}
                                        vistoriaId={vistoriaId}
                                        fotos={(fotos ?? []).filter((f: any) => f.comodo_id === comodo.id)}
                                        modo="leitura"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 rounded-lg border-2 border-dashed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                            <p className="text-base">Nenhum cômodo adicionado ainda.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}