# IsentaPCD — Plano de Execução

Plataforma full-stack que guia pessoas com deficiência (PCD condutor ou familiar/responsável de PCD não condutor) na obtenção de isenção de **IPI + ICMS + IPVA** na compra de carro 0 km **em todo o Brasil (27 UFs completas — escopo nacional desde o lançamento)**. IPI é federal (regra única); ICMS e IPVA são estaduais — matriz de regras por UF (lei, teto de preço, prazos, órgão, processo, guias) é o coração do produto.

## Decisões de produto (fechadas com o usuário)
- **Marca:** IsentaPCD
- **Cobertura:** nacional — 27 UFs completas (matriz de regras ICMS/IPVA por estado, simulador e quiz adaptáveis por UF, guia com página por estado)
- **Execução paga:** nacional — R$ 497 em qualquer UF (pagamento único, sem mensalidade) — **suspensa na POC** (tudo grátis)
- **Entrega:** preview rodando na plataforma + código completo (monorepo, Docker Compose, README-DEPLOY.md, relatório de testes)

## Princípios não negociáveis (do briefing)
- Acessibilidade como requisito: contraste AA, foco visível, navegação por teclado, alt text, `prefers-reduced-motion`
- NUNCA inventar alíquota/teto/prazo — todo número sai da pesquisa regulatória validada
- Nomenclaturas oficiais exatas (órgãos, documentos, sistemas: SISEN, Sefaz-SP, Detran-SP etc.)
- Pré-análise NUNCA obrigatória (isca de topo de funil)
- Site nunca pede senha do Gov.br (afirmar no FAQ)
- FAQ obrigatório: "guias/taxas precisam estar PAGAS antes do envio" + "não pedimos senha do Gov.br"
- Disclaimer jurídico no rodapé de todas as páginas
- Constantes regulatórias centralizadas em `contracts/constants.ts` (+ REFERRAL_REWARD)
- Sem mocks no caminho crítico; Zod em todo input tRPC; FK bigint unsigned; queries só via Drizzle
- WhatsApp como CTA humano em todo o site
- index.html com snippet de unregister de service workers legados

## Stack
- Frontend: React 19 + TypeScript + Vite 7 + Tailwind 3.4 + shadcn/ui; BrowserRouter; landing com Framer Motion/GSAP/Lenis
- Backend: Hono + tRPC 11 + Drizzle ORM + MySQL 8 (monorepo: `api/`, `contracts/`, `db/`)
- Auth: e-mail + senha, bcrypt, JWT em cookie httpOnly, rate limit no login; sem OAuth
- Docker Compose (app + mysql + caddy) + Dockerfile.prebuilt (build fora do container)
- E-mails: Resend via REST fetch (sem SDK); vazio = no-op com log
- Área logada `/app` em modo claro via tokens CSS + escopo `.app-light`; público dark

---

## Estágio 0 — Pesquisa regulatória nacional (deep-research-swarm, Rota B ampliada)
**Subagentes:** 13 agentes paralelos de deep dive + verificação cruzada:
- IPI federal (Lei 8.989/1995, IN RFB 1.769/2017, Lei 13.146/2015, SISEN, condutor vs não condutor, carência entre benefícios, venda antecipada/devolução proporcional, falecimento, laudo pericial federal, alíquotas por combustível/adaptação)
- ICMS nacional: Convênio ICMS 38/2012 + marco comum + padrões de teto; depois blocos de UFs: SP; Sul (PR/RS/SC); Sudeste (MG/RJ/ES); Centro-Oeste (GO/MT/MS/DF); Nordeste 1 (BA/PE/CE/MA); Nordeste 2 (PB/RN/AL/SE/PI); Norte (PA/AM/RO/AC/RR/AP/TO)
- IPVA por UF nos mesmos blocos (lei, requisitos, 1 veículo/CPF, prazo pós-NF-e, obrigações anuais, gatilhos de perda)
- Laudo pericial por UF (quem emite — Detran/IML/credenciados, custo, validade, guia) + CNH especial com restrições/adaptações
- Rodízio municipal (capitais com rodízio — SP e outras) e benefícios extras
- Jurisprudência (STF/STJ — tetos estaduais, alcance das isenções) + nomenclaturas oficiais exatas de sistemas/guias/órgãos por UF
**Saída:** dossiê regulatório nacional com fontes oficiais (cada número com URL de fonte .gov/legislação) → `contracts/constants.ts` com **matriz por UF** + conteúdo do Guia por estado.
**Gate:** números sem fonte oficial = falha → refazer. Toda UF da matriz precisa de status explícito (mesmo que "sem isenção de IPVA" ou "consultar órgão").

## Estágio 1 — Design system
Identidade "cartilha quente": tinta verde-profunda + papel + âmbar solar. Fraunces (display) + Atkinson Hyperlegible (corpo) + IBM Plex Mono (números). Dark público / `.app-light` logado. Tokens CSS + acessibilidade AA + reduced-motion.

## Estágio 2 — Scaffold do monorepo
Vite + React + shadcn + Tailwind + BrowserRouter + route stubs + assets gerados por IA (hero, jornada, carros genéricos, depoimentos) + SVGs autorais (logo, texturas).

## Estágio 3 — Backend core
Auth custom (bcrypt+JWT+rate limit) · 12 routers tRPC · 10 tabelas (users, vehicles, leads, profiles, processes, process_stages, documents LONGBLOB, events, email_reminders dedup, partners) · e-mails Resend (boas-vindas, docs, pagamento, cadastro, etapas, lembretes) · scheduler diário · guarda de pagamento · regras de dependência ICMS←IPI.

## Estágio 4 — Páginas públicas (paralelo)
Landing 11 seções · Guia 9 capítulos + mapa 27 UFs · Simulador com cálculo real · Quiz Typeform · Institucionais.

## Estágio 5 — Área do cliente /app (modo claro)
Dashboard (anel, timeline, feed, countdowns, indique) · Documentos (trilha guiada + OCR Mistral + status) · Cadastro (multi-etapas, CEP, máscaras) · Conta · **Meu mapa** (plano da UF + confirmação de leitura).

## Estágio 6 — Admin /admin
KPIs+funil · CRM leads (CSV com Indicação) · kanban por etapa · revisão lado a lado com atalhos · pagamentos · lojas parceiras · histórico.

## Estágio 7 — Integração, QA e build
`tsc -b` limpo · build verde · testes vitest · E2E curl por ambiente · seeds.

## Estágio 8 — Entrega e deploys
Vultr (standalone) → San Jose (Caddy central + mTLS) → **São Paulo (definitiva, infra-apps)** → k1 Eveo (túnel Cloudflare, backup R2) · ambientes prod/homolog/dev/pocinhos · README-DEPLOY.md · RELATORIO-TESTES.md.

## Regras de orquestração
- Subagentes paralelos só em tarefas independentes; gates binários entre estágios
- Commits atômicos por feature; type-check + build verdes antes de commit
- Toda saída de estágio propagada explicitamente ao próximo
