# IsentaPCD — Documentação Completa do Projeto

> Documento consolidado de tudo que foi construído, decidido e operado.
> Escrito em 06/10/2026. Fonte viva: repositório `comeca-ai/isentapcd` (privado).

A versão completa e atualizada está em `DOCUMENTACAO.md` no repositório principal.

## Resumo executivo

O IsentaPCD é uma plataforma web full-stack que guia pessoas com deficiência (PCD) e famílias na obtenção de isenções de IPI+ICMS+IPVA na compra de carro 0 km, em todo o Brasil (27 UFs).

### Módulos
- Site público (landing, guia 27 UFs, institucionais, roadmap, página Poçinhos)
- Simulador de economia + quiz de elegibilidade (iscas grátis)
- Área do cliente: dashboard, Meu mapa, trilha de documentos com OCR, cadastro, conta
- Admin: KPIs, CRM, kanban, revisão, pagamentos, lojas parceiras, histórico
- Rede de Lojas Parceiras (seminovos PCD)
- Leitura em voz alta em todas as páginas (acessibilidade)

### Infra
- Produção: isentapcd.com.br (SP, infra-apps)
- Homologação: homolog.isentapcd.com.br (SP)
- White label: pocinhos.isentapcd.com.br (SP) + repo separado
- Dev: dev.isentapcd.com.br (k1 Eveo, túnel Cloudflare)
- Backup diário em Cloudflare R2

### Documentação detalhada
Ver `DOCUMENTACAO.md` — cobre pesquisa regulatória, decisões de produto, arquitetura técnica, migrações de infraestrutura, integrações, operação e pendências.
