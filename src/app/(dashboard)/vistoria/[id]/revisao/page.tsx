import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { processarDescricaoIA } from './actions';

export default async function RevisaoPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const vistoriaId = params.id;

    // Buscar dados da vistoria
    const { data: vistoria } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id', vistoriaId)
        .single();

    if (!vistoria) {
        redirect('/dashboard');
    }

    // Buscar cômodos da vistoria
    const { data: comodos } = await supabase
        .from('comodos')
        .select('*')
        .eq('vistoria_id', vistoriaId)
        .order('ordem', { ascending: true });

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center">
                <Link href={`/vistoria/${vistoriaId}/editar`} className="text-gray-600 mr-4">
                    ← Voltar
                </Link>
                <h1 className="text-lg font-bold text-gray-900">Revisão Final</h1>
            </header>

            <div className="p-4 space-y-4">
                {/* Resumo da Vistoria */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">
                        {vistoria.endereco_rua}, {vistoria.endereco_numero} - {vistoria.endereco_bairro}
                    </p>
                    <p className="font-medium text-gray-800 mt-1">
                        {vistoria.tipo} - {vistoria.nome_cliente || 'Cliente não informado'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {comodos?.length || 0} cômodo(s) cadastrado(s)
                    </p>
                </div>

                {/* Lista de Cômodos para Revisão */}
                <div className="space-y-3">
                    {comodos?.map((comodo: any) => (
                        <div key={comodo.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900">{comodo.nome_comodo}</h3>
                            <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                                {comodo.descricao_bruta || 'Sem descrição.'}
                            </p>
                            
                            {comodo.descricao_processada_ia && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-purple-600 mb-1">Versão IA:</p>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {comodo.descricao_processada_ia}
                                    </p>
                                </div>
                            )}

                            {!comodo.descricao_processada_ia && (
                                <form action={processarDescricaoIA} className="mt-3 pt-3 border-t border-gray-100">
                                    <input type="hidden" name="comodo_id" value={comodo.id} />
                                    <input type="hidden" name="vistoria_id" value={vistoria.id} />
                                    <button type="submit" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
                                        ✨ Melhorar este texto com IA
                                    </button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botões de Ação Final */}
                <div className="pt-4 space-y-3">
                    <button className="w-full rounded-md bg-green-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
                        Gerar e Baixar PDF
                    </button>
                </div>
            </div>
        </main>
    );
}