import { GitBranch, Package, Rocket, Server, ShieldCheck, Database } from 'lucide-react'

type Marco = {
  data: string
  titulo: string
  Icon: typeof Server
  itens: string[]
  destaque?: boolean
}

const MARCOS: Marco[] = [
  {
    data: '15/08/2026',
    titulo: 'Nascimento do produto',
    Icon: Package,
    itens: [
      'Pesquisa regulatória nacional (27 UFs) com enxame de 13 agentes — só fontes oficiais',
      'Correção do briefing: Decreto 9.134/2017 não regula o benefício; o correto é IN RFB 1.769/2017 (SISEN)',
      'Countdown regulatório descoberto: regime vigente expira em 31/12/2026',
      'Stack: React 19 + Vite 7 + Hono + tRPC 11 + Drizzle + MySQL; auth própria (bcrypt + JWT), sem OAuth',
      'Módulos: landing, guia 27 UFs, simulador real, quiz, /app completo, /admin, e-mails, lembretes',
    ],
  },
  {
    data: '15/08/2026',
    titulo: 'Produção 1 — VM Vultr 108.61.192.14',
    Icon: Rocket,
    itens: [
      'Docker Compose standalone (app + MySQL 8 + Caddy) em /opt/isentapcd',
      'Bug histórico do npm ("Exit handler never called!") contornado com build fora do container (Dockerfile.prebuilt)',
      "HTTPS Let's Encrypt automático; nuvem cinza no Cloudflare",
      'OCR Mistral validado em produção; e-mails Resend ativados',
      'Auditoria mobile "para a mãe" + correções de responsividade',
      'Fix anti-arrasto: pré-análise vinculada à conta (backfill por WhatsApp)',
      'Página "Meu mapa" + clareza de etapas na timeline',
    ],
  },
  {
    data: '03/09/2026',
    titulo: 'Produção 2 — host compartilhado 209.50.63.223 (San Jose)',
    Icon: ShieldCheck,
    itens: [
      'Integração ao Caddy central multi-tenant do grupo (sites + redes edge_*)',
      'TLS no padrão da casa: Cloudflare Origin CA + Authenticated Origin Pulls (mTLS)',
      'Banco migrado via mysqldump | gzip — usuários, leads e documentos preservados',
      'Virada de DNS sem downtime (provado por usuário-marcador)',
    ],
  },
  {
    data: '11–12/09/2026',
    titulo: 'Produção 3 (definitiva) — VM São Paulo 216.238.117.75',
    Icon: Server,
    destaque: true,
    itens: [
      'Instalação seguindo ORIENTACOES-INFRA.md: proxy central + rede infra-edge + template de app',
      'Imagem fixa por commit (isentapcd:2e4e9e0), MySQL na rede privada sem porta pública',
      "Dados ressincronizados de San Jose; cutover com nuvem cinza → Let's Encrypt emitido automaticamente",
      'Marcador de cutover provou a origem SP; servidores antigos ficaram como fallback',
      'CADASTRO.md preenchido; pendências registradas: backup externo e monitoramento',
    ],
  },
  {
    data: '12/09/2026',
    titulo: 'Repositório',
    Icon: GitBranch,
    itens: [
      'Fonte da verdade: github.com/comeca-ai/isentapcd (branch master)',
      'Histórico auditado: zero segredos commitados; .env sempre fora do Git',
      'Repositório tornado privado nesta data',
    ],
  },
]

export default function Historico() {
  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-medium text-txt">Histórico</h1>
        <p className="max-w-[68ch] text-lead text-txt-2">
          Linha do tempo de produto, deploys e migrações do IsentaPCD. Fonte versionada:{' '}
          <code className="rounded bg-bg-alt px-1.5 py-0.5 font-mono text-mono">HISTORICO.md</code> na raiz do repositório.
        </p>
      </header>

      <ol className="relative flex flex-col gap-8 border-l-2 border-line pl-6" aria-label="Linha do tempo de migrações">
        {MARCOS.map(({ data, titulo, Icon, itens, destaque }) => (
          <li key={titulo} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
            </span>
            <div
              className={
                destaque
                  ? 'rounded-card border-2 border-accent/50 bg-surface p-6 shadow-card-light'
                  : 'rounded-card border border-line bg-surface p-6 shadow-card-light'
              }
            >
              <p className="font-mono text-mono text-txt-2">{data}</p>
              <h2 className="mt-1 text-h3 font-medium text-txt">
                {titulo}
                {destaque && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[0.8125rem] font-medium text-success">
                    <Database className="h-3.5 w-3.5" aria-hidden="true" />
                    produção atual
                  </span>
                )}
              </h2>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-small text-txt-2">
                {itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
