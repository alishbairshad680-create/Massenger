
import { useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  CalendarDays,
  FileSpreadsheet,
  ShieldCheck,
  Save,
  RotateCcw,
  Mail,
  MessageCircle,
  Smartphone,
  Lock,
  CheckCircle2,
} from "lucide-react";

function Settings() {
  const initialSettings = {
    systemName: "EventConnect",
    organization: "EventConnect Organization",
    email: "admin@eventconnect.com",
    phone: "03001234567",

    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    eventReminders: true,

    defaultEventStatus: "Upcoming",
    allowRegistrations: true,
    registrationLimit: "500",

    duplicateHandling: "review",
    requireImportConfirmation: true,
    autoDetectColumns: true,

    sessionTimeout: "30",
    strongPasswords: true,
    loginAlerts: true,
  };

  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Frontend demo: settings remain in React state only.
    setSaved(true);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to their default values?")) {
      setSettings(initialSettings);
      setSaved(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">

      {/* PAGE HEADER */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-medium text-blue-600">
            Settings
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SettingsIcon size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              System Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure your EventConnect workspace and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <SettingsIcon
          size={21}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="text-sm font-bold text-blue-900">
            Workspace Configuration
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Manage general information, notifications, event preferences,
            import options and security settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* GENERAL SETTINGS */}
        <SettingsSection
          icon={<Building2 size={21} />}
          title="General Settings"
          description="Manage your organization and system information."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <InputField
              label="System Name"
              value={settings.systemName}
              onChange={(value) => updateSetting("systemName", value)}
            />

            <InputField
              label="Organization Name"
              value={settings.organization}
              onChange={(value) => updateSetting("organization", value)}
            />

            <InputField
              label="Contact Email"
              type="email"
              value={settings.email}
              onChange={(value) => updateSetting("email", value)}
            />

            <InputField
              label="Contact Phone"
              value={settings.phone}
              onChange={(value) => updateSetting("phone", value)}
            />

          </div>
        </SettingsSection>

        {/* NOTIFICATION SETTINGS */}
        <SettingsSection
          icon={<Bell size={21} />}
          title="Notification Settings"
          description="Choose how you want to manage notifications and reminders."
        >
          <div className="divide-y divide-slate-100">

            <ToggleRow
              icon={<Mail size={19} />}
              title="Email Notifications"
              description="Receive system updates through email."
              checked={settings.emailNotifications}
              onChange={(value) =>
                updateSetting("emailNotifications", value)
              }
            />

            <ToggleRow
              icon={<Smartphone size={19} />}
              title="SMS Notifications"
              description="Send event notifications through SMS."
              checked={settings.smsNotifications}
              onChange={(value) =>
                updateSetting("smsNotifications", value)
              }
            />

            <ToggleRow
              icon={<MessageCircle size={19} />}
              title="WhatsApp Notifications"
              description="Send reminders through WhatsApp."
              checked={settings.whatsappNotifications}
              onChange={(value) =>
                updateSetting("whatsappNotifications", value)
              }
            />

            <ToggleRow
              icon={<CalendarDays size={19} />}
              title="Event Reminders"
              description="Enable reminders before upcoming events."
              checked={settings.eventReminders}
              onChange={(value) =>
                updateSetting("eventReminders", value)
              }
            />

          </div>
        </SettingsSection>

        {/* EVENT SETTINGS */}
        <SettingsSection
          icon={<CalendarDays size={21} />}
          title="Event Settings"
          description="Configure default event and registration preferences."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <SelectField
              label="Default Event Status"
              value={settings.defaultEventStatus}
              onChange={(value) =>
                updateSetting("defaultEventStatus", value)
              }
              options={[
                { label: "Upcoming", value: "Upcoming" },
                { label: "Draft", value: "Draft" },
                { label: "Completed", value: "Completed" },
              ]}
            />

            <InputField
              label="Default Registration Limit"
              type="number"
              value={settings.registrationLimit}
              onChange={(value) =>
                updateSetting("registrationLimit", value)
              }
            />

          </div>

          <div className="mt-4">
            <ToggleRow
              icon={<UserIcon />}
              title="Allow Event Registrations"
              description="Allow participants to be registered for events."
              checked={settings.allowRegistrations}
              onChange={(value) =>
                updateSetting("allowRegistrations", value)
              }
            />
          </div>
        </SettingsSection>

        {/* IMPORT SETTINGS */}
        <SettingsSection
          icon={<FileSpreadsheet size={21} />}
          title="Import Settings"
          description="Configure Excel, CSV and scanned document import behavior."
        >
          <div className="space-y-5">

            <SelectField
              label="Duplicate Contact Handling"
              value={settings.duplicateHandling}
              onChange={(value) =>
                updateSetting("duplicateHandling", value)
              }
              options={[
                { label: "Send for Review", value: "review" },
                { label: "Skip Duplicate Records", value: "skip" },
                { label: "Flag as Duplicate", value: "flag" },
              ]}
            />

            <ToggleRow
              icon={<CheckCircle2 size={19} />}
              title="Require Import Confirmation"
              description="Review extracted records before confirming an import."
              checked={settings.requireImportConfirmation}
              onChange={(value) =>
                updateSetting("requireImportConfirmation", value)
              }
            />

            <ToggleRow
              icon={<FileSpreadsheet size={19} />}
              title="Automatic Column Detection"
              description="Allow the system to suggest matching Excel columns."
              checked={settings.autoDetectColumns}
              onChange={(value) =>
                updateSetting("autoDetectColumns", value)
              }
            />

          </div>
        </SettingsSection>

        {/* SECURITY SETTINGS */}
        <SettingsSection
          icon={<ShieldCheck size={21} />}
          title="Security Settings"
          description="Configure account security preferences."
        >
          <div className="space-y-5">

            <SelectField
              label="Session Timeout"
              value={settings.sessionTimeout}
              onChange={(value) =>
                updateSetting("sessionTimeout", value)
              }
              options={[
                { label: "15 Minutes", value: "15" },
                { label: "30 Minutes", value: "30" },
                { label: "1 Hour", value: "60" },
                { label: "2 Hours", value: "120" },
              ]}
            />

            <ToggleRow
              icon={<Lock size={19} />}
              title="Strong Password Policy"
              description="Require stronger passwords for user accounts."
              checked={settings.strongPasswords}
              onChange={(value) =>
                updateSetting("strongPasswords", value)
              }
            />

            <ToggleRow
              icon={<Bell size={19} />}
              title="Login Alerts"
              description="Enable alerts for account login activity."
              checked={settings.loginAlerts}
              onChange={(value) =>
                updateSetting("loginAlerts", value)
              }
            />

          </div>
        </SettingsSection>

        {/* SAVE ACTIONS */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-semibold text-slate-800">
              Save Configuration
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Review your preferences before saving.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Save size={17} />
              Save Changes
            </button>

          </div>
        </div>

        {/* SAVE FEEDBACK */}
        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={19} />
            Settings updated in this frontend session.
          </div>
        )}

      </form>

      <p className="text-center text-xs text-slate-400">
        EventConnect · System Settings · v1.0
      </p>

    </div>
  );
}


// SECTION CONTAINER
function SettingsSection({ icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-start gap-3 border-b border-slate-100 p-5">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}


// INPUT FIELD
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}


// SELECT FIELD
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}


// TOGGLE ROW
function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">

      <div className="flex min-w-0 items-start gap-3">

        <span className="mt-1 shrink-0 text-slate-400">
          {icon}
        </span>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

function UserIcon() {
  return <ShieldCheck size={19} />;
}

export default Settings;
