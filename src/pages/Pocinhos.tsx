import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Bus,
  Car,
  HandHeart,
  Landmark,
  MapPin,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react'
import { trpc } from '@/providers/trpc'
import TrustBadge from '@/components/TrustBadge'
import { WHATSAPP_URL } from '@/lib/constants'

const fade = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.06 },
})

export default function Pocinhos() {
  const lojas = trpc.partners.list.useQuery({ uf: 'PB' })
  const emPocinhos = (lojas.data ?? []).filter((l) => l.cidade.toLowerCase().includes('poçinhos'))

  return (
    <main id="conteudo" className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-20">
      {/* Hero com brasão */}
      <motion.header {...fade(0)} className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div className="max-w-[62ch]">
          <p className="font-mono text-mono uppercase tracking-widest text-accent">Poçinhos · Paraíba</p>
          <h1 className="mt-3 font-display text-h1 font-medium text-txt">
            IsentaPCD em Poçinhos: direitos, economia e lojas que acolhem.
          </h1>
          <p className="mt-4 text-lead text-txt-2">
            Página oficial da nossa parceria com a cidade: o que a família PCD/autista de Poçinhos tem de direito
            (município, Paraíba e União) e onde comprar seminovo com benefício.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/pre-analise"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-btn bg-accent px-6 font-bold text-on-accent transition-all hover:bg-accent-hover"
            >
              Fazer pré-análise grátis
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-btn bg-whatsapp-dark px-6 font-bold text-white transition-colors hover:brightness-110"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <figure className="flex flex-col items-center gap-2 rounded-card border border-line bg-[#F7F3EA] p-6 shadow-card-light">
          <img
            src="/brasao-pocinhos.png"
            alt="Brasão oficial do município de Poçinhos (PB), fundado em 10 de dezembro de 1953"
            width={520}
            height={347}
            className="h-44 w-auto"
          />
          <figcaption className="font-mono text-mono text-[#44554D]">
            Brasão oficial · Prefeitura Municipal de Poçinhos
          </figcaption>
        </figure>
      </motion.header>

      {/* A cidade em números (IBGE) */}
      <motion.section {...fade(1)} aria-labelledby="poc-num" className="mt-14">
        <h2 id="poc-num" className="text-h2 font-medium text-txt">Poçinhos em números</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['População estimada (2025)', '18.038', 'pocinhenses'],
            ['PIB per capita (2021)', 'R$ 15.102', 'por ano'],
            ['PIB total', 'R$ 284,6 mi', 'por ano'],
            ['Fundação', '10/12/1953', 'Cariri Paraibano · RM de Esperança'],
          ].map(([t, v, s]) => (
            <div key={t} className="rounded-card border border-line bg-surface p-5">
              <dt className="text-small text-txt-2">{t}</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold text-accent">{v}</dd>
              <dd className="mt-1 text-small text-txt-2">{s}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-small text-txt-2">
          Fontes: IBGE Cidades (oficial) e levantamento Caravela 2025. Empregos formais: 561 — comércio varejista,
          construção de rodovias e produtos minerais não-metálicos puxam a economia.
        </p>
      </motion.section>

      {/* Direitos em Poçinhos */}
      <motion.section {...fade(2)} aria-labelledby="poc-direitos" className="mt-14">
        <h2 id="poc-direitos" className="text-h2 font-medium text-txt">O que você tem de direito em Poçinhos</h2>
        <ul className="mt-5 grid gap-4 lg:grid-cols-2">
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="flex items-center gap-2 text-h3 font-medium text-txt">
              <Car className="h-5 w-5 text-accent" aria-hidden="true" /> IPVA zero até no seminovo
              <TrustBadge level="official" />
            </h3>
            <p className="mt-2 text-small text-txt-2">
              Na Paraíba, carro <strong className="text-txt">usado/seminovo</strong> em nome da pessoa com deficiência
              pode ter IPVA isento: veículo nacional, valor até R$ 120 mil, 1 por beneficiário. Pedido anual até
              31/12 na Sefaz-PB (CAC de Campina Grande atende a região) — a gente guia os 3 passos com você.
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="flex items-center gap-2 text-h3 font-medium text-txt">
              <BadgeCheck className="h-5 w-5 text-accent" aria-hidden="true" /> Carro 0 km com isenção total
              <TrustBadge level="official" />
            </h3>
            <p className="mt-2 text-small text-txt-2">
              Para carro novo: IPI (até R$ 200 mil) + ICMS-PB (total até R$ 70 mil, parcial até R$ 120 mil) +
              IPVA. Faça a pré-análise para ver se você tem direito — 2 minutos, grátis.
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="flex items-center gap-2 text-h3 font-medium text-txt">
              <HandHeart className="h-5 w-5 text-accent" aria-hidden="true" /> Lei Municipal 1.501/2021 (Poçinhos)
              <TrustBadge level="secondary" />
            </h3>
            <p className="mt-2 text-small text-txt-2">
              Atendimento prioritário para pessoas com autismo em estabelecimentos públicos e privados de Poçinhos
              + Carteirinha Municipal do Autista (cadastro na Secretaria de Assistência Social).
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="flex items-center gap-2 text-h3 font-medium text-txt">
              <Bus className="h-5 w-5 text-accent" aria-hidden="true" /> Transporte intermunicipal grátis (PB)
              <TrustBadge level="secondary" />
            </h3>
            <p className="mt-2 text-small text-txt-2">
              Lei estadual 14.466/2026: gratuidade no transporte intermunicipal para pessoas com TEA e acompanhante —
              vale para ir a Campina Grande/João Pessoa fazer perícia e protocolos.
            </p>
          </li>
        </ul>
        <p className="mt-3 flex items-start gap-2 text-small text-txt-2">
          <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Laudo: SUS de Poçinhos (17 estabelecimentos de saúde, 8 SUS) ou junta credenciada do Detran-PB — com CID e
          conclusão funcional, que é o que a Receita/Sefaz exigem.
        </p>
      </motion.section>

      {/* Lojas parceiras em Poçinhos */}
      <motion.section {...fade(3)} aria-labelledby="poc-lojas" className="mt-14">
        <h2 id="poc-lojas" className="text-h2 font-medium text-txt">Lojas parceiras em Poçinhos</h2>
        <div aria-live="polite" className="mt-5">
          {lojas.isLoading && <p className="text-txt-2">Carregando…</p>}
          {lojas.isSuccess && emPocinhos.length === 0 && (
            <div className="rounded-card border border-line bg-surface p-8 text-center">
              <p className="text-body text-txt-2">
                Estamos cadastrando as primeiras lojas de Poçinhos. Tem uma loja e quer entrar?
              </p>
              <Link
                to="/parceiros"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-accent px-5 text-small font-bold text-on-accent"
              >
                Cadastrar minha loja
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {emPocinhos.map((l) => (
              <li key={l.id} className="rounded-card border border-line bg-surface p-6">
                <h3 className="text-h3 font-medium text-txt">{l.loja}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-small text-txt-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> {l.cidade} — {l.uf}
                </p>
                <p className="mt-3 rounded-input border border-line bg-bg-alt/50 px-4 py-3 text-small font-medium text-txt">
                  🎁 {l.beneficio}
                </p>
                <a
                  href={`https://wa.me/55${l.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi a ${l.loja} na página IsentaPCD Poçinhos e quero saber do benefício PCD.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-[#178A43] px-4 text-small font-bold text-white transition-opacity hover:opacity-90"
                >
                  Falar com a loja no WhatsApp
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Economia local + giro */}
      <motion.section {...fade(4)} aria-labelledby="poc-economia" className="mt-14 grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="flex items-center gap-2 text-h3 font-medium text-txt">
            <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" /> Por que isso gira a economia local
          </h2>
          <p className="mt-2 text-small text-txt-2">
            Cada família atendida compra na loja da cidade, faz perícia na região e emplaca no Detran da Paraíba.
            O dinheiro fica em Poçinhos: mais venda para a loja, mais giro para o comércio, mais dignidade para quem
            precisa do carro para cuidar de quem ama.
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="flex items-center gap-2 text-h3 font-medium text-txt">
            <Landmark className="h-5 w-5 text-accent" aria-hidden="true" /> Para a Prefeitura e parceiros
          </h2>
          <p className="mt-2 text-small text-txt-2">
            Secretarias e vereadores: podemos apresentar o painel da cidade (famílias atendidas, economia gerada)
            e formar a rede de lojas certificadas. Fale com a gente no WhatsApp.
          </p>
          <p className="mt-2 flex items-center gap-2 text-small text-txt-2">
            <Users className="h-4 w-4 text-accent" aria-hidden="true" />
            Prefeitura de Poçinhos: Cônego João Coutinho, 01 — Centro · (83) 3384-1244
          </p>
        </div>
      </motion.section>

      <p className="mt-12 max-w-[68ch] rounded-card border border-line bg-surface p-5 text-small text-txt-2">
        <strong className="text-txt">Transparência:</strong> esta é uma página informativa do IsentaPCD (plataforma
        privada). O brasão é símbolo oficial da Prefeitura de Poçinhos, usado apenas para identificar a cidade —
        não somos órgão público nem temos vínculo institucional formal. Quem defere isenções é sempre o órgão público.
      </p>
    </main>
  )
}
