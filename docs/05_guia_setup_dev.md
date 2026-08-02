# 05 - Guia de Setup e Inicialização do Ambiente (ViaRelatórios)

## 1. Visão Geral do Setup
Este documento guia o passo a passo para criar o projeto **ViaRelatórios** a partir do zero utilizando o terminal do VS Code ou do seu editor de código.

Todas as ferramentas utilizadas neste guia possuem suporte para **uso gratuito** durante a fase de desenvolvimento e validação.

---

## 2. Requisitos Prévios
Antes de iniciar a instalação, certifique-se de ter os seguintes recursos instalados na sua máquina:
- Node.js (versão 18.0.0 ou superior)
- NPM ou PNPM como gerenciador de pacotes
- Conta gratuita criada no Supabase (supabase.com)
- Chave de API da OpenAI (platform.openai.com)

---

## 3. Passo a Passo de Criação do Projeto

### Passo 1: Criar a aplicação Next.js com Tailwind CSS
Abra o terminal no VS Code na pasta onde deseja criar o projeto e execute o comando:

npx create-next-app@latest viarelatorios --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

Acesse a pasta do projeto criada:
cd viarelatorios

### Passo 2: Instalar as dependências do projeto
Execute o comando abaixo para instalar as bibliotecas do Supabase, OpenAI, gerador de PDF e ícones:

npm install @supabase/supabase-js @supabase/ssr openai pdfmake lucide-react

### Passo 3: Configurar o arquivo de variáveis de ambiente (.env.local)
Na raiz do projeto `viarelatorios`, crie um arquivo chamado `.env.local` e insira as seguintes chaves:

NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
OPENAI_API_KEY=sua_chave_de_api_da_openai_aqui

---

## 4. Diretrizes Obrigatórias para a IA de Código

Ao utilizar este repositório com IAs de código (Qwen, Grok, Kimi, Cursor, Roo Code), as seguintes regras devem ser rigorosamente respeitadas:

1. Indentação: Todo o código TypeScript, JSX, CSS e JSON deve ser gerado utilizando exatamente 4 espaços de indentação.
2. Instruções de Edição: A IA deve ser cirúrgica ao indicar alterações, especificando o caminho completo do arquivo, a função e as linhas exatas de inserção ou substituição.
3. Compatibilidade Mobile: Todas as telas e componentes Tailwind devem ser projetados prioritariamente para telas pequenas de smartphones (Mobile-First), utilizando classes como `w-full`, `max-w-md`, e `px-4`.

---

## 5. Estrutura Inicial de Pastas Recomendada

viarelatorios/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx
│   │   │   └── vistoria/
│   │   │       └── nova/
│   │   │           └── page.tsx
│   │   ├── api/
│   │   │   └── processar-ia/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── vistorias/
│   ├── lib/
│   │   ├── supabase/
│   │   └── openai.ts
│   └── types/
│       └── database.ts
├── public/
│   └── manifest.json
├── .env.local
└── package.json

---

## 6. Próximos Passos
Com a estrutura de documentos da pasta `viarelatorios-docs/` finalizada (arquivos 01 a 05), a documentação do projeto está concluída. Você já pode passar esta pasta de documentação para a sua IA de código e solicitar a criação dos primeiros componentes da aplicação.