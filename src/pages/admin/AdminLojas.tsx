import { useState } from 'react'
import { CheckCircle2, MapPin, Store, XCircle } from 'lucide-react'
import { trpc } from '@/providers/trpc'

type Filtro = 'pending' | 'approved' | 'rejected'

export default function AdminLojas() {
  const [filtro, setFiltro] = useState<Filtro>('pending')
  const utils = trpc.useUtils()
  const lojas = trpc.partners.adminList.useQuery({ status: filtro })
  const review = trpc.partners.review.useMutation({
    onSuccess: () => void utils.partners.adminList.invalidate(),
  })

  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <header>
        <h1 className="text-h1 font-medium text-txt">Lojas parceiras</h1>
        <p className="mt-2 max-w-[68ch] text-lead text-txt-2">
          Aprove lojas de seminovos para a vitrine pública. Lojas aprovadas aparecem em /lojas e no resultado da pré-análise da UF delas.
        </p>
      </header>

      {/* Filtros */}
      <div role="tablist" aria-label="Filtro de status" className="flex gap-2">
        {([
          ['pending', 'Aguardando'],
          ['approved', 'Aprovadas'],
          ['rejected', 'Recusadas'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={filtro === k}
            onClick={() => setFiltro(k)}
            className={`min-h-[44px] rounded-full border px-4 text-small font-bold transition-colors ${
              filtro === k ? 'border-accent bg-accent text-on-accent' : 'border-line bg-surface text-txt-2 hover:text-txt'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <section aria-live="polite">
        {lojas.isLoading && <p className="text-txt-2">Carregando…</p>}
        {lojas.isSuccess && lojas.data.length === 0 && (
          <p className="rounded-card border border-line bg-surface p-8 text-center text-txt-2">
            Nenhuma loja neste status.
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {lojas.data?.map((l) => (
            <li key={l.id} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-body font-bold text-txt">
                  <Store className="h-5 w-5 text-accent" aria-hidden="true" />
                  {l.loja}
                  {l.atendimentoAdaptado && (
                    <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[0.8125rem] font-medium text-success">
                      atendimento adaptado
                    </span>
                  )}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-small text-txt-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {l.cidade} — {l.uf} · WhatsApp {l.whatsapp}
                </p>
                <p className="mt-2 text-small text-txt-2">🎁 {l.beneficio}</p>
                <p className="mt-1 font-mono text-mono text-txt-2">cadastro: {new Date(l.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              {l.status === 'pending' && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => review.mutate({ id: l.id, decision: 'approve' })}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-btn bg-accent px-4 text-small font-bold text-on-accent transition-colors hover:bg-accent-hover"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => review.mutate({ id: l.id, decision: 'reject' })}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-danger/40 px-4 text-small font-bold text-danger transition-colors hover:bg-danger/10"
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    Recusar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
