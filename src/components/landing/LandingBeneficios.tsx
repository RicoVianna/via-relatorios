import { Clock, FileText, ShieldCheck, Camera, Sparkles, FileDown } from 'lucide-react';

const beneficios = [
    {
        icone: Clock,
        titulo: 'Economize até 3 horas por laudo',
        texto: 'Esqueça o processo de descarregar fotos no computador, organizar pastas e formatar tabelas manualmente no Word.',
    },
    {
        icone: FileText,
        titulo: 'PDFs corporativos de alto padrão',
        texto: 'Entregue documentos com visual elegante, cabeçalho personalizado, dados do seu CRECI e formatação padronizada.',
    },
    {
        icone: ShieldCheck,
        titulo: 'Zero margem para contestações',
        texto: 'Mapeie o estado real do imóvel com registros fotográficos detalhados e observações técnicas estruturadas.',
    },
];

const passos = [
    {
        numero: '01',
        icone: Camera,
        titulo: 'Fotografe e Selecione',
        texto: 'Abra o app no celular, selecione o ambiente (ex: Cozinha) e tire as fotos diretamente pela câmera.',
    },
    {
        numero: '02',
        icone: Sparkles,
        titulo: 'Detalhe com Inteligência',
        texto: 'Use nossa IA para transformar anotações rápidas em descrições técnicas instantaneamente.',
    },
    {
        numero: '03',
        icone: FileDown,
        titulo: 'Emita o PDF',
        texto: 'Clique em exportar. Seu laudo completo com sua marca e CRECI está pronto para envio via WhatsApp ou e-mail.',
    },
];

export default function LandingBeneficios() {
    return (
        <>
            {/* ===== PROVA & BENEFÍCIOS ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Por que o Via Relatórios?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Troque horas de digitação por vistorias concluídas no local.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {beneficios.map((b) => (
                            <div
                                key={b.titulo}
                                className="p-6 rounded-xl border-2 shadow-sm"
                                style={{ backgroundColor: 'var(--bg)', borderColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid var(--accent)' }}
                                >
                                    <b.icone size={22} style={{ color: 'var(--accent)' }} />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{b.titulo}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Como funciona
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Simplicidade operacional em três etapas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {passos.map((p) => (
                            <div key={p.numero} className="relative text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                    <span className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>{p.numero}</span>
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--accent)' }}
                                    >
                                        <p.icone size={22} style={{ color: 'var(--primary)' }} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{p.titulo}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}