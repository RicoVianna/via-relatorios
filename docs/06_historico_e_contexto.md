# 06 - Histórico de Desenvolvimento e Gestão de Contexto (ViaRelatórios)

## 1. Regra de Ouro para Troca de Janela / Reinício de Chat
Sempre que o usuário iniciar uma nova sessão ou janela de chat com a IA de código, os seguintes arquivos da pasta `viarelatorios-docs/` devem ser carregados para restaurar o contexto:

1. `02_requisitos_funcionais_pwa.md` (Para lembrar as telas e fluxos).
2. `03_arquitetura_banco_de_dados.md` (Para lembrar as tabelas do Supabase).
3. `04_system_prompt_ia_pdf.md` (Para lembrar a regra de indentação de 4 espaços e prompts de IA).
4. `06_historico_e_contexto.md` (Para saber exatamente em qual etapa o projeto parou).

---

## 2. Instruções de Comportamento para a IA em Novas Janelas

Ao receber este arquivo no início de uma nova conversa, a IA deve obrigatoriamente:

1. Respeitar a Indentação de 4 Espaços: Todo e qualquer código TSX, TS, CSS ou SQL deve manter 4 espaços de recuo.
2. Ser Cirúrgica nas Instruções de Edição: Não enviar arquivos inteiros de 300 linhas se alterou apenas uma função. Indicar o nome do arquivo, a função e onde colar a alteração.
3. Checar a Seção 4 Deste Documento: Identificar qual foi o último componente criado e aguardar a instrução do usuário sobre o próximo passo sem reescrever o que já funciona.

---

## 3. Checklist do Status da Aplicação (Atualizado pelo Desenvolvedor)

- [ ] Status 01: Setup do Next.js + Tailwind + .env.local configurado.
- [ ] Status 02: Tabelas e RLS criados no Supabase (Script SQL 03 executado).
- [ ] Status 03: Tela de Login/Cadastro funcionando (`/login`).
- [ ] Status 04: Dashboard de vistorias funcionando (`/dashboard`).
- [ ] Status 05: Tela de Perfil e Upload da Logo (`/perfil`).
- [ ] Status 06: Criador de Vistoria Passo 1 (Dados do Imóvel).
- [ ] Status 07: Criador de Vistoria Passo 2 (Fotos + Ditado de Voz/Texto + Integração OpenAI).
- [ ] Status 08: Criador de Vistoria Passo 3 (Geração e Download do PDF).
- [ ] Status 09: Teste final do PWA no dispositivo móvel.

---

## 4. Log do Último Ponto Parado (Atualizar Sempre Antes de Mudar de Chat)

- **Data/Hora Atual:** [Preencher quando for trocar de chat]
- **Última funcionalidade concluída:** [Ex: Criada a tela de login em /app/(auth)/login/page.tsx]
- **Próxima tarefa a realizar:** [Ex: Criar a tabela profiles no Supabase e integrar a rota de perfil]