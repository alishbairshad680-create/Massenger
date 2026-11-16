
import { useState } from 'react'

import {
  Users,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Phone,
  MapPin,
  CalendarDays,
  UserPlus,
  Clock,
  AlertCircle,
  History,
} from 'lucide-react'

// Sample Contact Data
export const initialContacts = [
  {
    id: '1001',
    name: 'Ahmed Ali',
    address: 'House 25, Model Town, Lahore',
    phone: '03001234567',
    firstRegistered: '2024',
    events: [
      { name: 'Annual Conference', year: '2024', status: 'Attended' },
      { name: 'Business Convention', year: '2025', status: 'Attended' },
      { name: 'Annual Conference', year: '2026', status: 'Registered' },
    ],
  },
  {
    id: '1002',
    name: 'Sara Khan',
    address: 'Block 5, Gulshan-e-Iqbal, Karachi',
    phone: '03211234567',
    firstRegistered: '2025',
    events: [
      { name: 'Annual Conference', year: '2025', status: 'Attended' },
      { name: 'Community Gathering', year: '2026', status: 'Attended' },
    ],
  },
  {
    id: '1003',
    name: 'Usman Malik',
    address: 'F-10 Markaz, Islamabad',
    phone: '03331234567',
    firstRegistered: '2026',
    events: [
      { name: 'Business Convention', year: '2026', status: 'Registered' },
    ],
  },
  {
    id: '1004',
    name: 'Ayesha Ahmed',
    address: 'Johar Town, Lahore',
    phone: '03004567890',
    firstRegistered: '2024',
    events: [
      { name: 'Annual Conference', year: '2024', status: 'Attended' },
      { name: 'Annual Conference', year: '2025', status: 'Attended' },
    ],
  },
  {
    id: '1005',
    name: 'Hassan Raza',
    address: 'Cantt Area, Multan',
    phone: '03123456789',
    firstRegistered: '2026',
    events: [
      { name: 'Community Gathering', year: '2026', status: 'Registered' },
    ],
  },
]

