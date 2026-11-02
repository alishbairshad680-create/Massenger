
import { useState } from "react";
import {
  Send,
  MessageSquare,
  Smartphone,
  Users,
  CalendarDays,
  Plus,
  Search,
  X,
  Eye,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Megaphone,
  Trash2,
} from "lucide-react";

const initialCampaigns = [
  {
    id: 1,
    name: "Annual Gathering Reminder",
    event: "Annual Community Gathering",
    channel: "WhatsApp",
    recipients: 250,
    status: "Sent",
    date: "2026-10-28",
    message: "Hello {name}, we are excited to invite you to our annual gathering!",
  },
  {
    id: 2,
    name: "Youth Program Invitation",
    event: "Youth Development Program",
    channel: "SMS",
    recipients: 120,
    status: "Scheduled",
    date: "2026-11-10",
    message: "Dear {name}, you are invited to our Youth Development Program.",
  },
  {
    id: 3,
    name: "Community Update",
    event: "Community Awareness Session",
    channel: "Both",
    recipients: 85,
    status: "Draft",
    date: "2026-10-20",
    message: "Hello {name}, here is an important community update.",
  },
];

const emptyForm = {
  name: "",
  eventId: "",
  channel: "WhatsApp",
  audience: "all",
  message: "",
  scheduledDate: "",
  scheduledTime: "",
};

