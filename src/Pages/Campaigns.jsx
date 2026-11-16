
import { useEffect, useState } from "react";
import {
  Send,
  MessageSquare,
  Smartphone,
  Users,
  CalendarDays,
  Plus,
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

import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign as deleteCampaignAPI,
} from "../services/api";

const emptyForm = {
  name: "",
  eventId: "",
  channel: "WhatsApp",
  audience: "all",
  message: "",
  scheduledDate: "",
  scheduledTime: "",
};

function Campaigns({ events = [] }) {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [viewCampaign, setViewCampaign] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Convert MongoDB campaign into frontend format
  const formatCampaign = (item) => {
    const eventName =
      typeof item.eventId === "object"
        ? item.eventId?.name
        : item.eventName;

    const eventId =
      typeof item.eventId === "object"
        ? item.eventId?._id
        : item.eventId;

    return {
      id: item._id,
      name: item.name,
      event: eventName || item.eventName || "Event unavailable",
      eventId: eventId || "",
      channel: item.channel,
      recipients: item.recipients || 0,
      selectedContacts: (item.selectedContacts || []).map(
        (contact) =>
          typeof contact === "object" ? contact._id : contact
      ),
      audience: item.audience || "all",
      status: item.status,
      date:
        item.scheduledDate ||
        (item.createdAt
          ? item.createdAt.substring(0, 10)
          : ""),
      scheduledDate: item.scheduledDate || "",
      scheduledTime: item.scheduledTime || "",
      message: item.message,
    };
  };

  // Load campaigns from MongoDB
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCampaigns();

      setCampaigns(
        (response.campaigns || []).map(formatCampaign)
      );
    } catch (err) {
      setError(err.message || "Could not load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

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
    setSelectedCampaign(null);
    setNotice("");
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

    setNotice("");
    setShowModal(true);
  };

  const selectedEvent = events.find(
    (event) => String(event._id || event.id) === String(form.eventId)
  );

  // Save campaign to MongoDB
  const saveCampaign = async (e, status) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.eventId ||
      !form.message.trim()
    ) {
      setNotice("Please complete the required fields.");
      return;
    }

    if (
      status === "Scheduled" &&
      (!form.scheduledDate || !form.scheduledTime)
    ) {
      setNotice("Please select both schedule date and time.");
      return;
    }

    const campaignData = {
      name: form.name.trim(),
      eventId: form.eventId,
      channel: form.channel,
      audience: form.audience,
      selectedContacts: [],
      message: form.message.trim(),
      status,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
    };

    try {
      setSaving(true);
      setNotice("");

      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, campaignData);
      } else {
        await createCampaign(campaignData);
      }

      await loadCampaigns();

      setShowModal(false);
      setForm(emptyForm);
      setSelectedCampaign(null);
      setNotice("");
    } catch (err) {
      setNotice(err.message || "Could not save campaign.");
    } finally {
      setSaving(false);
    }
  };

  // Delete campaign from MongoDB
  const deleteCampaign = async (id) => {
    if (!window.confirm("Delete this campaign?")) {
      return;
    }

    try {
      await deleteCampaignAPI(id);
      await loadCampaigns();
    } catch (err) {
      setError(err.message || "Could not delete campaign.");
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
    return message.replace(/\{name\}/gi, "Participant");
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
            Create and save campaign drafts for your events.
            Actual attendee selection and SMS/WhatsApp delivery
            will be connected in later development steps.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
                      Campaign #{String(campaign.id).slice(-6)}
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

        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading campaigns...
          </div>
        )}

        {!loading && campaigns.length === 0 && (
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCampaign(e, "Draft");
              }}
              className="space-y-5 p-5"
            >

              {/* CAMPAIGN NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Campaign Name *
                </label>
                <input
                  required
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
                    required
                    value={form.eventId}
                    onChange={(e) =>
                      setForm({ ...form, eventId: e.target.value })
                    }
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Choose an event</option>
                    {events.map((event) => (
                      <option key={event._id || event.id} value={event._id || event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {form.eventId && selectedEvent && (
                  <p className="mt-2 text-xs text-blue-600">
                    Selected event: {selectedEvent.name}
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

              {/* RECIPIENTS */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Users size={21} className="mt-0.5 text-amber-700" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Attendance-based recipients are coming later
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      Campaigns will target people whose attendance has
                      actually been recorded. For now, you can save your
                      campaign without selecting recipients.
                    </p>
                    <p className="mt-2 text-xs font-semibold text-amber-900">
                      Current recipients: 0
                    </p>
                  </div>
                </div>
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
                  required
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
                  disabled={saving}
                  onClick={(e) => saveCampaign(e, "Draft")}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => {
                    if (form.scheduledDate && form.scheduledTime) {
                      saveCampaign(e, "Scheduled");
                    } else if (form.scheduledDate || form.scheduledTime) {
                      setNotice("Please select both schedule date and time.");
                    } else {
                      saveCampaign(e, "Draft");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={17} />
                  {saving ? "Saving..." : "Save Campaign"}
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

