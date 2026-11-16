
import { useState } from 'react'
import {
  Users,
  CalendarDays,
  UserPlus,
  Repeat2,
  Upload,
  FileSpreadsheet,
  ScanLine,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  History,
  BellRing,
  X,
} from 'lucide-react'

const stats = [
  {
    title: 'Permanent Contacts',
    value: '2,450',
    note: 'Unique registered IDs',
    icon: Users,
    color: 'blue',
  },
  {
    title: 'Events This Year',
    value: '12',
    note: 'Events in 2026',
    icon: CalendarDays,
    color: 'green',
  },
  {
    title: 'Returning Contacts',
    value: '680',
    note: 'Previously registered',
    icon: Repeat2,
    color: 'amber',
  },
  {
    title: 'New Registrations',
    value: '320',
    note: 'First-time contacts',
    icon: UserPlus,
    color: 'purple',
  },
]

const events = [
  {
    name: 'Annual Conference',
    date: '02 Nov 2026',
    location: 'Lahore',
    registered: 450,
  },
  {
    name: 'Community Gathering',
    date: '05 Nov 2026',
    location: 'Karachi',
    registered: 280,
  },
  {
    name: 'Business Convention',
    date: '08 Nov 2026',
    location: 'Islamabad',
    registered: 320,
  },
]

const imports = [
  {
    file: 'Annual_Event_2026.xlsx',
    date: '30 Oct 2026',
    total: 450,
    newContacts: 320,
    duplicates: 130,
    status: 'Completed',
  },
  {
    file: 'Event_Registration.csv',
    date: '28 Oct 2026',
    total: 200,
    newContacts: 150,
    duplicates: 50,
    status: 'Completed',
  },
]

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
}

function StatCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-3">
            {item.value}
          </h2>
        </div>

        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorClasses[item.color]}`}>
          <Icon size={23} />
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        {item.note}
      </p>

    </div>
  )
}

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [year, setYear] = useState('2026')

  return (
    <div className="space-y-7">

      {/* Page Heading */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Manage permanent contacts and yearly event registrations.
          </p>
        </div>

        <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer">
          <Upload size={18} />
          Import Contacts
          <input
            type="file"
            accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </label>

      </div>

      {/* Selected File Preview */}

      {selectedFile && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileSpreadsheet className="text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                File selected — backend import not connected yet
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedFile(null)} aria-label="Remove file">
            <X size={19} />
          </button>
        </div>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </div>

      {/* Import Section */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Contact Import Center
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Import existing records or add scanned registration pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <FileSpreadsheet size={25} />
            </div>

            <h3 className="font-bold text-slate-900 mt-4">
              Excel / CSV Import
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Upload contact sheets containing ID, Name, Location and Phone Number.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {['.xlsx', '.xls', '.csv'].map((type) => (
                <span key={type} className="bg-slate-100 text-slate-600 rounded-md px-2 py-1 text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ScanLine size={25} />
            </div>

            <h3 className="font-bold text-slate-900 mt-4">
              Scanned Documents
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Import scanned registration pages in mixed languages for data extraction.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {['PDF', 'JPG', 'PNG'].map((type) => (
                <span key={type} className="bg-slate-100 text-slate-600 rounded-md px-2 py-1 text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Duplicate Detection */}

      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={23} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Duplicate Detection
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                Existing contact IDs will be matched before saving new records.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div>
              <p className="text-xl font-bold text-amber-700">130</p>
              <p className="text-xs text-slate-500">Existing IDs</p>
            </div>

            <div>
              <p className="text-xl font-bold text-green-700">320</p>
              <p className="text-xs text-slate-500">New IDs</p>
            </div>
          </div>

        </div>

        <p className="text-xs text-amber-800 mt-4">
          Sample figures only. Actual duplicate checking will be implemented in the backend.
        </p>

      </section>

      {/* Yearly Attendance */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Yearly Attendance
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review yearly event participation.
            </p>
          </div>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-blue-700">Total Registrations</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-2">
              {year === '2026' ? '1,000' : year === '2025' ? '850' : '620'}
            </h3>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-green-700">Returning Contacts</p>
            <h3 className="text-2xl font-bold text-green-900 mt-2">
              {year === '2026' ? '680' : year === '2025' ? '510' : '340'}
            </h3>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm text-purple-700">First-time Contacts</p>
            <h3 className="text-2xl font-bold text-purple-900 mt-2">
              {year === '2026' ? '320' : year === '2025' ? '340' : '280'}
            </h3>
          </div>

        </div>

      </section>

      {/* Upcoming Events */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Upcoming Events
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Scheduled events and registrations.
            </p>
          </div>
          <CalendarDays className="text-blue-600" />
        </div>

        <div className="space-y-3">

          {events.map((event) => (
            <div
              key={event.name}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
            >

              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {event.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {event.date} · {event.location}
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold text-slate-600">
                {event.registered} registrations
              </span>

            </div>
          ))}

        </div>

      </section>

      {/* Import History */}

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">

        <div className="p-5 flex items-center gap-3">
          <History className="text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Import History
            </h2>
            <p className="text-sm text-slate-500">
              Previously uploaded contact files.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">

            <thead className="bg-slate-50 border-y border-slate-100">
              <tr>
                {['File Name', 'Date', 'Total Rows', 'New Contacts', 'Existing IDs', 'Status'].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {imports.map((item) => (
                <tr key={item.file} className="border-b border-slate-100">

                  <td className="px-5 py-4 text-sm font-medium text-slate-800">
                    {item.file}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.date}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.total}
                  </td>

                  <td className="px-5 py-4 text-sm text-green-700 font-semibold">
                    {item.newContacts}
                  </td>

                  <td className="px-5 py-4 text-sm text-amber-700 font-semibold">
                    {item.duplicates}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={13} />
                      {item.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>

      <div className="pb-4 text-center text-xs text-slate-400">
        EventConnect · Permanent Contact & Event Management
      </div>

    </div>
  )
}

export default Dashboard
