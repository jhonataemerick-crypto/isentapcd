# Histórico do IsentaPCD — produto, deploys e migrações

> Documento vivo. Atualizar a cada mudança relevante de produto ou infraestrutura.

## Linha do tempo

### 2026-08-15 — Nascimento (sandbox Kimi)
- Pesquisa regulatória nacional com enxame de 13 agentes (~250 buscas, fontes oficiais): matriz das 27 UFs de ICMS/IPVA, regras federais (IN RFB 1.769/2017, Lei 8.989/95, Convênio ICMS 38/2012 + 147/2023 + 021/2026), jurisprudência STF/STJ.
- Correção importante do briefing original: o Decreto 9.134/2017 **não** regula o benefício (é acordo Brasil-Itália); o processo correto é IN RFB 1.769/2017 via SISEN.
- Countdown regulatório descoberto: regime vigente expira em **31/12/2026** (Lei 8.989/95 + Convênio 38/2012) sem prorrogação até a data; regime 2027+ = IBS/CBS (LC 214/2025 + LC 227/2026).
- Produto construído: React 19 + Vite 7 + Tailwind + shadcn/ui; Hono + tRPC 11 + Drizzle + MySQL; auth própria e-mail+senha (bcrypt + JWT httpOnly); sem OAuth.
- Módulos: landing, guia educativo (27 UFs), simulador real, quiz Typeform, /app (dashboard, trilha de documentos, cadastro, conta), /admin (KPIs, CRM, kanban, revisão), e-mails transacionais, scheduler de lembretes.
- Decisões de produto: marca **IsentaPCD**; execução R$ 497 (depois suspensa na POC); indicação "quem indica ganha R$ 100"; paywall por flag (`PAYWALL_ENABLED`).

### 2026-08-15 — Produção 1: VM Vultr `108.61.192.14` (Ubuntu 26.04)
- Primeiro deploy público: Docker Compose standalone (app + mysql:8 + caddy) em `/opt/isentapcd`.
- **Contornado o bug histórico do npm** ("Exit handler never called!") com o fluxo *prebuilt*: build fora do container, imagem runtime-only (`Dockerfile.prebuilt`).
- HTTPS com Let's Encrypt via Caddy (nuvem cinza no Cloudflare).
- OCR Mistral validado em produção (laudo teste → texto extraído → validado → e-mail).
- E-mails Resend ativados (boas-vindas, documentos, cadastro, etapas).
- Auditoria mobile ("para a mãe") com screenshots reais; correções: shell duplicado, banner, ilustração do quiz.
- Fix anti-arrasto: pré-análise vinculada à conta (quiz logado + backfill por WhatsApp).
- Página "Meu mapa" + clareza de etapas (objetivo / papéis / termina quando).

### 2026-09-03 — Produção 2: host compartilhado `209.50.63.223` (San Jose, US)
- Migração para o host multi-tenant do grupo: integração ao **Caddy central** existente (sites em `/srv/infra/caddy/sites/`, redes `edge_*` por app).
- TLS no padrão da casa: **Cloudflare Origin CA + Authenticated Origin Pulls (mTLS)**; nuvem laranja.
- Banco migrado via `mysqldump | gzip` (usuários, leads, documentos preservados).
- Virada de DNS **sem downtime**: o host assumiu o tráfego ao virar o DNS (comprovado por usuário-marcador de teste caindo no banco novo).

### 2026-09-11/12 — Produção 3 (definitiva): VM São Paulo `216.238.117.75`
- Instalação seguindo `ORIENTACOES-INFRA.md` + `infra-apps/README.md` da nova infra:
  - Docker + proxy central (`infra-proxy-caddy`, ACME automático) + rede `infra-edge`.
  - App em `infra-apps/apps/isentapcd-prod/` a partir do template oficial (compose validado, limites de CPU/RAM, healthcheck, logs com rotação, cap_drop, no-new-privileges).
  - Imagem fixa por commit: `isentapcd:2e4e9e0` (build fora do container).
  - MySQL 8.0 na rede `private`, sem porta pública, volume próprio.
  - `CADASTRO.md` preenchido (pendências registradas: backup externo, monitoramento).
- Dados ressincronizados a partir de San Jose (dump fresco).
- Cutover com Cloudflare em nuvem cinza (DNS direto) → Caddy emitiu Let's Encrypt automaticamente; marcador de registro provou a origem SP.
- Servidores anteriores mantidos como fallback temporário.

## Regras de operação atuais
- **Fonte da verdade:** GitHub `comeca-ai/isentapcd` (branch `master`, privado desde 2026-09-12).
- **Deploy:** commit → push → build local (npm/ci) → pacote runtime → `docker build` no host → `compose up -d --wait` → validar → registrar aqui.
- **Segredos:** apenas em `.env`/`.env.runtime` nos servidores (permissão 600); nunca no Git.
- **Banco:** migrações Drizzle versionadas em `db/migrations/`; nunca `db:push --force`; nunca dropar tabelas.

## Pendências operacionais registradas
- Backup externo diário (dump criptografado fora do servidor + teste de restauração mensal).
- Monitoramento/alertas de uptime com contato definido.
