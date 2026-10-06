import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, HandHeart, Store, TrendingUp, Users } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { UF_LIST, type Uf } from '@contracts/constants'

const UF_NAMES: Record<string, string> = {
  AC:'Acre',AL:'Alagoas',AM:'Amazonas',AP:'Amapá',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MG:'Minas Gerais',MS:'Mato Grosso do Sul',MT:'Mato Grosso',PA:'Pará',PB:'Paraíba',PE:'Pernambuco',PI:'Piauí',PR:'Paraná',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RO:'Rondônia',RR:'Roraima',RS:'Rio Grande do Sul',SC:'Santa Catarina',SE:'Sergipe',SP:'São Paulo',TO:'Tocantins',
}

export default function Parceiros() {
  const [form, setForm] = useState({ loja: '', cidade: '', uf: 'PB' as Uf, whatsapp: '', beneficio: '', atendimentoAdaptado: false, lgpdConsent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = trpc.partners.submit.useMutation()

  const set = (k: string, v: string | boolean) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })) }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.lgpdConsent) {
      setErrors((e) => ({ ...e, lgpdConsent: 'É preciso aceitar o uso dos dados (LGPD) para continuar.' }))
      return
    }
    submit.mutate(
      { ...form, whatsapp: form.whatsapp.replace(/\D/g, ''), lgpdConsent: true },
      { onError: (err) => {
          const zod = JSON.parse(err.message?.startsWith('[') ? err.message : '[]') as { path?: string[]; message?: string }[]
          const map: Record<string, string> = {}
          for (const i of zod) if (i.path?.[0]) map[i.path[0]] = i.message ?? 'Verifique este campo'
          setErrors(map)
        } },
    )
  }

  return (
    <main id="conteudo" className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-[68ch]">
        <p className="font-mono text-mono uppercase tracking-widest text-accent">Rede de Lojas Parceiras</p>
        <h1 className="mt-3 font-display text-h1 font-medium text-txt">Sua loja na frente das famílias PCD.</h1>
        <p className="mt-4 text-lead text-txt-2">
          Milhares de famílias de pessoas com deficiência e autismo buscam carro com confiança todo mês.
          Cadastre sua loja de seminovos, ofereça um benefício real e receba clientes qualificados — de graça durante a POC.
        </p>
      </motion.header>

      {/* Vantagens */}
      <section aria-label="Vantagens para a loja" className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { Icon: TrendingUp, t: 'Mais giro', d: 'Leads qualificados de famílias que já sabem o que querem e têm o benefício mapeado.' },
          { Icon: Users, t: 'Público fiel', d: 'Famílias PCD compram com indicação e voltam — e indicam outras famílias.' },
          { Icon: HandHeart, t: 'Selo de confiança', d: 'Sua loja aparece como parceira PCD no guia mais acessível do Brasil.' },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="rounded-card border border-line bg-surface p-6">
            <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
            <h2 className="mt-3 text-h3 font-medium text-txt">{t}</h2>
            <p className="mt-1 text-small text-txt-2">{d}</p>
          </div>
        ))}
      </section>

      {/* Formulário */}
      <section aria-label="Cadastro de loja parceira" className="mt-12 max-w-[640px]">
        {submit.isSuccess ? (
          <div role="status" className="rounded-card border border-success/40 bg-success/10 p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
            <h2 className="mt-4 text-h2 font-medium text-txt">Cadastro recebido!</h2>
            <p className="mt-2 text-body text-txt-2">
              Nossa equipe revisa e aprova sua loja em até 2 dias úteis. Você aparece na vitrine assim que aprovada.
            </p>
            <Link to="/" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-accent px-5 font-bold text-on-accent">
              Voltar ao início <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 lg:p-8" noValidate>
            <h2 className="text-h2 font-medium text-txt">Cadastrar minha loja</h2>

            {([
              ['loja', 'Nome da loja *', 'Ex.: AutoShow Seminovos'],
              ['cidade', 'Cidade *', 'Ex.: Poçinhos'],
              ['whatsapp', 'WhatsApp da loja *', 'Ex.: (83) 99999-0000'],
            ] as const).map(([key, label, ph]) => (
              <div key={key}>
                <label htmlFor={`p-${key}`} className="mb-1 block text-small font-bold text-txt">{label}</label>
                <input
                  id={`p-${key}`}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={ph}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `p-${key}-err` : undefined}
                  className="min-h-[52px] w-full rounded-input border border-line bg-bg px-4 text-body text-txt outline-none focus:border-accent"
                />
                {errors[key] && <p id={`p-${key}-err`} role="alert" className="mt-1 text-small font-medium text-danger">{errors[key]}</p>}
              </div>
            ))}

            <div>
              <label htmlFor="p-uf" className="mb-1 block text-small font-bold text-txt">Estado (UF) *</label>
              <select
                id="p-uf"
                value={form.uf}
                onChange={(e) => set('uf', e.target.value as Uf)}
                className="min-h-[52px] w-full rounded-input border border-line bg-bg px-4 text-body text-txt outline-none focus:border-accent"
              >
                {UF_LIST.map((u) => <option key={u} value={u}>{u} — {UF_NAMES[u]}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="p-beneficio" className="mb-1 block text-small font-bold text-txt">
                Benefício que sua loja oferece à família PCD *
              </label>
              <p className="mb-1 text-small text-txt-2">Ex.: "R$ 1.500 de desconto à vista", "avaliação justa do usado na troca", "entrega em casa".</p>
              <input
                id="p-beneficio"
                value={form.beneficio}
                onChange={(e) => set('beneficio', e.target.value)}
                aria-invalid={Boolean(errors.beneficio)}
                aria-describedby={errors.beneficio ? 'p-beneficio-err' : undefined}
                className="min-h-[52px] w-full rounded-input border border-line bg-bg px-4 text-body text-txt outline-none focus:border-accent"
              />
              {errors.beneficio && <p id="p-beneficio-err" role="alert" className="mt-1 text-small font-medium text-danger">{errors.beneficio}</p>}
            </div>

            <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.atendimentoAdaptado}
                onChange={(e) => set('atendimentoAdaptado', e.target.checked)}
                className="mt-1 h-5 w-5 accent-amber-400"
              />
              <span className="text-small text-txt">Minha loja tem atendimento adaptado para pessoas com deficiência/autismo (sem pressa, sem ruído excessivo, com paciência)</span>
            </label>

            <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.lgpdConsent}
                onChange={(e) => set('lgpdConsent', e.target.checked)}
                className="mt-1 h-5 w-5 accent-amber-400"
                aria-invalid={Boolean(errors.lgpdConsent)}
              />
              <span className="text-small text-txt">
                Autorizo o IsentaPCD a exibir os dados da loja na vitrine pública e a me contatar pelo WhatsApp informado (LGPD) *
              </span>
            </label>
            {errors.lgpdConsent && <p role="alert" className="text-small font-medium text-danger">{errors.lgpdConsent}</p>}

            <button
              type="submit"
              disabled={submit.isPending}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-btn bg-accent px-6 text-body font-bold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              <Store className="h-5 w-5" aria-hidden="true" />
              {submit.isPending ? 'Enviando…' : 'Cadastrar loja parceira'}
            </button>
            <p className="text-small text-txt-2">
              Sem custo durante a prova de conceito. Aprovação manual pela nossa equipe — lojas sérias apenas.
            </p>
          </form>
        )}
      </section>
    </main>
  )
}
