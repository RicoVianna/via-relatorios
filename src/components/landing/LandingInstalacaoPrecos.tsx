import Link from 'next/link';
import { Smartphone, Apple, Monitor, Check } from 'lucide-react';

const plataformas = [
    {
        icone: Smartphone,
        nome: 'Android',
        passo: 'Abra no Chrome → toque nos três pontos → "Instalar aplicativo".',
    },
    {
        icone: Apple,
        nome: 'iPhone (iOS)',
        passo: 'Abra no Safari → toque em Compartilhar → "Adicionar à Tela de Início".',
    },
    {
        icone: Monitor,
        nome: 'PC / Desktop',
        passo: 'Abra no Edge ou Chrome → clique no ícone de instalar na barra de endereço → "Instalar".',
    },
];

const planoGratis = [
    '3 relatórios completos por mês',
    'Exportação em PDF com CRECI',
    'Fotos ilimitadas por relatório',
    'Suporte básico',
];

const planoPro = [
    'Relatórios ilimitados',
    'Descrições automáticas com Inteligência Artificial',
    'Logotipo personalizado no cabeçalho do PDF',
    'Sincronização entre celular e computador',
    'Suporte prioritário via WhatsApp',
];

export default function LandingInstalacaoPrecos() {
    return (
        <>
            {/* ===== INSTALAÇÃO MULTIPLATAFORMA ===== */}
            <section id="instalacao" className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--bg)' }}>
                <div
                    className="max-w-5xl mx-auto rounded-2xl p-8 md:p-12 border-2 shadow-xl"
                    style={{ backgroundColor: '#2C3A2C', borderColor: '#C2A24B' }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: '#F6F5F1' }}>
                        Use no celular, tablet ou computador
                    </h2>
                    <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: '#A8B0A0' }}>
                        Por ser um PWA (Aplicativo Web Progressivo), o Via Relatórios não ocupa memória
                        e pode ser instalado sem passar pelas lojas de aplicativos.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plataformas.map((p) => (
                            <div key={p.nome} className="text-center">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: 'rgba(194, 162, 75, 0.15)', border: '1px solid #C2A24B' }}
                                >
                                    <p.icone size={22} style={{ color: '#C2A24B' }} />
                                </div>
                                <h3 className="font-bold mb-2" style={{ color: '#F6F5F1' }}>{p.nome}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#A8B0A0' }}>{p.passo}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs mt-8" style={{ color: '#A8B0A0' }}>
                        E se um dia quiser remover, é como qualquer outro app do seu dispositivo — sem travas, sem processos complicados.
                    </p>
                </div>
            </section>

            {/* ===== PREÇOS ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-bold tracking-widest uppercase text-center mb-3" style={{ color: 'var(--accent)' }}>
                        Planos
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
                        Comece grátis, evolua quando precisar
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Plano Grátis */}
                        <div className="p-8 rounded-2xl border-2 shadow-sm flex flex-col" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Grátis</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Ideal para testar a plataforma no seu ritmo.</p>
                            <p className="mb-6">
                                <span className="text-4xl font-bold" style={{ color: 'var(--text)' }}>R$ 0</span>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}> / mês</span>
                            </p>
                            <ul className="space-y-3 mb-8 flex-1">
                                {planoGratis.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                                        <Check size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/cadastro"
                                className="vr-btn-ghost block text-center px-6 py-3 rounded-lg font-semibold border-2"
                                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                            >
                                Começar Grátis
                            </Link>
                        </div>

                        {/* Plano Pro */}
                        <div className="relative p-8 rounded-2xl border-2 shadow-xl flex flex-col" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--accent)' }}>
                            <span
                                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                style={{ backgroundColor: 'var(--accent)', color: '#1B211B' }}
                            >
                                MAIS POPULAR
                            </span>
                            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Pro</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Produção ilimitada e automação total com IA.</p>
                            <p className="mb-6">
                                <span className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>R$ 39,90</span>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}> / mês</span>
                            </p>
                            <ul className="space-y-3 mb-8 flex-1">
                                {planoPro.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                                        <Check size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/cadastro"
                                className="vr-btn-primary block text-center px-6 py-3 rounded-lg font-bold text-white"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                Assinar Plano Pro
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}