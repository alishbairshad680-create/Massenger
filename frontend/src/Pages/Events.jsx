
import { useState, useEffect } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  Search,
  Clock,
  X,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Filter,
  UserPlus,
  History,
  Check,
  AlertCircle,
} from "lucide-react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent as deleteEventAPI,
} from "../services/api";

export const initialEvents = [
  {
    id: 1,
    name: "Annual Community Gathering",
    date: "2026-11-15",
    venue: "Expo Centre, Lahore",
    description: "Annual community gathering and networking event.",
    registered: 250,
    participantIds: [],
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Youth Development Program",
    date: "2026-11-25",
    venue: "Alhamra Arts Council, Lahore",
    description: "A development and career guidance program for young people.",
    registered: 120,
    participantIds: [],
    status: "Upcoming",
  },
  {
    id: 3,
    name: "Community Awareness Session",
    date: "2026-10-15",
    venue: "Town Hall, Lahore",
    description: "Community awareness and information session.",
    registered: 85,
    participantIds: [],
    status: "Completed",
  },
];

// Convert MongoDB event into the format used by the frontend
const formatEvent = (event, existingEvent = {}) => {
  const eventDate = String(event.date).slice(0, 10);

  return {
    id: event._id || event.id,
    name: event.name,
    date: eventDate,
    venue: event.location || event.venue || "",
    description: event.description || "",
    registered: existingEvent.registered ?? event.registered ?? 0,
    participantIds: existingEvent.participantIds || [],
    status:
      event.status === "completed"
        ? "Completed"
        : event.status === "cancelled"
        ? "Cancelled"
        : "Upcoming",
  };
};

