import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// Página PÚBLICA: usa a service role (somente no servidor) para ler
// o laudo pelo código de validação, sem precisar de login.
export default async function LaudoPublicoPage({ params }: { params: Promise<{ codigo: string }> }) {
    const { codigo } = await params;

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: vistoria } = await supabaseAdmin
        .from('vistorias')
        .select('*')
        .eq('codigo_validacao', codigo)
        .single();

    // Código inexistente ou laudo não finalizado = página não encontrada
    if (!vistoria || vistoria.status !== 'FINALIZADO') {
        notFound();
    }

    const { data: comodos } = await supabaseAdmin
        .from('comodos')
        .select('*')
        .eq('vistoria_id', vistoria.id)
        .order('criado_em', { ascending: true });

    const { data: fotos } = await supabaseAdmin
        .from('fotos')
        .select('*')
        .eq('vistoria_id', vistoria.id)
        .order('ordem', { ascending: true });

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', paddingBottom: 48 }}>
            <header style={{ backgroundColor: '#1B211B', color: '#FFFFFF', padding: '16px 24px' }}>
                <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Via Relatórios</p>
                <p style={{ fontSize: 12, opacity: 0.8, margin: '4px 0 0' }}>Laudo oficial — validação de autenticidade</p>
            </header>

            <div style={{ maxWidth: 760, margin: '24px auto', padding: '0 16px' }}>
                {/* Cabeçalho do laudo */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Laudo de Vistoria Imobiliária</h1>
                        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                            ✓ Documento Finalizado
                        </span>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: 13, marginTop: 8, marginBottom: 0 }}>
                        Código de validação: <strong>{codigo}</strong>
                    </p>

                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14, color: '#374151' }}>
                        <p style={{ margin: 0 }}><strong>Endereço:</strong> {vistoria.endereco_rua}, {vistoria.endereco_numero} {vistoria.endereco_complemento || ''}</p>
                        <p style={{ margin: 0 }}><strong>Bairro/Cidade:</strong> {vistoria.endereco_bairro} - {vistoria.endereco_cidade}</p>
                        <p style={{ margin: 0 }}><strong>Proprietário:</strong> {vistoria.nome_cliente || 'Não informado'}</p>
                        {vistoria.nome_locatario && <p style={{ margin: 0 }}><strong>Inquilino:</strong> {vistoria.nome_locatario}</p>}
                        <p style={{ margin: 0 }}><strong>Tipo:</strong> {vistoria.tipo === 'ENTRADA' ? 'Entrada' : vistoria.tipo === 'SAIDA' ? 'Saída' : 'Captação'}</p>
                        <p style={{ margin: 0 }}><strong>Data da vistoria:</strong> {new Date(vistoria.data_vistoria).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {/* Cômodos com fotos */}
                {(comodos ?? []).map((comodo: any) => {
                    const fotosDoComodo = (fotos ?? []).filter((f: any) => f.comodo_id === comodo.id);
                    return (
                        <div key={comodo.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E5E7EB', marginTop: 16 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{comodo.nome_comodo}</h2>
                            <p style={{ color: '#374151', fontSize: 14, marginTop: 8, marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                                {comodo.descricao_processada_ia || comodo.descricao_bruta || 'Sem descrição.'}
                            </p>
                            {fotosDoComodo.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                                    {fotosDoComodo.map((foto: any) => (
                                        <figure key={foto.id} style={{ margin: 0, width: 160 }}>
                                            <img
                                                src={foto.url}
                                                alt={foto.legenda || 'Foto do cômodo'}
                                                style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB', display: 'block' }}
                                            />
                                            {foto.legenda && (
                                                <figcaption style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{foto.legenda}</figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 24 }}>
                    Este laudo foi gerado eletronicamente pelo sistema Via Relatórios e sua autenticidade pode ser confirmada pelo código {codigo}.
                </p>
            </div>
        </main>
    );
}