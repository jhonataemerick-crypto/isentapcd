import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, HandHeart, MapPin, Store } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { UF_LIST } from '@contracts/constants'

const UF_NAMES: Record<string, string> = {
  AC:'Acre',AL:'Alagoas',AM:'Amazonas',AP:'Amapá',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MG:'Minas Gerais',MS:'Mato Grosso do Sul',MT:'Mato Grosso',PA:'Pará',PB:'Paraíba',PE:'Pernambuco',PI:'Piauí',PR:'Paraná',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RO:'Rondônia',RR:'Roraima',RS:'Rio Grande do Sul',SC:'Santa Catarina',SE:'Sergipe',SP:'São Paulo',TO:'Tocantins',
}

export default function Lojas() {
  const [params] = useSearchParams()
  const [uf, setUf] = useState(params.get('uf') ?? '')
  const lojas = trpc.partners.list.useQuery(uf ? { uf: uf as never } : undefined)

  const waLink = (whats: string, loja: string) =>
    `https://wa.me/55${whats.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi a ${loja} como loja parceira do IsentaPCD e quero saber do benefício para família PCD.`)}`

  const grupos = useMemo(() => {
    const by: Record<string, typeof lojas.data> = {}
    for (const l of lojas.data ?? []) {
      const k = `${l.uf} — ${UF_NAMES[l.uf] ?? l.uf}`
      ;(by[k] ||= []).push(l)
    }
    return Object.entries(by)
  }, [lojas.data])

  return (
    <main id="conteudo" className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-[68ch]">
        <p className="font-mono text-mono uppercase tracking-widest text-accent">Rede de Lojas Parceiras</p>
        <h1 className="mt-3 font-display text-h1 font-medium text-txt">Lojas de seminovos que tratam sua família bem.</h1>
        <p className="mt-4 text-lead text-txt-2">
          Seminovo não tem desconto de IPI/ICMS (esses são só para carro 0 km), mas o <strong className="text-txt">IPVA pode ser isento todo ano</strong> na maioria dos estados — e estas lojas oferecem um benefício extra para a sua família.
        </p>
      </motion.header>

      {/* Burocracia mínima — pilar de produto */}
      <section aria-label="Burocracia mínima" className="mt-6 flex flex-col gap-3 rounded-card border border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:gap-4">
        <HandHeart className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-small text-txt-2">
          <strong className="text-txt">Burocracia mínima, prometido:</strong> depois da compra, a gente guia o pedido de IPVA isento em 3 passos simples (documento, laudo, protocolo) — e as lojas parceiras já sabem como ajudar. Você nunca fica sozinho com formulário de órgão público.
        </p>
      </section>

      {/* Filtro por UF */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label htmlFor="f-uf" className="text-small font-bold text-txt">Filtrar por estado:</label>
        <select
          id="f-uf"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="min-h-[44px] rounded-input border border-line bg-surface px-4 text-body text-txt outline-none focus:border-accent"
        >
          <option value="">Todos os estados</option>
          {UF_LIST.map((u) => <option key={u} value={u}>{u} — {UF_NAMES[u]}</option>)}
        </select>
      </div>

      {/* Lista */}
      <section aria-label="Lojas parceiras" aria-live="polite" className="mt-8">
        {lojas.isLoading && <p className="text-txt-2">Carregando lojas…</p>}
        {lojas.isSuccess && grupos.length === 0 && (
          <div className="rounded-card border border-line bg-surface p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-txt-2" aria-hidden="true" />
            <h2 className="mt-3 text-h3 font-medium text-txt">Ainda não temos loja parceira aí</h2>
            <p className="mt-2 text-small text-txt-2">
              Estamos começando pela Paraíba e expandindo. Conhece uma loja boa? Indique para ela se cadastrar — ou fale com a gente que a gente acha uma para você.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link to="/parceiros" className="inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-accent px-4 text-small font-bold text-on-accent">
                Sou loja — quero ser parceira <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
        {grupos.map(([grupo, items]) => (
          <div key={grupo} className="mt-10">
            <h2 className="text-h2 font-medium text-txt">{grupo}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {items!.map((l) => (
                <li key={l.id} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-6 transition-colors hover:border-accent/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-h3 font-medium text-txt">{l.loja}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-small text-txt-2">
                        <MapPin className="h-4 w-4" aria-hidden="true" /> {l.cidade} — {l.uf}
                      </p>
                    </div>
                    {l.atendimentoAdaptado && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[0.8125rem] font-medium text-success">
                        <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
                        Atendimento adaptado
                      </span>
                    )}
                  </div>
                  <p className="rounded-input border border-line bg-bg-alt/50 px-4 py-3 text-small font-medium text-txt">
                    🎁 {l.beneficio}
                  </p>
                  <a
                    href={waLink(l.whatsapp, l.loja)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-[#178A43] px-4 text-small font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Falar com a loja no WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <p className="mt-12 max-w-[68ch] rounded-card border border-line bg-surface p-5 text-small text-txt-2">
        <strong className="text-txt">Transparência:</strong> as lojas são parceiras independentes — o IsentaPCD não vende carros nem garante preços. O benefício fiscal do seminovo é a isenção de IPVA (regra de cada estado); descontos de loja são combinados diretamente com ela. Quem defere isenções é sempre o órgão público.
      </p>
    </main>
  )
}
