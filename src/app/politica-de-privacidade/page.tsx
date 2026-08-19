import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const secoes = [
    { titulo: '1. Quais dados coletamos', texto: 'Dados de conta: nome, e-mail e senha (armazenada de forma criptografada). Dados profissionais: CRECI, logotipo e dados de contato exibidos nos laudos. Dados de vistoria: fotos, cômodos, descrições e informações dos imóveis vistoriados.' },
    { titulo: '2. Para que usamos seus dados', texto: 'Criar e manter sua conta; gerar, armazenar e sincronizar seus relatórios; prestar suporte; melhorar o serviço; e cumprir obrigações legais. As bases legais são a execução de contrato e o legítimo interesse, nos termos da LGPD.' },
    { titulo: '3. Com quem compartilhamos', texto: 'Não vendemos seus dados. Compartilhamos apenas com provedores de infraestrutura (Supabase e Vercel), exclusivamente para hospedar e operar o serviço, e com autoridades, quando exigido por lei.' },
    { titulo: '4. Onde e por quanto tempo armazenamos', texto: 'Seus dados ficam armazenados em infraestrutura com medidas de segurança padrão do setor, enquanto sua conta existir. Você pode solicitar a exclusão a qualquer momento.' },
    { titulo: '5. Seus direitos (LGPD)', texto: 'Você pode solicitar, a qualquer momento: confirmação do tratamento, acesso, correção, anonimização, portabilidade e exclusão dos seus dados, além de revogar consentimentos.' },
    { titulo: '6. Cookies e armazenamento local', texto: 'Usamos apenas armazenamento técnico essencial: sessão de login e preferência de tema (claro/escuro) no seu dispositivo. Não usamos cookies de publicidade ou rastreamento.' },
    { titulo: '7. Inteligência artificial', texto: 'As descrições geradas por IA utilizam apenas as informações que você insere na vistoria para produzir o texto técnico correspondente. Nenhum dado é usado para treinar modelos de terceiros.' },
    { titulo: '8. Contato do encarregado de dados', texto: 'Para exercer qualquer dos seus direitos, utilize o canal de suporte do aplicativo.' },
];

export default function PoliticaDePrivacidadePage() {
    return (
        <main className="min-h-screen px-4 py-10" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>← Voltar</Link>
                    <ThemeToggle />
                </div>

                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Política de Privacidade</h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Última atualização: 20 de agosto de 2026</p>

                <div className="space-y-6">
                    {secoes.map((s) => (
                        <section key={s.titulo}>
                            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{s.titulo}</h2>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.texto}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}