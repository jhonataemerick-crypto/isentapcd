import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, RotateCcw, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Estado = 'idle' | 'tocando' | 'pausado'

/**
 * Sistema de leitura em voz alta ("para quem não sabe ler ou tem dificuldade").
 * Botão flutuante no canto inferior ESQUERDO (o WhatsApp fica à direita).
 * Lê o conteúdo principal da página em pt-BR, em pedaços (sentenças) para não
 * travar em textos longos, com controle de velocidade.
 */
export default function ReadAloud({ selector = 'main' }: { selector?: string }) {
  const [estado, setEstado] = useState<Estado>('idle')
  const [rate, setRate] = useState(1)
  const chunksRef = useRef<string[]>([])
  const idxRef = useRef(0)
  const suportado = typeof window !== 'undefined' && 'speechSynthesis' in window

  const pararTudo = useCallback(() => {
    if (!suportado) return
    window.speechSynthesis.cancel()
    setEstado('idle')
  }, [suportado])

  useEffect(() => () => pararTudo(), [pararTudo])

  function escolherVoz() {
    const vozes = window.speechSynthesis.getVoices()
    return (
      vozes.find((v) => v.lang === 'pt-BR' && v.localService) ??
      vozes.find((v) => v.lang === 'pt-BR') ??
      vozes.find((v) => v.lang.startsWith('pt')) ??
      null
    )
  }

  function prepararTexto(): string[] {
    const alvo = document.querySelector(selector) ?? document.body
    const texto = (alvo as HTMLElement).innerText.replace(/\s+/g, ' ').trim()
    // quebra em sentenças para evitar o corte de áudio em textos longos
    return texto.match(/[^.!?…\n]+[.!?…]?/g)?.map((s) => s.trim()).filter(Boolean) ?? [texto]
  }

  function falarProximo() {
    const chunks = chunksRef.current
    if (idxRef.current >= chunks.length) {
      setEstado('idle')
      return
    }
    const utter = new SpeechSynthesisUtterance(chunks[idxRef.current])
    utter.lang = 'pt-BR'
    utter.rate = rate
    const voz = escolherVoz()
    if (voz) utter.voice = voz
    utter.onend = () => {
      idxRef.current += 1
      falarProximo()
    }
    utter.onerror = () => setEstado('idle')
    window.speechSynthesis.speak(utter)
  }

  function alternar() {
    if (estado === 'tocando') {
      window.speechSynthesis.pause()
      setEstado('pausado')
      return
    }
    if (estado === 'pausado') {
      window.speechSynthesis.resume()
      setEstado('tocando')
      return
    }
    chunksRef.current = prepararTexto()
    idxRef.current = 0
    window.speechSynthesis.cancel()
    falarProximo()
    setEstado('tocando')
  }

  function recomeçar() {
    window.speechSynthesis.cancel()
    idxRef.current = 0
    falarProximo()
    setEstado('tocando')
  }

  if (!suportado) return null

  return (
    <div
      className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2"
      role="region"
      aria-label="Leitura em voz alta da página"
    >
      {estado !== 'idle' && (
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 shadow-lg">
          <button
            type="button"
            onClick={recomeçar}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2 text-small font-medium text-txt-2 hover:text-txt"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Recomeçar
          </button>
          <label className="flex items-center gap-2 text-small font-medium text-txt-2">
            Velocidade
            <select
              value={rate}
              onChange={(e) => {
                const r = Number(e.target.value)
                setRate(r)
                // aplica na hora: recomeça o pedaço atual com a nova velocidade
                window.speechSynthesis.cancel()
                idxRef.current = Math.max(0, idxRef.current)
                setTimeout(() => {
                  chunksRef.current.length && falarProximo()
                }, 60)
                setEstado('tocando')
              }}
              className="min-h-[44px] rounded-input border border-line bg-bg px-2 text-txt"
              aria-label="Velocidade de leitura"
            >
              <option value={0.8}>Devagar</option>
              <option value={1}>Normal</option>
              <option value={1.25}>Rápido</option>
            </select>
          </label>
        </div>
      )}
      <button
        type="button"
        onClick={alternar}
        aria-pressed={estado !== 'idle'}
        aria-label={estado === 'idle' ? 'Ouvir esta página em voz alta' : estado === 'tocando' ? 'Pausar leitura' : 'Continuar leitura'}
        className={cn(
          'inline-flex min-h-[52px] items-center gap-2 rounded-full border px-5 font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98]',
          estado === 'idle'
            ? 'border-line bg-surface text-txt hover:border-accent'
            : 'border-accent bg-accent text-on-accent',
        )}
      >
        {estado === 'tocando' ? (
          <Pause className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Volume2 className="h-5 w-5" aria-hidden="true" />
        )}
        {estado === 'idle' ? 'Ouvir esta página' : estado === 'tocando' ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  )
}