function Contacts({ contacts, setContacts }) {
  const currentYear = new Date().getFullYear().toString()

  const [search, setSearch] = useState('')
  const [address, setAddress] = useState('All Addresses')
  const [year, setYear] = useState('All Years')

  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [editingContact, setEditingContact] = useState(null)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    phone: '',
  })

  // Search and Filter
  const filteredContacts = contacts.filter((contact) => {
    const query = search.toLowerCase()

    const matchesSearch =
      contact.id.toLowerCase().includes(query) ||
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.address.toLowerCase().includes(query)

    const matchesAddress =
      address === 'All Addresses' || contact.address === address

    const matchesYear =
      year === 'All Years' || contact.firstRegistered === year

    return matchesSearch && matchesAddress && matchesYear
  })

  // Address Options
  const addresses = [
    ...new Set(contacts.map((contact) => contact.address)),
  ]

  // Year Options
  const years = [
    ...new Set(contacts.map((contact) => contact.firstRegistered)),
  ].sort((a, b) => Number(b) - Number(a))

  // Statistics
  const totalReturning = contacts.filter(
    (contact) => contact.events.length > 1
  ).length

  const totalNew = contacts.filter(
    (contact) => contact.firstRegistered === currentYear
  ).length

  // Reset Form
  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      address: '',
      phone: '',
    })

    setEditingContact(null)
    setShowModal(false)
    setMessage('')
  }

  // Add / Edit Contact
  const handleSubmit = (e) => {
    e.preventDefault()

    const id = form.id.trim()
    const name = form.name.trim()
    const fullAddress = form.address.trim()
    const phone = form.phone.trim()

    if (!id || !name || !fullAddress || !phone) {
      setMessage('Please fill in all fields.')
      return
    }

    // Duplicate ID Detection
    const duplicate = contacts.find(
      (contact) =>
        contact.id.toLowerCase() === id.toLowerCase() &&
        contact.id !== editingContact?.id
    )

    if (duplicate) {
      setMessage(
        `ID ${id} already exists. This contact is already registered.`
      )
      return
    }

    if (editingContact) {
      setContacts((previous) =>
        previous.map((contact) =>
          contact.id === editingContact.id
            ? {
                ...contact,
                name,
                address: fullAddress,
                phone,
              }
            : contact
        )
      )
    } else {
      const newContact = {
        id,
        name,
        address: fullAddress,
        phone,
        firstRegistered: currentYear,
        events: [],
      }

      setContacts((previous) => [newContact, ...previous])
    }

    resetForm()
  }

  // Edit Contact
  const handleEdit = (contact) => {
    setEditingContact(contact)

    setForm({
      id: contact.id,
      name: contact.name,
      address: contact.address,
      phone: contact.phone,
    })

    setSelectedContact(null)
    setShowModal(true)
  }

  // Delete Contact
  const handleDelete = (contact) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${contact.name}?`
    )

    if (confirmed) {
      setContacts((previous) =>
        previous.filter((item) => item.id !== contact.id)
      )

      setSelectedContact(null)
    }
  }

  // Clear Filters
  const clearFilters = () => {
    setSearch('')
    setAddress('All Addresses')
    setYear('All Years')
  }

  return (
    <div className="space-y-6">

      {/* Page Heading */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Contact Management
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Manage permanent contacts and their event history.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition"
        >
          <Plus size={19} />
          Add New Contact
        </button>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Total Contacts */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-slate-500">
                Total Contacts
              </p>

              <h2 className="text-3xl font-bold mt-2 text-slate-900">
                {contacts.length.toLocaleString()}
              </h2>
            </div>

            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>

          </div>
        </div>

        {/* Returning Contacts */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-slate-500">
                Returning Contacts
              </p>

              <h2 className="text-3xl font-bold mt-2 text-slate-900">
                {totalReturning.toLocaleString()}
              </h2>
            </div>

            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <History size={24} />
            </div>

          </div>
        </div>

        {/* New Contacts */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-slate-500">
                New Contacts
              </p>

              <h2 className="text-3xl font-bold mt-2 text-slate-900">
                {totalNew.toLocaleString()}
              </h2>
            </div>

            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>

          </div>
        </div>

      </div>

      {/* Search and Filters */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, phone or address..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />

          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Address Filter */}

            <div className="relative">

              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full sm:w-52 pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
              >
                <option>All Addresses</option>

                {addresses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* Year Filter */}

            <div className="relative">

              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full sm:w-36 pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-blue-500"
              >
                <option>All Years</option>

                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">

          <p className="text-xs text-slate-500">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </p>

          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>

        </div>

      </div>

      {/* Contacts Table */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">

          <h2 className="font-bold text-slate-900">
            All Permanent Contacts
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Each contact has a unique permanent ID.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left">

            <thead className="bg-slate-50">

              <tr>
                {[
                  'Contact ID',
                  'Name',
                  'Full Address',
                  'Phone Number',
                  'First Registered',
                  'Events',
                  'Actions',
                ].map((heading) => (

                  <th
                    key={heading}
                    className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold"
                  >
                    {heading}
                  </th>

                ))}
              </tr>

            </thead>

            <tbody>

              {filteredContacts.map((contact) => (

                <tr
                  key={contact.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >

                  {/* Contact ID */}

                  <td className="px-5 py-4">
                    <span className="font-semibold text-blue-600 text-sm">
                      #{contact.id}
                    </span>
                  </td>

                  {/* Name */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="h-9 w-9 shrink-0 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {contact.name}
                      </span>

                    </div>

                  </td>

                  {/* Address */}

                  <td className="px-5 py-4 text-sm text-slate-600 max-w-xs">
                    <span className="line-clamp-2">
                      {contact.address}
                    </span>
                  </td>

                  {/* Phone */}

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.phone}
                  </td>

                  {/* Registration Year */}

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.firstRegistered}
                  </td>

                  {/* Events */}

                  <td className="px-5 py-4">

                    <span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
                      {contact.events.length} events
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => setSelectedContact(contact)}
                        title="View Details"
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => handleEdit(contact)}
                        title="Edit Contact"
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(contact)}
                        title="Delete Contact"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {/* Empty State */}

              {filteredContacts.length === 0 && (

                <tr>
                  <td colSpan="7" className="text-center py-14">

                    <Users
                      size={35}
                      className="mx-auto text-slate-300"
                    />

                    <p className="font-semibold text-slate-600 mt-3">
                      No contacts found
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredContacts.length} contact records
        </div>

      </div>

      {/* Add / Edit Contact Modal */}

      {showModal && (

        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-5 border-b border-slate-100">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Enter permanent contact information.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* Contact Form */}

            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Error Message */}

              {message && (

                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">

                  <AlertCircle size={18} className="shrink-0 mt-0.5" />

                  {message}

                </div>

              )}

              {/* Contact ID */}

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Contact ID *
                </label>

                <input
                  required
                  value={form.id}
                  onChange={(e) =>
                    setForm({ ...form, id: e.target.value })
                  }
                  placeholder="Enter unique ID"
                  disabled={!!editingContact}
                  className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                />

              </div>

              {/* Full Name */}

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Full Name *
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* Full Address */}

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Full Address *
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Enter complete residential address"
                  className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                />

              </div>

              {/* Phone Number */}

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Phone Number *
                </label>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="03XXXXXXXXX"
                  className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* Form Buttons */}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  {editingContact ? 'Save Changes' : 'Save Contact'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Contact Details Modal */}

      {selectedContact && (

        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Details Header */}

            <div className="flex justify-between items-center p-5 border-b border-slate-100">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Contact Details
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Permanent contact profile
                </p>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-5">

              {/* Profile */}

              <div className="flex items-center gap-4 mb-6">

                <div className="h-16 w-16 shrink-0 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
                  {selectedContact.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedContact.name}
                  </h3>

                  <p className="text-sm text-blue-600 font-semibold">
                    ID: #{selectedContact.id}
                  </p>
                </div>

              </div>

              {/* Contact Information */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Full Address */}

                <div className="bg-slate-50 p-4 rounded-xl sm:col-span-2">

                  <p className="text-xs text-slate-500">
                    Full Address
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-2 flex items-start gap-2 break-words">
                    <MapPin size={16} className="shrink-0 mt-0.5" />
                    {selectedContact.address}
                  </p>

                </div>

                {/* Phone */}

                <div className="bg-slate-50 p-4 rounded-xl">

                  <p className="text-xs text-slate-500">
                    Phone Number
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-2 flex items-center gap-2">
                    <Phone size={16} />
                    {selectedContact.phone}
                  </p>

                </div>

                {/* Registration Year */}

                <div className="bg-slate-50 p-4 rounded-xl">

                  <p className="text-xs text-slate-500">
                    First Registered
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-2 flex items-center gap-2">
                    <Clock size={16} />
                    {selectedContact.firstRegistered}
                  </p>

                </div>

                {/* Total Events */}

                <div className="bg-slate-50 p-4 rounded-xl sm:col-span-2">

                  <p className="text-xs text-slate-500">
                    Total Events
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-2 flex items-center gap-2">
                    <CalendarDays size={16} />
                    {selectedContact.events.length}
                  </p>

                </div>

              </div>

              {/* Attendance History */}

              <div className="mt-7">

                <h3 className="font-bold text-slate-900 flex items-center gap-2">

                  <History size={19} className="text-blue-600" />

                  Yearly Attendance History

                </h3>

                <div className="mt-4 space-y-3">

                  {selectedContact.events.length > 0 ? (

                    selectedContact.events.map((event, index) => (

                      <div
                        key={`${event.year}-${event.name}-${index}`}
                        className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-4"
                      >

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {event.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {event.year}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${
                            event.status === 'Attended'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {event.status}
                        </span>

                      </div>

                    ))

                  ) : (

                    <p className="text-sm text-slate-400 text-center py-6">
                      No event history available.
                    </p>

                  )}

                </div>

              </div>

              {/* Details Actions */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  onClick={() => handleEdit(selectedContact)}
                  className="flex-1 flex justify-center items-center gap-2 border border-slate-200 rounded-xl py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  <Pencil size={16} />
                  Edit Contact
                </button>

                <button
                  onClick={() => handleDelete(selectedContact)}
                  className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-600 rounded-xl py-3 text-sm font-semibold hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete Contact
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Contacts