function Campaigns({ events = [], contacts = [] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [viewCampaign, setViewCampaign] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedEvent = events.find(
    (event) => String(event.id) === String(form.eventId)
  );

  const eventParticipants = selectedEvent
    ? contacts.filter((contact) =>
        (selectedEvent.participantIds || []).includes(contact.id)
      )
    : [];

  const recipients =
    form.audience === "selected"
      ? eventParticipants.filter((contact) =>
          selectedContacts.includes(contact.id)
        )
      : eventParticipants;

  const filteredContacts = eventParticipants.filter((contact) => {
    const query = contactSearch.toLowerCase();

    return (
      contact.name.toLowerCase().includes(query) ||
      contact.id.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    );
  });

  const sentCount = campaigns.filter(
    (campaign) => campaign.status === "Sent"
  ).length;

  const scheduledCount = campaigns.filter(
    (campaign) => campaign.status === "Scheduled"
  ).length;

  const draftCount = campaigns.filter(
    (campaign) => campaign.status === "Draft"
  ).length;

  const totalRecipients = campaigns.reduce(
    (total, campaign) => total + campaign.recipients,
    0
  );

  const openCreateModal = () => {
    setForm(emptyForm);
    setSelectedContacts([]);
    setSelectedCampaign(null);
    setNotice("");
    setShowContactPicker(false);
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setSelectedCampaign(campaign);

    setForm({
      name: campaign.name,
      eventId: campaign.eventId || "",
      channel: campaign.channel,
      audience: campaign.audience || "all",
      message: campaign.message,
      scheduledDate: campaign.scheduledDate || "",
      scheduledTime: campaign.scheduledTime || "",
    });

    setSelectedContacts(campaign.selectedContacts || []);
    setNotice("");
    setShowModal(true);
  };

  const toggleContact = (id) => {
    setSelectedContacts((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleEventChange = (eventId) => {
    setForm((previous) => ({
      ...previous,
      eventId,
    }));

    setSelectedContacts([]);
    setContactSearch("");
  };

  const saveCampaign = (e, status) => {
    e.preventDefault();

    if (!form.name.trim() || !form.eventId || !form.message.trim()) {
      setNotice("Please complete the required fields.");
      return;
    }

    if (recipients.length === 0) {
      setNotice("Please select at least one registered participant.");
      return;
    }

    if (
      status === "Scheduled" &&
      (!form.scheduledDate || !form.scheduledTime)
    ) {
      setNotice("Please select a schedule date and time.");
      return;
    }

    const campaign = {
      id: selectedCampaign?.id || Date.now(),
      name: form.name.trim(),
      event: selectedEvent.name,
      eventId: form.eventId,
      channel: form.channel,
      recipients: recipients.length,
      selectedContacts: selectedContacts,
      audience: form.audience,
      status,
      date:
        status === "Scheduled"
          ? form.scheduledDate
          : new Date().toISOString().split("T")[0],
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      message: form.message,
    };

    if (selectedCampaign) {
      setCampaigns((previous) =>
        previous.map((item) =>
          item.id === selectedCampaign.id ? campaign : item
        )
      );
    } else {
      setCampaigns((previous) => [campaign, ...previous]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setSelectedCampaign(null);
    setNotice("");
  };

  const deleteCampaign = (id) => {
    if (window.confirm("Delete this campaign?")) {
      setCampaigns((previous) =>
        previous.filter((campaign) => campaign.id !== id)
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusStyle = (status) => {
    if (status === "Sent") return "bg-green-50 text-green-700";
    if (status === "Scheduled") return "bg-blue-50 text-blue-700";
    return "bg-amber-50 text-amber-700";
  };

  const previewMessage = (message) => {
    const firstContact = recipients[0];

    return message.replace(
      /\{name\}/gi,
      firstContact?.name || "Participant"
    );
  };

  return (
    <div className="space-y-6 pb-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-blue-600">Campaigns</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Campaign Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage event-based SMS and WhatsApp campaigns.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={19} />
          Create Campaign
        </button>
      </div>

      {/* NOTICE */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Sparkles size={21} className="mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Smart Event-Based Messaging
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            Select an event and send personalized messages to its registered
            participants. Actual SMS and WhatsApp delivery will be enabled
            after provider integration.
          </p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Campaigns"
          value={campaigns.length}
          icon={<Megaphone size={22} />}
          color="text-blue-600"
        />

        <StatCard
          title="Sent Campaigns"
          value={sentCount}
          icon={<CheckCircle2 size={22} />}
          color="text-green-600"
        />

        <StatCard
          title="Scheduled"
          value={scheduledCount}
          icon={<Clock size={22} />}
          color="text-blue-600"
        />

        <StatCard
          title="Total Recipients"
          value={totalRecipients.toLocaleString()}
          icon={<Users size={22} />}
          color="text-purple-600"
        />

      </div>

      {/* CHANNEL CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <MessageSquare size={25} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">WhatsApp Messaging</h3>
            <p className="mt-1 text-sm text-slate-500">
              Prepare WhatsApp campaign messages.
            </p>
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Provider integration pending
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Smartphone size={25} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">SMS Messaging</h3>
            <p className="mt-1 text-sm text-slate-500">
              Prepare bulk SMS campaigns.
            </p>
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Provider integration pending
            </span>
          </div>
        </div>

      </div>

      {/* CAMPAIGN HISTORY */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-800">
            Campaign History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View previously created campaigns.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Campaign Name</th>
                <th className="px-5 py-4">Event</th>
                <th className="px-5 py-4">Channel</th>
                <th className="px-5 py-4">Recipients</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {campaign.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Campaign #{campaign.id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {campaign.event}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {campaign.channel}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-700">
                    {campaign.recipients}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(campaign.date)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewCampaign(campaign)}
                        title="View"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => openEditModal(campaign)}
                        title="Edit"
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                      >
                        <FileText size={17} />
                      </button>

                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        title="Delete"
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

        {campaigns.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">
            No campaigns created yet.
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          {campaigns.length} campaigns
        </div>
      </div>

      {/* CREATE / EDIT CAMPAIGN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedCampaign ? "Edit Campaign" : "Create Campaign"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure your event-based message.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-5 p-5">

              {/* CAMPAIGN NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Campaign Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Annual Gathering Reminder"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* EVENT */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select Event *
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={form.eventId}
                    onChange={(e) => handleEventChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Choose an event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {form.eventId && (
                  <p className="mt-2 text-xs text-blue-600">
                    {eventParticipants.length} registered contacts available for this event.
                  </p>
                )}
              </div>

              {/* CHANNEL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message Channel *
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {["SMS", "WhatsApp", "Both"].map((channel) => (
                    <button
                      type="button"
                      key={channel}
                      onClick={() => setForm({ ...form, channel })}
                      className={`rounded-lg border px-2 py-3 text-sm font-semibold ${
                        form.channel === channel
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              {/* AUDIENCE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Recipients
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, audience: "all" });
                      setSelectedContacts([]);
                    }}
                    className={`rounded-xl border p-4 text-left ${
                      form.audience === "all"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200"
                    }`}
                  >
                    <Users
                      size={20}
                      className="mb-2 text-blue-600"
                    />
                    <p className="text-sm font-semibold text-slate-800">
                      All Participants
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Message everyone registered for this event.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, audience: "selected" })
                    }
                    className={`rounded-xl border p-4 text-left ${
                      form.audience === "selected"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200"
                    }`}
                  >
                    <UserIcon />
                    <p className="text-sm font-semibold text-slate-800">
                      Selected Contacts
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose specific participants.
                    </p>
                  </button>
                </div>

                {form.audience === "selected" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={!selectedEvent}
                      onClick={() =>
                        setShowContactPicker(!showContactPicker)
                      }
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-sm text-slate-700 disabled:opacity-50"
                    >
                      <span>
                        {selectedContacts.length} contacts selected
                      </span>
                      <ChevronDown size={17} />
                    </button>

                    {showContactPicker && (
                      <div className="mt-2 rounded-xl border border-slate-200 p-3">
                        <div className="relative mb-3">
                          <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            value={contactSearch}
                            onChange={(e) =>
                              setContactSearch(e.target.value)
                            }
                            placeholder="Search participants..."
                            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="max-h-40 space-y-2 overflow-y-auto">
                          {filteredContacts.map((contact) => (
                            <label
                              key={contact.id}
                              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 hover:bg-slate-50"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  {contact.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  #{contact.id} · {contact.phone}
                                </p>
                              </div>

                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={() => toggleContact(contact.id)}
                                className="h-4 w-4 accent-blue-600"
                              />
                            </label>
                          ))}

                          {filteredContacts.length === 0 && (
                            <p className="py-4 text-center text-xs text-slate-400">
                              No participants found. Select an event first.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  Recipients: <strong>{recipients.length}</strong>
                </p>
              </div>

              {/* MESSAGE */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Message Content *
                  </label>
                  <span className="text-xs text-slate-400">
                    Use {"{name}"} for personalization
                  </span>
                </div>

                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Hello {name}, you are invited to..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.message.length} characters
                </p>
              </div>

              {/* PREVIEW */}
              {form.message && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Eye size={15} />
                    MESSAGE PREVIEW
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {previewMessage(form.message)}
                  </p>
                </div>
              )}

              {/* SCHEDULE */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Schedule Campaign (Optional)
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-500">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.scheduledDate}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-500">
                      Time
                    </label>
                    <input
                      type="time"
                      value={form.scheduledTime}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scheduledTime: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* CONSENT */}
              <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                Before sending real campaigns, verify recipient consent and
                provide an opt-out method. This prototype does not send messages.
              </div>

              {notice && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {notice}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => saveCampaign(
                    { preventDefault: () => {} },
                    "Draft"
                  )}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => saveCampaign(
                    { preventDefault: () => {} },
                    form.scheduledDate ? "Scheduled" : "Draft"
                  )}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Send size={17} />
                  Save Campaign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW CAMPAIGN */}
      {viewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-800">
                Campaign Details
              </h2>
              <button
                onClick={() => setViewCampaign(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <h3 className="text-lg font-bold text-slate-800">
                {viewCampaign.name}
              </h3>

              <p className="text-sm text-slate-500">
                Event: {viewCampaign.event}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Channel</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {viewCampaign.channel}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Recipients</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {viewCampaign.recipients}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold text-slate-400">
                  MESSAGE
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {viewCampaign.message}
                </p>
              </div>

              <button
                onClick={() => setViewCampaign(null)}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        EventConnect · Campaign Management System
      </p>
    </div>
  );
}

function UserIcon() {
  return (
    <div className="mb-2 text-blue-600">
      <Users size={20} />
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
        Campaign management records
      </p>
    </div>
  );
}

export default Campaigns;
