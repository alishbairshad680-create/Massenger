
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Search,
  Edit,
  Trash2,
  X,
  Lock,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Admin",
    email: "admin@eventconnect.com",
    phone: "03001234567",
    role: "Admin",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    phone: "03111234567",
    role: "Manager",
    status: "Active",
    joined: "2025-03-10",
  },
  {
    id: 3,
    name: "Sara Khan",
    email: "sara@example.com",
    phone: "03221234567",
    role: "Staff",
    status: "Active",
    joined: "2025-06-20",
  },
  {
    id: 4,
    name: "Usman Malik",
    email: "usman@example.com",
    phone: "03331234567",
    role: "Staff",
    status: "Inactive",
    joined: "2026-01-05",
  },
];

function UsersSecurity() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;
  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const openAddModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.toLowerCase() &&
        user.id !== editingUser?.id
    );

    if (emailExists) {
      alert("This email address is already registered.");
      return;
    }

    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...form }
            : user
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
        joined: new Date().toISOString().slice(0, 10),
      };

      setUsers((previous) => [...previous, newUser]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingUser(null);
  };

  const deleteUser = (id) => {
    const user = users.find((item) => item.id === id);

    if (user?.role === "Admin") {
      alert("Admin accounts cannot be deleted from this demo.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
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
            <span className="font-medium text-blue-600">
              Users & Security
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Users & Security
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage staff accounts, roles and access permissions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Add New User
        </button>

      </div>

      {/* INFO BANNER */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <h3 className="text-sm font-bold text-blue-900">
            Account & Access Management
          </h3>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Manage user accounts and assign roles. Actual authentication
            and permission enforcement will be connected to the backend.
          </p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Users"
          value={totalUsers}
          description="All registered accounts"
          icon={<Users size={23} />}
          color="text-blue-600"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          description="Currently active accounts"
          icon={<UserCheck size={23} />}
          color="text-green-600"
        />

        <StatCard
          title="Administrators"
          value={adminUsers}
          description="Accounts with admin role"
          icon={<ShieldCheck size={23} />}
          color="text-purple-600"
        />

      </div>

      {/* USERS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="font-bold text-slate-800">
              All Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage system users.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>

          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                        {user.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          User #{user.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-slate-700">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {user.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-purple-50 text-purple-700"
                          : user.role === "Manager"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Shield size={13} />
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {new Date(
                      `${user.joined}T00:00:00`
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      disabled={user.role === "Admin"}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      } disabled:cursor-not-allowed`}
                    >
                      {user.status}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        title="Delete User"
                        disabled={user.role === "Admin"}
                        className="text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>

      </div>

      {/* ADD / EDIT USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter user account details.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={21} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >

              <FormField label="Full Name" icon={<Users size={17} />}>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="form-input"
                />
              </FormField>

              <FormField label="Email Address" icon={<Mail size={17} />}>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className="form-input"
                />
              </FormField>

              <FormField label="Phone Number" icon={<Phone size={17} />}>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="03XXXXXXXXX"
                  className="form-input"
                />
              </FormField>

              <FormField label="User Role" icon={<Shield size={17} />}>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="form-input"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </FormField>

              <FormField label="Account Status" icon={<Lock size={17} />}>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="form-input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormField>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        EventConnect · Users & Security
      </p>

    </div>
  );
}


// STATISTICS CARD
function StatCard({ title, value, description, icon, color }) {
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
        {description}
      </p>
    </div>
  );
}


// FORM FIELD
function FormField({ label, icon, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>

      {children}
    </div>
  );
}

export default UsersSecurity;
