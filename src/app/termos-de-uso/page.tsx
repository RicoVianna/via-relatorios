import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const secoes = [
    { titulo: '1. O que é o Via Relatórios', texto: 'O Via Relatórios é uma aplicação web progressiva (PWA) que permite a corretores de imóveis e profissionais do setor criar laudos e relatórios de vistoria imobiliária em PDF, com fotos organizadas por cômodo e descrições técnicas assistidas por inteligência artificial.' },
    { titulo: '2. Criação de conta', texto: 'Para usar o serviço é necessário criar uma conta com e-mail válido e senha. Você é responsável por manter a confidencialidade dos seus dados de acesso e por todas as atividades realizadas na sua conta.' },
    { titulo: '3. Planos e pagamentos', texto: 'O plano gratuito permite a geração de até 3 relatórios por mês. O plano pago (Pro) oferece relatórios ilimitados e recursos adicionais, conforme descrito na página de preços. Valores e condições podem ser alterados mediante aviso prévio.' },
    { titulo: '4. Uso adequado', texto: 'Você concorda em não utilizar o serviço para fins ilícitos, para armazenar conteúdo ofensivo ou que viole direitos de terceiros, ou para tentar burlar limites e mecanismos de segurança da plataforma.' },
    { titulo: '5. Conteúdo gerado', texto: 'As fotos e informações inseridas nas vistorias são de sua responsabilidade. As descrições geradas por inteligência artificial são sugestões e devem ser revisadas por você antes da exportação do laudo final.' },
    { titulo: '6. Propriedade intelectual', texto: 'O código, a marca e o design do Via Relatórios são de nossa propriedade. Os dados, fotos e conteúdos inseridos por você permanecem sendo seus.' },
    { titulo: '7. Limitação de responsabilidade', texto: 'O serviço é fornecido "como está". Não nos responsabilizamos por decisões tomadas com base nos laudos gerados, que devem ser revisados pelo profissional responsável antes do envio às partes.' },
    { titulo: '8. Encerramento', texto: 'Podemos suspender contas que violem estes termos. Você pode deixar de usar o serviço a qualquer momento e solicitar a exclusão dos seus dados.' },
    { titulo: '9. Alterações', texto: 'Estes termos podem ser atualizados. Alterações relevantes serão comunicadas pelo próprio aplicativo antes de entrarem em vigor.' },
    { titulo: '10. Contato', texto: 'Dúvidas sobre estes termos podem ser enviadas pelo canal de suporte do aplicativo.' },
];

export default function TermosDeUsoPage() {
    return (
        <main className="min-h-screen px-4 py-10" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>← Voltar</Link>
                    <ThemeToggle />
                </div>

                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Termos de Uso</h1>
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