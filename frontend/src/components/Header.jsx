
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  CalendarDays,
  X,
} from 'lucide-react'

import { useState } from 'react'

function Header() {
  const [search, setSearch] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200">

      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">

          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
              Dashboard
            </h2>

            <p className="hidden text-xs text-slate-500 sm:block">
              Manage your contacts and events
            </p>
          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="relative hidden w-44 md:block lg:w-64">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Notifications */}
          <div className="relative">

            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:w-80">

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>

                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">

                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm font-medium text-slate-800">
                      Upcoming Event
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      3 events are scheduled this week.
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-sm font-medium text-slate-800">
                      Pending Reviews
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Contact records need review.
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Profile */}
          <div className="relative">

            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                AD
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>
                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-slate-400 sm:block"
              />

            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Admin Account
                  </p>
                  <p className="text-xs text-slate-500">
                    admin@example.com
                  </p>
                </div>

                <button
                  onClick={() => setShowProfile(false)}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                >
                  Close Profile Menu
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden">

        <div className="relative">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts, events..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

    </header>
  )
}

export default Header
