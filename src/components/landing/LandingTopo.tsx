import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import AcoesPwa from '@/components/landing/AcoesPwa';

export default function LandingTopo() {
    return (
        <>
            {/* ===== HEADER FIXO ===== */}
            <header
                className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-3"
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--accent)' }}
                    >
                        <img src="/icon-192.png" alt="Via Relatórios" className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Via Relatórios</span>
                </div>

                <div className="flex items-center gap-2">
                    <AcoesPwa />
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="hidden sm:block px-3 py-2 text-sm font-semibold rounded-lg"
                        style={{ color: 'var(--text)' }}
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/cadastro"
                        className="vr-btn-primary px-4 py-2 text-sm font-semibold text-white rounded-lg"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        Criar conta
                    </Link>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <section className="px-4 md:px-8 py-16 md:py-24" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <span
                            className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                        >
                            Laudos em minutos, direto do celular
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: 'var(--text)' }}>
                            Laudos de vistoria imobiliária impecáveis.{' '}
                            <span style={{ color: 'var(--accent)' }}>Sem papelada, sem complicação.</span>
                        </h1>

                        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                            Crie laudos em PDF com padrão corporativo, fotos organizadas por cômodo e descrições
                            automáticas por IA. Pronto antes mesmo de sair do imóvel.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Link
                                href="/cadastro"
                                className="vr-btn-primary px-8 py-4 rounded-lg text-base font-bold text-white shadow-lg"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                Gerar Meu Primeiro Laudo
                            </Link>
                        </div>
                        <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
                            Teste grátis com 3 relatórios por mês. Não pede cartão.
                        </p>
                    </div>

                    {/* ===== MOCKUP DO CELULAR ===== */}
                    <div className="relative mx-auto w-[280px] rounded-[36px] p-3 shadow-2xl" style={{ backgroundColor: '#2B2F2B', border: '1px solid var(--accent)' }}>
                        <div className="rounded-[28px] overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                            <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: 'var(--primary)' }}>
                                <div className="w-6 h-6 rounded-md bg-white/90 flex items-center justify-center">
                                    <img src="/icon-192.png" alt="" className="w-4 h-4" />
                                </div>
                                <span className="text-white text-xs font-semibold">Imobiliária Exemplo • CRECI 654321-SP</span>
                            </div>
                            <div className="p-4 space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                                    Sala de Estar
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="h-14 rounded-lg" style={{ background: 'linear-gradient(140deg, #6B7A5E, #2C3A2C)' }} />
                                    <div className="h-14 rounded-lg" style={{ background: 'linear-gradient(140deg, #435240, #1B211B)' }} />
                                    <div className="h-14 rounded-lg" style={{ background: 'linear-gradient(140deg, #6B7A5E, #2C3A2C)' }} />
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ border: '1px solid var(--accent)', color: 'var(--text-secondary)' }}
                                    >
                                        Parede com infiltração leve
                                    </span>
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{ border: '1px solid var(--accent)', color: 'var(--text-secondary)' }}
                                    >
                                        Piso de madeira preservado
                                    </span>
                                </div>
                                <div
                                    className="rounded-lg py-2 text-center text-xs font-bold"
                                    style={{ backgroundColor: 'var(--accent)', color: '#1B211B' }}
                                >
                                    Exportar PDF com CRECI
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}