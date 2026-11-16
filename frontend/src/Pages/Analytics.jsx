
import { useMemo, useState } from "react";
import {
  Users,
  CalendarDays,
  Repeat2,
  TrendingUp,
  Info,
  PieChart,
  BarChart3,
  Calendar,
  Activity,
} from "lucide-react";

function Analytics({ contacts = [], events = [] }) {
  const [selectedYear, setSelectedYear] = useState("All");

  // Available years from events and contact attendance history
  const years = useMemo(() => {
    const allYears = [
      ...events.map((event) => String(event.date || "").slice(0, 4)),
      ...contacts.flatMap((contact) =>
        (contact.events || []).map((item) => String(item.year))
      ),
      ...contacts.map((contact) =>
        String(contact.firstRegistered || "")
      ),
    ].filter((year) => /^\d{4}$/.test(year));

    return [...new Set(allYears)].sort((a, b) => b - a);
  }, [contacts, events]);

  // Filter events according to selected year
  const filteredEvents = useMemo(() => {
    if (selectedYear === "All") return events;

    return events.filter(
      (event) => String(event.date || "").slice(0, 4) === selectedYear
    );
  }, [events, selectedYear]);

  // Filter contacts according to selected year
  const filteredContacts = useMemo(() => {
    if (selectedYear === "All") return contacts;

    return contacts.filter((contact) => {
      const registeredYear = String(contact.firstRegistered || "");

      const hasAttendanceInYear = (contact.events || []).some(
        (item) => String(item.year) === selectedYear
      );

      return (
        registeredYear.includes(selectedYear) ||
        hasAttendanceInYear
      );
    });
  }, [contacts, selectedYear]);

  // Contact statistics
  const totalContacts = filteredContacts.length;

  const returningContacts = filteredContacts.filter(
    (contact) => (contact.events || []).length > 1
  ).length;

  const newContacts = totalContacts - returningContacts;

  // Event statistics
  const totalEvents = filteredEvents.length;

  // IMPORTANT:
  // registered represents total registrations for an event.
  // participantIds represents individually linked contacts.
  const totalRegistrations = filteredEvents.reduce(
    (total, event) =>
      total + (Number(event.registered) || 0),
    0
  );

  // Contact distribution percentages
  const newPercentage =
    totalContacts > 0
      ? Math.round((newContacts / totalContacts) * 100)
      : 0;

  const returningPercentage =
    totalContacts > 0
      ? Math.round((returningContacts / totalContacts) * 100)
      : 0;

  // Event participation data
  const eventChartData = filteredEvents.map((event) => ({
    name: event.name,
    count: Number(event.registered) || 0,
  }));

  const maxRegistrations = Math.max(
    ...eventChartData.map((item) => item.count),
    1
  );

  // Monthly registration activity
  const monthlyData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec",
    ];

    return months.map((month, index) => {
      const count = filteredEvents
        .filter((event) => {
          const eventDate = new Date(
            `${event.date}T00:00:00`
          );

          return eventDate.getMonth() === index;
        })
        .reduce(
          (total, event) =>
            total + (Number(event.registered) || 0),
          0
        );

      return { month, count };
    });
  }, [filteredEvents]);

  const maxMonthlyCount = Math.max(
    ...monthlyData.map((item) => item.count),
    1
  );

  const totalMonthlyRegistrations = monthlyData.reduce(
    (total, item) => total + item.count,
    0
  );

  return (
    <div className="space-y-6 pb-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-blue-600">
              Analytics
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Analytics Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze contact growth, event participation and system activity.
          </p>
        </div>

        {/* YEAR FILTER */}
        <div className="flex items-center gap-3">
          <CalendarDays
            size={19}
            className="text-slate-500"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Years</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* INFORMATION BANNER */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

        <Info
          size={21}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="text-sm font-bold text-blue-900">
            Analytics Overview
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Contact and event statistics are calculated from
            current frontend records. Data is temporary and
            will be connected to the database later.
          </p>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Contacts"
          value={totalContacts.toLocaleString()}
          description="Permanent contact records"
          icon={<Users size={23} />}
          color="text-blue-600"
        />

        <StatCard
          title="Total Events"
          value={totalEvents.toLocaleString()}
          description="Created event records"
          icon={<CalendarDays size={23} />}
          color="text-purple-600"
        />

        <StatCard
          title="Returning Contacts"
          value={returningContacts.toLocaleString()}
          description="Contacts with multiple events"
          icon={<Repeat2 size={23} />}
          color="text-green-600"
        />

        <StatCard
          title="Event Registrations"
          value={totalRegistrations.toLocaleString()}
          description="Total event registrations"
          icon={<TrendingUp size={23} />}
          color="text-orange-600"
        />

      </div>

      {/* CONTACT DISTRIBUTION + EVENT PARTICIPATION */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* CONTACT DISTRIBUTION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                Contact Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                New vs returning contacts
              </p>
            </div>

            <PieChart
              size={23}
              className="text-blue-600"
            />
          </div>

          {totalContacts > 0 ? (
            <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-around">

              {/* DONUT CHART */}
              <div
                className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    #2563eb 0% ${newPercentage}%,
                    #16a34a ${newPercentage}% 100%
                  )`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold text-slate-800">
                    {totalContacts}
                  </span>

                  <span className="text-xs text-slate-400">
                    Contacts
                  </span>
                </div>
              </div>

              {/* LEGEND */}
              <div className="w-full space-y-5">

                <DistributionItem
                  color="bg-blue-600"
                  label="New Contacts"
                  value={newContacts}
                  percentage={newPercentage}
                />

                <DistributionItem
                  color="bg-green-600"
                  label="Returning Contacts"
                  value={returningContacts}
                  percentage={returningPercentage}
                />

              </div>
            </div>
          ) : (
            <EmptyState message="No contact records available." />
          )}

        </div>

        {/* EVENT PARTICIPATION */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                Event Participation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Registered contacts per event
              </p>
            </div>

            <BarChart3
              size={23}
              className="text-blue-600"
            />
          </div>

          {eventChartData.length > 0 ? (
            <div className="mt-8 space-y-7">

              {eventChartData.map((item, index) => (
                <div key={`${item.name}-${index}`}>

                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="text-sm text-slate-700">
                      {item.name}
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      {item.count.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${(item.count / maxRegistrations) * 100}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <EmptyState message="No event records available." />
          )}

        </div>

      </div>

      {/* MONTHLY REGISTRATION ACTIVITY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="font-bold text-slate-800">
              Monthly Registration Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Event registrations throughout the year
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Activity size={19} />
            {totalMonthlyRegistrations.toLocaleString()} Registrations
          </div>

        </div>

        {filteredEvents.length > 0 ? (
          <div className="mt-8">

            <div className="flex h-52 items-end justify-between gap-2 border-b border-slate-200 px-1 sm:gap-4">

              {monthlyData.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >

                  <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {item.count > 0 ? item.count : ""}
                  </span>

                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-blue-600 transition-all duration-500"
                      style={{
                        height:
                          item.count > 0
                            ? `${Math.max(
                                (item.count / maxMonthlyCount) * 100,
                                4
                              )}%`
                            : "2px",
                        opacity: item.count > 0 ? 1 : 0.2,
                      }}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    {item.month}
                  </span>

                </div>
              ))}

            </div>

          </div>
        ) : (
          <EmptyState message="No registration activity available." />
        )}

      </div>

      {/* EVENT SUMMARY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />

            <h2 className="font-bold text-slate-800">
              Event Performance Summary
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Registration overview of all events.
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Event Name</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Venue</th>
                  <th className="px-5 py-4">Registrations</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {event.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {new Date(
                        `${event.date}T00:00:00`
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {event.venue}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {(Number(event.registered) || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.status === "Upcoming"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        ) : (
          <EmptyState message="No events found for this year." />
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>

      </div>

      <p className="text-center text-xs text-slate-400">
        EventConnect · Analytics Dashboard
      </p>

    </div>
  );
}


// STATISTICS CARD
function StatCard({ title, value, description, icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <span className={color}>
          {icon}
        </span>
      </div>

      <h2 className={`mt-3 text-2xl font-bold ${color}`}>
        {value}
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}


// CONTACT DISTRIBUTION LEGEND
function DistributionItem({ color, label, value, percentage }) {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-3">
        <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${color}`} />

        <span className="text-sm text-slate-600">
          {label}
        </span>
      </div>

      <span className="whitespace-nowrap text-sm font-bold text-slate-800">
        {value} ({percentage}%)
      </span>

    </div>
  );
}


// EMPTY STATE
function EmptyState({ message }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center">

      <BarChart3
        size={35}
        className="text-slate-300"
      />

      <p className="mt-3 text-sm text-slate-400">
        {message}
      </p>

    </div>
  );
}

export default Analytics;
