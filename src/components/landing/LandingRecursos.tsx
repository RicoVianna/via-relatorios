import { Sparkles, BadgeCheck, Camera, Cloud, Briefcase, Building2, Home } from 'lucide-react';

const publicos = [
    {
        icone: Briefcase,
        titulo: 'Corretores Autônomos',
        texto: 'Agilize suas locações e vendas, passe autoridade visual aos clientes e feche contratos sem pendências burocráticas.',
    },
    {
        icone: Building2,
        titulo: 'Administradoras & Imobiliárias',
        texto: 'Padronize a vistoria de toda a sua equipe de corretores e vistoriadores com o mesmo nível de qualidade e identidade.',
    },
    {
        icone: Home,
        titulo: 'Proprietários & Gestores de Imóveis',
        texto: 'Tenha documentações detalhadas do estado dos seus imóveis antes e depois de qualquer contrato de locação.',
    },
];

export default function LandingRecursos() {
    return (
        <>
            {/* ===== RECURSOS (BENTO GRID) ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Recursos
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Tudo o que sua vistoria precisa
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card grande: IA */}
                        <div
                            className="md:col-span-2 p-6 rounded-xl border-2 shadow-sm"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                            <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
                            >
                                Inteligência Artificial
                            </span>
                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                                Descrições técnicas geradas em segundos
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Ditou "parede com descascamento perto da janela"? A IA transforma a frase em texto
                                formal e padronizado para o relatório.
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <Sparkles size={18} style={{ color: 'var(--accent)' }} />
                                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                    Texto bruto → linguagem de laudo profissional
                                </span>
                            </div>
                        </div>

                        {/* Card: Marca & CRECI */}
                        <div className="p-6 rounded-xl border-2 shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <BadgeCheck size={22} className="mb-3" style={{ color: 'var(--accent)' }} />
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Sua Marca & Seu CRECI</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Insira a logo da sua imobiliária e o número do registro profissional no cabeçalho dos documentos.
                            </p>
                        </div>

                        {/* Card: Fotos por cômodo */}
                        <div className="p-6 rounded-xl border-2 shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <Camera size={22} className="mb-3" style={{ color: 'var(--accent)' }} />
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Fotos por Cômodo e Estado</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Categorização automática por ambientes (Sala, Varanda, Suíte) com indicação de estado de conservação.
                            </p>
                        </div>

                        {/* Card: Nuvem/PWA */}
                        <div
                            className="md:col-span-2 p-6 rounded-xl border-2 shadow-sm"
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                            <Cloud size={22} className="mb-3" style={{ color: 'var(--accent)' }} />
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                                No celular e no computador, sem loja de aplicativos
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Instale direto pelo navegador. Seus dados ficam salvos com segurança na nuvem e
                                sincronizam entre todos os seus dispositivos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PARA QUEM É ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Para quem é
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Criado sob medida para o mercado imobiliário
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {publicos.map((p, i) => (
                            <div
                                key={p.titulo}
                                className="text-center px-4"
                                style={{
                                    borderLeft: i > 0 ? '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' : 'none',
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid var(--accent)' }}
                                >
                                    <p.icone size={22} style={{ color: 'var(--accent)' }} />
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