
import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileImage,
  FileText,
  ScanLine,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  ArrowRight,
  Users,
  UserPlus,
  RefreshCcw,
  Download,
  ChevronDown,
  Trash2,
  ShieldCheck,
} from "lucide-react";

const initialRows = [
  {
    id: "EC-1001",
    name: "Ali Ahmed",
    address: "Johar Town, Lahore",
    phone: "03001234567",
    status: "Existing",
  },
  {
    id: "EC-1002",
    name: "Sara Khan",
    address: "Model Town, Lahore",
    phone: "03111234567",
    status: "New",
  },
  {
    id: "EC-1003",
    name: "Usman Malik",
    address: "Gulberg, Lahore",
    phone: "03221234567",
    status: "Returning",
  },
  {
    id: "EC-1004",
    name: "Ayesha Noor",
    address: "DHA Phase 5, Lahore",
    phone: "03331234567",
    status: "New",
  },
];

const systemFields = [
  "Permanent ID",
  "Full Name",
  "Full Address",
  "Phone Number",
  "Ignore Column",
];

function Import() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [activeTab, setActiveTab] = useState("excel");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [mapping, setMapping] = useState({
    "Registration ID": "Permanent ID",
    "Name": "Full Name",
    "Address": "Full Address",
    "Contact Number": "Phone Number",
  });

  const [showAllRows, setShowAllRows] = useState(false);

  const handleFile = (selectedFile, type) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileType(type);
    setIsAnalyzed(false);
    setIsConfirmed(false);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzed(true);
    setIsConfirmed(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileType("");
    setIsAnalyzed(false);
    setIsConfirmed(false);
  };

  const updateMapping = (column, value) => {
    setMapping((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const getStatusStyle = (status) => {
    if (status === "Existing") {
      return "bg-amber-50 text-amber-700";
    }
    if (status === "Returning") {
      return "bg-blue-50 text-blue-700";
    }
    return "bg-green-50 text-green-700";
  };

  const displayedRows = showAllRows ? rows : rows.slice(0, 3);

  return (
    <div className="space-y-6 pb-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-blue-600">
              Import / Scan
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            AI Import Center
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload Excel files or scanned documents to import contacts automatically.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Sparkles size={16} />
          AI Powered Import
        </div>
      </div>

      {/* INFORMATION BANNER */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="mt-0.5 text-blue-600">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Smart Contact Recognition
          </h3>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            The system will identify columns, extract contact details and
            check existing permanent IDs before import. Staff can review
            and correct records before confirmation.
          </p>
        </div>
      </div>

      {/* UPLOAD SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Upload Your File
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select the type of document you want to upload.
          </p>
        </div>

        {/* TABS */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("excel")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "excel"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet size={17} />
            Excel / CSV
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "scan"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ScanLine size={17} />
            Scanned Documents
          </button>
        </div>

        {/* UPLOAD AREA */}
        {!file ? (
          <label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
            <input
              type="file"
              accept={
                activeTab === "excel"
                  ? ".xlsx,.xls,.csv"
                  : ".pdf,.jpg,.jpeg,.png"
              }
              className="hidden"
              onChange={(e) =>
                handleFile(
                  e.target.files[0],
                  activeTab
                )
              }
            />

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              {activeTab === "excel" ? (
                <FileSpreadsheet size={30} />
              ) : (
                <FileImage size={30} />
              )}
            </div>

            <h3 className="font-semibold text-slate-800">
              {activeTab === "excel"
                ? "Upload Excel or CSV File"
                : "Upload Scanned Document"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Drag and drop your file here or{" "}
              <span className="font-semibold text-blue-600">
                browse files
              </span>
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {activeTab === "excel"
                ? "Supported formats: XLSX, XLS, CSV"
                : "Supported formats: PDF, JPG, JPEG, PNG"}
            </p>
          </label>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                {fileType === "excel" ? (
                  <FileSpreadsheet size={25} />
                ) : (
                  <FileText size={25} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB · Selected successfully
                </p>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        )}

        {file && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Please verify the file before starting analysis.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzed}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-green-600"
            >
              {isAnalyzed ? (
                <>
                  <CheckCircle2 size={17} />
                  Analysis Complete
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ANALYSIS SECTION */}
      {isAnalyzed && (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Records</p>
                <FileText className="text-blue-600" size={21} />
              </div>
              <h3 className="mt-3 text-2xl font-bold text-slate-800">
                120
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Sample extracted records
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">New Contacts</p>
                <UserPlus className="text-green-600" size={21} />
              </div>
              <h3 className="mt-3 text-2xl font-bold text-green-600">
                85
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                New permanent contacts
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Returning</p>
                <RefreshCcw className="text-blue-600" size={21} />
              </div>
              <h3 className="mt-3 text-2xl font-bold text-blue-600">
                20
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Existing contacts attending again
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Duplicates</p>
                <AlertCircle className="text-amber-600" size={21} />
              </div>
              <h3 className="mt-3 text-2xl font-bold text-amber-600">
                15
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Records needing verification
              </p>
            </div>

          </div>

          {/* COLUMN MAPPING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  AI Column Mapping
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Match uploaded file columns with system fields.
                </p>
              </div>

              <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <CheckCircle2 size={14} />
                Mapping Suggested
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(mapping).map(([column, value]) => (
                <div
                  key={column}
                  className="grid grid-cols-1 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_auto_1fr]"
                >
                  <div>
                    <p className="text-xs text-slate-400">
                      Uploaded Column
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {column}
                    </p>
                  </div>

                  <div className="hidden text-slate-400 sm:block">
                    <ArrowRight size={19} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      System Field
                    </label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) =>
                          updateMapping(column, e.target.value)
                        }
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                      >
                        {systemFields.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-3 text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Review the suggested mappings. Incorrect mappings can result in
              incorrect contact information.
            </div>
          </div>

          {/* DATA PREVIEW */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Extracted Data Preview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review and correct records before importing.
                </p>
              </div>

              <button
                onClick={() => setShowAllRows(!showAllRows)}
                className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Eye size={16} />
                {showAllRows ? "Show Less" : "View All"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Permanent ID</th>
                    <th className="px-5 py-4">Full Name</th>
                    <th className="px-5 py-4">Full Address</th>
                    <th className="px-5 py-4">Phone Number</th>
                    <th className="px-5 py-4">Record Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {displayedRows.map((row, index) => (
                    <tr key={row.id + index} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <input
                          value={row.id}
                          onChange={(e) =>
                            updateRow(index, "id", e.target.value)
                          }
                          className="w-28 rounded border border-transparent bg-transparent px-2 py-1 font-medium text-slate-700 outline-none focus:border-blue-300 focus:bg-white"
                        />
                      </td>

                      <td className="px-5 py-3">
                        <input
                          value={row.name}
                          onChange={(e) =>
                            updateRow(index, "name", e.target.value)
                          }
                          className="w-32 rounded border border-transparent bg-transparent px-2 py-1 text-slate-700 outline-none focus:border-blue-300 focus:bg-white"
                        />
                      </td>

                      <td className="px-5 py-3">
                        <input
                          value={row.address}
                          onChange={(e) =>
                            updateRow(index, "address", e.target.value)
                          }
                          className="w-44 rounded border border-transparent bg-transparent px-2 py-1 text-slate-700 outline-none focus:border-blue-300 focus:bg-white"
                        />
                      </td>

                      <td className="px-5 py-3">
                        <input
                          value={row.phone}
                          onChange={(e) =>
                            updateRow(index, "phone", e.target.value)
                          }
                          className="w-32 rounded border border-transparent bg-transparent px-2 py-1 text-slate-700 outline-none focus:border-blue-300 focus:bg-white"
                        />
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
              Showing {displayedRows.length} of {rows.length} sample records.
              Editable preview only.
            </div>
          </div>

          {/* IMPORT CONFIRMATION */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-bold text-slate-800">
                Ready to Import?
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Confirm only after reviewing the column mapping and extracted
                contact records.
              </p>
            </div>

            <button
              onClick={() => setIsConfirmed(true)}
              disabled={isConfirmed}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <CheckCircle2 size={18} />
              {isConfirmed ? "Preview Confirmed" : "Confirm Import"}
            </button>
          </div>

          {isConfirmed && (
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Preview confirmation successful!</p>
                <p className="mt-1 text-sm">
                  This is a frontend demo. No records have been saved to a
                  database yet. Backend integration will enable actual importing.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!isAnalyzed && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Sparkles size={21} />
            </div>
            <h3 className="font-semibold text-slate-800">
              AI Column Detection
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Identify different column names and match them with system fields.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ScanLine size={21} />
            </div>
            <h3 className="font-semibold text-slate-800">
              Document Scanning
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Extract information from scanned documents using future OCR integration.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Users size={21} />
            </div>
            <h3 className="font-semibold text-slate-800">
              Duplicate Detection
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Match permanent IDs and distinguish new contacts from returning contacts.
            </p>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        EventConnect · Smart Contact Management System
      </p>
    </div>
  );
}

export default Import;
