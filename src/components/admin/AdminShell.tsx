import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import {
  LayoutDashboard,
  Users,
  Columns3,
  FileSearch,
  CreditCard,
  History,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { WHATSAPP_URL, LEGAL_DISCLAIMER } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users, end: false },
  { to: '/admin/processos', label: 'Processos', icon: Columns3, end: false },
  { to: '/admin/revisao', label: 'Revisão de documentos', icon: FileSearch, end: false },
  { to: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard, end: false },
  { to: '/admin/historico', label: 'Histórico', icon: History, end: false },
] as const

type AdminShellProps = { children?: ReactNode }

/**
 * Shell do /admin (modo claro, ferramenta de trabalho).
 * Layout-route com <Outlet/>: App.tsx aninha as rotas filhas.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Fecha drawer ao navegar e com Escape; focus trap simples
  useEffect(() => {
    if (!drawerOpen) return
    const drawer = drawerRef.current
    if (!drawer) return
    const focusables = drawer.querySelectorAll<HTMLElement>('a, button')
    focusables[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
      if (e.key === 'Tab') {
        const list = Array.from(focusables)
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div className="app-light min-h-[100dvh] bg-bg text-txt">
      <a
        href="#conteudo-admin"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-btn focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-on-accent"
      >
        Pular para o conteúdo
      </a>

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-ink-900 lg:flex">
        <SidebarBrand />
        <nav aria-label="Navegação do admin" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[44px] items-center gap-3 rounded-btn px-3 text-small font-medium transition-colors',
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-paper-400 hover:bg-ink-800 hover:text-paper-50',
                    )
                  }
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <SidebarFooter user={user?.name} onLogout={() => void logout()} />
      </aside>

      {/* Coluna principal */}
      <div className="flex min-h-[100dvh] flex-col lg:pl-[248px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur-[8px] sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="admin-drawer"
            aria-label="Abrir menu do admin"
            className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-line text-txt lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <p className="truncate text-small text-txt-2">
            Logado como <strong className="font-bold text-txt">{user?.name ?? '…'}</strong>
          </p>
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-line px-3 text-small font-medium text-txt-2 transition-colors hover:border-accent hover:text-txt"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Ver site
          </Link>
        </header>

        <main id="conteudo-admin" className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div
          id="admin-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu do admin"
          onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}
          className="fixed inset-0 z-[70] flex flex-col bg-ink-950/98 lg:hidden"
        >
          <div className="flex h-[64px] items-center justify-between border-b border-ink-700 px-4">
            <p className="font-display text-h3 font-semibold text-paper-50">IsentaPCD</p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-ink-700 text-paper-50"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Navegação do admin" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="flex flex-col gap-1" onClick={() => setDrawerOpen(false)}>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[48px] items-center gap-3 rounded-btn px-3 text-body font-medium transition-colors',
                        isActive ? 'bg-accent/15 text-accent' : 'text-paper-400 hover:text-paper-50',
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

function SidebarBrand() {
  return (
    <div className="border-b border-ink-700 px-5 py-5">
      <p className="font-display text-h3 font-semibold text-paper-50">IsentaPCD</p>
      <p className="mt-0.5 text-small text-paper-400">Painel interno</p>
      <img
        src="/assinatura-grupo.png"
        alt="Uma empresa do grupo começa.ai"
        width={1575}
        height={291}
        className="mt-3 h-[32px] w-auto rounded-md"
      />
    </div>
  )
}

function SidebarFooter({ user, onLogout }: { user?: string; onLogout: () => void }) {
  return (
    <div className="border-t border-ink-700 px-5 py-4">
      <p className="truncate text-small text-paper-400">{user}</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-2 text-small font-medium text-paper-400 underline underline-offset-4 hover:text-paper-50"
      >
        Sair
      </button>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-paper-400/80">{LEGAL_DISCLAIMER}</p>
    </div>
  )
}
