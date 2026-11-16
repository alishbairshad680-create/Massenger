
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Eye,
  X,
  Filter,
  CalendarDays,
  Trash2,
  Plus,
} from "lucide-react";

import { getMessages, createMessage, deleteMessage } from "../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    recipient: "",
    phone: "",
    channel: "SMS",
    campaign: "",
    message: "",
  });

  // FORMAT DATABASE MESSAGES
  const formatMessages = (records) => {
    return records.map((item) => ({
      id: item._id,
      recipient: item.recipient || "",
      phone: item.phone || "",
      channel: item.channel || "",
      campaign: item.campaign || item.campaignId?.name || "",
      message: item.message || "",
      status: item.status || "Pending",
      date: item.sentAt || item.createdAt || new Date(),
    }));
  };

  // LOAD MESSAGES FROM MONGODB
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMessages();

      const records = response.messages || [];

      setMessages(formatMessages(records));
    } catch (err) {
      console.error("Error loading messages:", err);
      setError(err.message || "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // HANDLE FORM INPUTS
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // DELETE MESSAGE RECORD
  const handleDeleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message permanently?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteMessage(id);

      setMessages((previous) =>
        previous.filter((message) => message.id !== id)
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError(err.message || "Could not delete message.");
    }
  };


  // SAVE MESSAGE RECORD
  const handleSaveMessage = async (e) => {
    e.preventDefault();

    if (!formData.recipient.trim() || !formData.message.trim()) {
      setError("Recipient and message are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createMessage({
        ...formData,
        status: "Pending",
      });

      await loadMessages();

      setFormData({
        recipient: "",
        phone: "",
        channel: "SMS",
        campaign: "",
        message: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error saving message:", err);
      setError(err.message || "Could not save message.");
    } finally {
      setSaving(false);
    }
  };

  // MESSAGE STATISTICS
  const delivered = messages.filter(
    (message) => message.status === "Delivered"
  ).length;

  const pending = messages.filter(
    (message) => message.status === "Pending"
  ).length;

  const failed = messages.filter(
    (message) => message.status === "Failed"
  ).length;

  // SEARCH AND FILTER
  const filteredMessages = messages.filter((message) => {
    const query = search.toLowerCase();

    const matchesSearch =
      message.recipient.toLowerCase().includes(query) ||
      message.phone.includes(query) ||
      message.campaign.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || message.status === statusFilter;

    const matchesChannel =
      channelFilter === "All" || message.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // STATUS STYLING
  const statusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Pending") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-700";
  };

  const StatusIcon = ({ status }) => {
    if (status === "Delivered") {
      return <CheckCircle2 size={16} />;
    }

    if (status === "Pending") {
      return <Clock size={16} />;
    }

    return <AlertCircle size={16} />;
  };

  // DATE FORMATTING
  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "—";
    }

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 pb-8">

      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-medium text-blue-600">Messages</span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Messages Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor SMS and WhatsApp message records.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowForm(!showForm);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Close Form" : "Add Message"}
          </button>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <MessageSquare
          size={21}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Message Records Center
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
            Message records are stored in the database. Actual SMS and
            WhatsApp sending and live delivery tracking require provider
            integration.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ADD MESSAGE FORM */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Create Message Record
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Save a message record in the database. This will not send
              an actual SMS or WhatsApp message.
            </p>
          </div>

          <form onSubmit={handleSaveMessage} className="space-y-5">

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* RECIPIENT */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Recipient Name *
                </label>

                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="Enter recipient name"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* CHANNEL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Channel *
                </label>

                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              {/* CAMPAIGN */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Campaign Name (Optional)
                </label>

                <input
                  type="text"
                  name="campaign"
                  value={formData.campaign}
                  onChange={handleInputChange}
                  placeholder="Enter campaign name"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Message Content *
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* STATUS */}
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              Status will automatically be saved as Pending.
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Message"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Messages"
          value={messages.length}
          icon={<MessageSquare size={22} />}
          color="text-blue-600"
        />

        <StatCard
          title="Delivered"
          value={delivered}
          icon={<CheckCircle2 size={22} />}
          color="text-green-600"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock size={22} />}
          color="text-amber-600"
        />

        <StatCard
          title="Failed"
          value={failed}
          icon={<AlertCircle size={22} />}
          color="text-red-600"
        />

      </div>

      {/* CHANNEL SUMMARY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <MessageSquare size={24} />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                WhatsApp Messages
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                WhatsApp channel records
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold text-green-600">
            {messages.filter((m) => m.channel === "WhatsApp").length}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Smartphone size={24} />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                SMS Messages
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                SMS channel records
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold text-blue-600">
            {messages.filter((m) => m.channel === "SMS").length}
          </span>
        </div>

      </div>

      {/* MESSAGE TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              All Messages
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and monitor saved message records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipient..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-36"
              >
                <option value="All">All Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* CHANNEL FILTER */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Channels</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
            </select>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Recipient</th>
                <th className="px-5 py-4">Campaign</th>
                <th className="px-5 py-4">Channel</th>
                <th className="px-5 py-4">Message Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-slate-50">

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {message.recipient}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {message.phone || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {message.campaign || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2 text-slate-600">
                      {message.channel === "WhatsApp" ? (
                        <MessageSquare size={17} className="text-green-600" />
                      ) : (
                        <Smartphone size={17} className="text-blue-600" />
                      )}

                      {message.channel}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-slate-400" />

                      <span>
                        {formatDate(message.date)}

                        <span className="mt-1 block text-xs text-slate-400">
                          {formatTime(message.date)}
                        </span>
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(message.status)}`}
                    >
                      <StatusIcon status={message.status} />
                      {message.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      title="View Message Details"
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      title="Delete Message"
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading messages...
          </div>
        )}

        {!loading && filteredMessages.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No messages found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              No saved records match your search or filters.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>

      </div>

      {/* MESSAGE DETAILS MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">

          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Message Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Message #{selectedMessage.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <DetailItem
                  label="Recipient"
                  value={selectedMessage.recipient}
                />

                <DetailItem
                  label="Phone Number"
                  value={selectedMessage.phone || "—"}
                />

                <DetailItem
                  label="Channel"
                  value={selectedMessage.channel}
                />

                <DetailItem
                  label="Campaign"
                  value={selectedMessage.campaign || "—"}
                />

                <DetailItem
                  label="Date"
                  value={formatDate(selectedMessage.date)}
                />

                <DetailItem
                  label="Time"
                  value={formatTime(selectedMessage.date)}
                />

              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Delivery Status
                </p>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${statusStyle(selectedMessage.status)}`}
                >
                  <StatusIcon status={selectedMessage.status} />
                  {selectedMessage.status}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Message Content
                </p>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                Actual SMS and WhatsApp delivery requires a connected
                messaging provider. A Pending record does not mean a
                message has been delivered.
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Close Details
              </button>

            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        EventConnect · Messages Management System
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
        Message management records
      </p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default Messages;
