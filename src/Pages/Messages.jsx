
import { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Eye,
  X,
  Filter,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

const initialMessages = [
  {
    id: 1,
    recipient: "Ahmed Ali",
    phone: "03001234567",
    channel: "WhatsApp",
    campaign: "Annual Gathering Reminder",
    message:
      "Hello Ahmed Ali, you are invited to our Annual Community Gathering.",
    status: "Delivered",
    date: "2026-10-28",
    time: "10:30 AM",
  },
  {
    id: 2,
    recipient: "Sara Khan",
    phone: "03211234567",
    channel: "SMS",
    campaign: "Youth Program Invitation",
    message:
      "Dear Sara Khan, you are invited to our Youth Development Program.",
    status: "Pending",
    date: "2026-10-31",
    time: "02:30 PM",
  },
  {
    id: 3,
    recipient: "Usman Malik",
    phone: "03331234567",
    channel: "WhatsApp",
    campaign: "Community Update",
    message:
      "Hello Usman Malik, here is an important community update.",
    status: "Failed",
    date: "2026-10-27",
    time: "11:15 AM",
  },
  {
    id: 4,
    recipient: "Ayesha Ahmed",
    phone: "03011234567",
    channel: "SMS",
    campaign: "Annual Gathering Reminder",
    message:
      "Hello Ayesha Ahmed, we are excited to invite you to our annual gathering!",
    status: "Delivered",
    date: "2026-10-28",
    time: "10:35 AM",
  },
  {
    id: 5,
    recipient: "Hassan Raza",
    phone: "03121234567",
    channel: "WhatsApp",
    campaign: "Annual Gathering Reminder",
    message:
      "Hello Hassan Raza, you are invited to our Annual Community Gathering.",
    status: "Delivered",
    date: "2026-10-28",
    time: "10:40 AM",
  },
];

function Messages() {
  const [messages] = useState(initialMessages);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const delivered = messages.filter(
    (message) => message.status === "Delivered"
  ).length;

  const pending = messages.filter(
    (message) => message.status === "Pending"
  ).length;

  const failed = messages.filter(
    (message) => message.status === "Failed"
  ).length;

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

  const formatDate = (date) =>
    new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 pb-8">

      {/* HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-medium text-blue-600">Messages</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Messages Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor SMS and WhatsApp message delivery records.
        </p>
      </div>

      {/* INFORMATION */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <MessageSquare
          size={21}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Message Delivery Center
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            Review message records, recipient details and delivery statuses.
            Live delivery tracking will be available after SMS and WhatsApp
            provider integration.
          </p>
        </div>
      </div>

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
              Search and monitor message records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

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
                      {message.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {message.campaign}
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
                          {message.time}
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
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare
              size={32}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No messages found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
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
                  value={selectedMessage.phone}
                />

                <DetailItem
                  label="Channel"
                  value={selectedMessage.channel}
                />

                <DetailItem
                  label="Campaign"
                  value={selectedMessage.campaign}
                />

                <DetailItem
                  label="Date"
                  value={formatDate(selectedMessage.date)}
                />

                <DetailItem
                  label="Time"
                  value={selectedMessage.time}
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
                This is sample message history. Actual delivery status
                requires a connected messaging provider.
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
