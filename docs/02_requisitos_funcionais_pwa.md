# 02 - Requisitos Funcionais e Mapa de Telas (ViaRelatórios)

## 1. Visão Geral da Arquitetura do PWA
- **Tecnologia Sugerida:** React / Next.js (App Router), Tailwind CSS, PWA Manifest + Service Worker (suporte a instalação e funcionamento offline básico).
- **Backend & Auth:** Supabase (Auth, Postgres Database, Storage para imagens).
- **Geração de PDF:** Executada 100% no client-side (usando `pdfmake` ou `jsPDF`) para economizar servidor.
- **Inteligência Artificial:** Chamada à API da OpenAI (`gpt-4o-mini`) via API Route para tratamento e enriquecimento de texto técnico.

---

## 2. Mapa Completo de Telas

- Tela 01: Login / Cadastro (`/login`)
- Tela 02: Dashboard / Lista de Vistorias (`/dashboard`)
- Tela 03: Perfil do Corretor / Configuração da Logo (`/perfil`)
- Tela 04: Formulário de Nova Vistoria (Wizard 3 Passos) (`/vistoria/nova`)
  - Passo 1: Dados Gerais (Cliente, Endereço, Data)
  - Passo 2: Captura de Cômodos (Fotos + Descrição/Áudio)
  - Passo 3: Pré-visualização do Texto IA & Download do PDF

---

## 3. Detalhamento Específico por Tela

### Tela 01: Login e Cadastro (`/login`)
* **Objetivo:** Autenticação rápida de corretores autônomos.
* **Componentes da Tela:**
  - Form de login com **E-mail / Senha** ou **Link Mágico por E-mail**.
  - Botão de cadastro alternativo ("Criar conta em 30 segundos").
  - Campo opcional no cadastro: **CRECI** (para personalizar o relatório).
* **Regra de Negócio:**
  - Ao cadastrar, o usuário recebe automaticamente o plano `GRATUITO` (limite de 3 relatórios/mês).

---

### Tela 02: Dashboard de Vistorias (`/dashboard`)
* **Objetivo:** Tela principal após o login. Lista relatórios criados e atua como atalho para novos relatórios.
* **Componentes da Tela:**
  - Header fixo com nome do corretor, status da conta (`Plano Grátis - 1/3 usados` ou `Plano Pro`) e botão de perfil.
  - Botão de ação rápida bem visível: **"+ Nova Vistoria / Captação"**.
  - Lista/Cards de vistorias anteriores contendo:
    - Endereço do imóvel.
    - Data de criação.
    - Status (`Rascunho` ou `Finalizado`).
    - Botão para **Baixar PDF novamente** ou **Compartilhar no WhatsApp**.
* **Estado Vazio (Empty State):** Se não houver relatórios, exibir ilustração com frase: *"Nenhuma vistoria realizada ainda. Toque no botão acima para criar a primeira em 2 minutos."*

---

### Tela 03: Perfil do Corretor & Marca D'água (`/perfil`)
* **Objetivo:** Permitir que o corretor personalize como a marca dele aparece nos PDFs.
* **Componentes da Tela:**
  - Input para upload da **Logo da Imobiliária/Corretor** (JPG/PNG).
  - Campos de texto: Nome Completo, Número do CRECI, Telefone de Contato, E-mail profissional.
  - Seção do Plano de Assinatura:
    - Exibe limite mensal de relatórios.
    - Botão **"Fazer Upgrade para o Plano Pro (R$ 39,90/mês)"** integrado ao gateway de pagamento (Asaas/Stripe).

---

### Tela 04: Criador de Vistoria (Wizard em 3 Passos) (`/vistoria/nova`)

#### Passo 1: Dados do Imóvel e Cliente
* **Campos Obrigatórios:**
  - Endereço completo (Rua, Número, Bairro, Cidade).
  - Tipo de relatório: `Vistoria de Entrada`, `Vistoria de Saída` ou `Captação de Imóvel`.
  - Nome do Proprietário / Inquilino.
  - Data da Vistoria (preenchida automaticamente com a data de hoje).

#### Passo 2: Captura de Cômodos e Fotos (O Coração do App)
* **Estrutura Repetível (Dynamic Form):** O corretor pode adicionar múltiplos cômodos (ex: *Sala de Estar*, *Cozinha*, *Suíte Principal*, *Varanda*).
* **Para cada cômodo criado:**
  - **Botão de Câmera/Upload:** Tira fotos na hora ou seleciona da galeria do celular (máximo de 4 fotos por cômodo na versão grátis; ilimitado no Pro).
  - **Campo de Texto / Ditado por Áudio:** Um campo de texto livre onde o corretor escreve rascunhos rápidos ou usa o teclado do celular para ditar por voz.
    - *Exemplo de input bruto:* "parede com risco de caneta, piso ok, janela emperrada para fechar".
  - **Botão "Melhorar Descrição com IA":** Envia o texto rascunhado para a API da OpenAI.
    - *Exemplo de output processado:* "Paredes com avarias superficiais (marcas de caneta). Revestimento cerâmico do piso em bom estado. Esquadria de alumínio da janela com resistência mecânica ao fechamento."

#### Passo 3: Revisão e Geração do PDF
* **Ações da Tela:**
  - Exibe um resumo visual do relatório montado.
  - **Botão Principal: "Gerar e Baixar PDF Profissional"**.
  - **Botão Secundário: "Enviar direto para o WhatsApp do Cliente"** (Gera uma mensagem pronta com o link/arquivo).
* **Regra da Marca D'água:**
  - Se o usuário for do plano `GRATUITO`, o PDF gerado incluirá no rodapé a frase: *"Relatório gerado pelo ViaRelatórios - Crie vistorias em minutos no celular"*.
  - Se for `PRO`, a marca d'água é removida e o cabeçalho exibe a logo + dados do corretor em destaque.

---

## 4. Requisitos Não-Funcionais (PWA e Performance)
1. **Responsividade Mobile-First:** Interface projetada exclusivamente para telas de smartphones (360px a 430px de largura).
2. **Suporte a Câmera Nativa:** Abertura direta do aplicativo de câmera do celular ao tocar no botão de foto.
3. **PWA Instalável:** Presença do arquivo `manifest.json` e ícone configurado para permitir que o corretor toque em "Adicionar à Tela Inicial".
4. **Resiliência a Falhas de Sinal:** Se a internet oscilar no meio da vistoria, as fotos e textos digitados devem ficar salvos no `localStorage` do navegador para evitar perda de dados.

---

## 5. Próximos Passos
Com os requisitos funcionais definidos, o próximo arquivo de documentação a ser gerado para a IA de código é o `03_arquitetura_banco_de_dados.md`, contendo os scripts SQL e tabelas do Supabase.