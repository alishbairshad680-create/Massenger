
import { useState } from 'react'
import connectHubLogo from '../assets/connecthub-logo.png'

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileSpreadsheet,
  Send,
  MessageSquare,
  ChartNoAxesCombined,
  ShieldCheck,
  Settings,
  X,
  Menu,
  ChevronRight,
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Contacts', icon: Users },
  { name: 'Events', icon: CalendarDays },
  { name: 'Import / Scan', icon: FileSpreadsheet },
  { name: 'Campaigns', icon: Send },
  { name: 'Messages', icon: MessageSquare },
  { name: 'Analytics', icon: ChartNoAxesCombined },
  { name: 'Users & Security', icon: ShieldCheck },
  { name: 'Settings', icon: Settings },
]

function Sidebar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (name) => {
    setActivePage(name)
    setIsOpen(false)
  }

  const goToDashboard = () => {
    setActivePage('Dashboard')
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="fixed top-4 left-4 z-40 md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-slate-950 text-white shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex h-screen w-64 flex-col
          bg-slate-950 text-white
          border-r border-slate-800
          transition-transform duration-300 ease-in-out
          md:sticky md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ConnectHub Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
  <button
    onClick={goToDashboard}
    title="Go to Dashboard"
    className="w-full flex items-center rounded-lg hover:opacity-90 transition"
  >
    <img
      src={connectHubLogo}
      alt="ConnectHub"
      className="w-full max-w-[220px] h-auto object-contain"
    />
  </button>


          {/* Close Mobile Menu */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.name

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`
                    group flex w-full items-center justify-between
                    rounded-xl px-3 py-3
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-white'
                      }
                    />

                    {item.name}
                  </span>

                  {isActive && <ChevronRight size={16} />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 px-5 py-5">

          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              CH
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                ConnectHub
              </p>

              <p className="text-xs text-slate-500">
                Admin Workspace
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Contact & Event Management · v1.0
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