function Events({ events, setEvents, contacts, setContacts }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [viewEventId, setViewEventId] = useState(null);
  const [registrationEventId, setRegistrationEventId] = useState(null);

  const [contactSearch, setContactSearch] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
    registered: "0",
  });

  // LOAD EVENTS FROM MONGODB
  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getEvents();

        if (!response.success) {
          throw new Error(response.message || "Unable to load events.");
        }

        if (isMounted) {
          setEvents(
            (response.events || []).map((event) => formatEvent(event))
          );
        }
      } catch (error) {
        console.error("Error loading events:", error);

        if (isMounted) {
          setApiError(error.message || "Unable to load events from database.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [setEvents]);

  const viewEvent = events.find(
    (event) => String(event.id) === String(viewEventId)
  );

  const registrationEvent = events.find(
    (event) => String(event.id) === String(registrationEventId)
  );

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      date: "",
      venue: "",
      description: "",
      registered: "0",
    });

    setSelectedEvent(null);
  };

  // OPEN CREATE MODAL
  const openCreateModal = () => {
    resetForm();
    setApiError("");
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (event) => {
    setSelectedEvent(event);

    setForm({
      name: event.name,
      date: event.date,
      venue: event.venue,
      description: event.description,
      registered: String(event.registered || 0),
    });

    setApiError("");
    setShowModal(true);
  };

  // CREATE OR UPDATE EVENT IN MONGODB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.date || !form.venue.trim()) {
      return;
    }

    try {
      setApiError("");

      const today = new Date().toISOString().split("T")[0];

      const eventData = {
        name: form.name.trim(),
        date: form.date,
        location: form.venue.trim(),
        description: form.description.trim(),
        status: form.date < today ? "completed" : "upcoming",
      };

      if (selectedEvent) {
        // UPDATE EXISTING EVENT
        const response = await updateEvent(selectedEvent.id, eventData);

        if (!response.success) {
          throw new Error(response.message || "Failed to update event.");
        }

        const updatedEvent = formatEvent(
          response.event,
          selectedEvent
        );

        setEvents((previous) =>
          previous.map((event) =>
            String(event.id) === String(selectedEvent.id)
              ? updatedEvent
              : event
          )
        );
      } else {
        // CREATE NEW EVENT
        const response = await createEvent(eventData);

        if (!response.success) {
          throw new Error(response.message || "Failed to create event.");
        }

        const newEvent = formatEvent(response.event);

        setEvents((previous) => [newEvent, ...previous]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      setApiError(error.message || "Unable to save event.");
    }
  };

  // DELETE EVENT FROM MONGODB
  const deleteEvent = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this event?")
    ) {
      return;
    }

    try {
      setApiError("");

      const response = await deleteEventAPI(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete event.");
      }

      setEvents((previous) =>
        previous.filter(
          (event) => String(event.id) !== String(id)
        )
      );

      if (String(viewEventId) === String(id)) {
        setViewEventId(null);
      }

      if (String(registrationEventId) === String(id)) {
        setRegistrationEventId(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setApiError(error.message || "Unable to delete event.");
    }
  };

  // SEARCH AND FILTER EVENTS
  const filteredEvents = events.filter((event) => {
    const query = search.toLowerCase();

    const matchesSearch =
      event.name.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query);

    const matchesFilter =
      filter === "All" || event.status === filter;

    return matchesSearch && matchesFilter;
  });

  const upcomingCount = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "Completed"
  ).length;

  const totalRegistrations = events.reduce(
    (sum, event) => sum + (Number(event.registered) || 0),
    0
  );

  const formatDate = (date) => {
    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusStyle = (status) =>
    status === "Upcoming"
      ? "bg-blue-50 text-blue-700"
      : status === "Completed"
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";

  // OPEN PARTICIPANT REGISTRATION
  const openRegistration = (event) => {
    setRegistrationEventId(event.id);
    setSelectedContactIds([]);
    setContactSearch("");
    setRegistrationMessage("");
  };

  // SELECT OR DESELECT CONTACT
  const toggleContact = (contactId) => {
    const alreadyRegistered =
      registrationEvent?.participantIds?.includes(contactId);

    if (alreadyRegistered) return;

    setSelectedContactIds((previous) =>
      previous.includes(contactId)
        ? previous.filter((id) => id !== contactId)
        : [...previous, contactId]
    );
  };

  // REGISTER SELECTED CONTACTS
  // NOTE: This is currently local-only.
  // Database registration support will be added separately.
  const handleRegistration = () => {
    if (!registrationEvent || selectedContactIds.length === 0) {
      setRegistrationMessage("Please select at least one contact.");
      return;
    }

    const currentParticipantIds =
      registrationEvent.participantIds || [];

    const newIds = selectedContactIds.filter(
      (id) => !currentParticipantIds.includes(id)
    );

    if (newIds.length === 0) {
      setRegistrationMessage(
        "These contacts are already registered for this event."
      );
      return;
    }

    const eventYear = registrationEvent.date.slice(0, 4);

    // UPDATE EVENT REGISTRATION LIST LOCALLY
    setEvents((previous) =>
      previous.map((event) =>
        String(event.id) === String(registrationEvent.id)
          ? {
              ...event,
              participantIds: [
                ...(event.participantIds || []),
                ...newIds,
              ],
              registered: (Number(event.registered) || 0) + newIds.length,
            }
          : event
      )
    );

    // UPDATE CONTACT ATTENDANCE HISTORY LOCALLY
    setContacts((previous) =>
      previous.map((contact) => {
        if (!newIds.includes(contact.id)) {
          return contact;
        }

        const history = contact.events || [];

        const alreadyInHistory = history.some(
          (item) => item.eventId === registrationEvent.id
        );

        if (alreadyInHistory) {
          return contact;
        }

        return {
          ...contact,
          events: [
            ...history,
            {
              eventId: registrationEvent.id,
              name: registrationEvent.name,
              year: eventYear,
              status: "Registered",
            },
          ],
        };
      })
    );

    setRegistrationMessage(
      `${newIds.length} contact(s) registered successfully.`
    );

    setSelectedContactIds([]);
  };

  const availableContacts = contacts.filter((contact) => {
    const query = contactSearch.toLowerCase();

    return (
      String(contact.id).toLowerCase().includes(query) ||
      contact.name.toLowerCase().includes(query) ||
      String(contact.phone || "").includes(query)
    );
  });

  const registeredParticipants = viewEvent
    ? contacts.filter((contact) =>
        (viewEvent.participantIds || []).includes(contact.id)
      )
    : [];

  return (
    <div className="space-y-6 pb-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-blue-600">
              Events
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Events Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create events and manage participant registrations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={19} />
          Create New Event
        </button>
      </div>

      {/* API ERROR */}
      {apiError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Events"
          value={events.length}
          icon={<CalendarDays size={22} />}
          color="text-blue-600"
        />

        <StatCard
          title="Upcoming Events"
          value={upcomingCount}
          icon={<Clock size={22} />}
          color="text-blue-600"
        />

        <StatCard
          title="Completed Events"
          value={completedCount}
          icon={<CheckCircle2 size={22} />}
          color="text-green-600"
        />

        <StatCard
          title="Registrations"
          value={totalRegistrations.toLocaleString()}
          icon={<Users size={22} />}
          color="text-purple-600"
        />

      </div>

      {/* EVENT TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              All Events
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View events and manage their participants.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-40"
              >
                <option value="All">All Events</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Event Name</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Venue</th>
                <th className="px-5 py-4">Registrations</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {event.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Event #{event.id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-slate-400" />
                      {formatDate(event.date)}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      {event.venue}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-700">
                    {event.registered}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">

                      <button
                        title="View Details"
                        onClick={() => setViewEventId(event.id)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Register Participants"
                        onClick={() => openRegistration(event)}
                        className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                      >
                        <UserPlus size={17} />
                      </button>

                      <button
                        title="Edit Event"
                        onClick={() => openEditModal(event)}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete Event"
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            Loading events from database...
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="px-5 py-14 text-center">
            <CalendarDays size={35} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No events found
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter event information.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter event name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Event Date *
                </label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Venue / Address *
                </label>
                <input
                  required
                  value={form.venue}
                  onChange={(e) =>
                    setForm({ ...form, venue: e.target.value })
                  }
                  placeholder="Enter event venue"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe this event..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {selectedEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EVENT DETAILS AND PARTICIPANTS */}
      {viewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Event Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {viewEvent.name}
                </p>
              </div>

              <button
                onClick={() => setViewEventId(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Event Date</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {formatDate(viewEvent.date)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Venue</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {viewEvent.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Total Registrations
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    Registered for this event
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {viewEvent.registered}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-bold text-slate-800">
                    <Users size={18} className="text-blue-600" />
                    Registered Contacts
                  </h3>

                  <button
                    onClick={() => openRegistration(viewEvent)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <UserPlus size={15} />
                    Add
                  </button>
                </div>

                {registeredParticipants.length > 0 ? (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {registeredParticipants.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {contact.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Permanent ID: #{contact.id}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Registered
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
                    <Users size={28} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      No linked contacts yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Use Add to register existing contacts.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <History size={17} className="text-blue-600" />
                  Event Description
                </h3>
                <p className="text-sm leading-6 text-slate-500">
                  {viewEvent.description || "No description provided."}
                </p>
              </div>

              <button
                onClick={() => setViewEventId(null)}
                className="w-full rounded-lg bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

      {/* REGISTER PARTICIPANTS MODAL */}
      {registrationEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Register Participants
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {registrationEvent.name}
                </p>
              </div>

              <button
                onClick={() => setRegistrationEventId(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-sm font-semibold text-blue-900">
                  Select existing permanent contacts
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Selecting a contact will create an event attendance entry.
                  It will not create another permanent contact.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search by ID, name or phone..."
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {availableContacts.map((contact) => {
                  const isRegistered =
                    (registrationEvent.participantIds || []).includes(
                      contact.id
                    );

                  const isSelected =
                    selectedContactIds.includes(contact.id);

                  return (
                    <button
                      type="button"
                      key={contact.id}
                      disabled={isRegistered}
                      onClick={() => toggleContact(contact.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                        isRegistered
                          ? "cursor-not-allowed border-green-100 bg-green-50/60"
                          : isSelected
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {contact.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          ID: #{contact.id} · {contact.phone}
                        </p>
                      </div>

                      {isRegistered ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={16} />
                          Registered
                        </span>
                      ) : (
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          <Check size={15} />
                        </span>
                      )}
                    </button>
                  );
                })}

                {availableContacts.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No matching contacts found.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-600">
                  Selected contacts
                </span>
                <span className="font-bold text-blue-600">
                  {selectedContactIds.length}
                </span>
              </div>

              {registrationMessage && (
                <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {registrationMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setRegistrationEventId(null)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRegistration}
                  disabled={selectedContactIds.length === 0}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <UserPlus size={17} />
                  Register Selected
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        EventConnect · Event Management System
      </p>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className={color}>{icon}</span>
      </div>
      <h2 className={`mt-3 text-2xl font-bold ${color}`}>
        {value}
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Event management records
      </p>
    </div>
  );
}

export default Events;
