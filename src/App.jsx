
import { useState } from 'react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './Pages/Dashboard'
import Contacts, { initialContacts } from './Pages/Contacts'
import Import from './Pages/Import'
import Events, { initialEvents } from './Pages/Events'
import Campaigns from './Pages/Campaigns'
import Messages from './Pages/Messages'
import Analytics from './Pages/Analytics'
import UsersSecurity from './Pages/UsersSecurity'
import Settings from './Pages/Settings'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [contacts, setContacts] = useState(initialContacts)
  const [events, setEvents] = useState(initialEvents)

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="min-w-0 flex-1">

        <Header />

        <main className="p-4 pt-6 sm:p-6 lg:p-8">

          {activePage === 'Dashboard' && <Dashboard />}

          {activePage === 'Contacts' && (
            <Contacts
              contacts={contacts}
              setContacts={setContacts}
            />
          )}

          {activePage === 'Import / Scan' && <Import />}

          {activePage === 'Events' && (
            <Events
              events={events}
              setEvents={setEvents}
              contacts={contacts}
              setContacts={setContacts}
            />
          )}

          {activePage === 'Campaigns' && (
            <Campaigns
              events={events}
              contacts={contacts}
            />
          )}

          {activePage === 'Messages' && <Messages />}

          {activePage === 'Analytics' && (
           <Analytics
            contacts={contacts}
            events={events}
               />
            )}

            {activePage === 'Users & Security' && <UsersSecurity />}

            {activePage === 'Settings' && <Settings />}

            {activePage === 'Dashboard' && <Dashboard />}

        </main>

      </div>

    </div>
  )
}

export default App
