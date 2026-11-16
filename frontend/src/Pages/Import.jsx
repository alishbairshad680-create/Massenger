
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  FileImage,
  FileText,
  ScanLine,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
  UserPlus,
  RefreshCcw,
  ChevronDown,
  Trash2,
  ShieldCheck,
  Eye,
  Loader2,
} from "lucide-react";
import { getContacts, createContact } from "../services/api";

const systemFields = [
  "Permanent ID",
  "Full Name",
  "Full Address",
  "Phone Number",
  "Email Address",
  "Ignore Column",
];

const normalize = (value) =>
  String(value ?? "").trim().toLowerCase();

const detectField = (header) => {
  const value = normalize(header).replace(/[^a-z0-9]/g, "");

  if (
    ["permanentid", "registrationid", "regid", "contactid", "id"].includes(value)
  ) return "Permanent ID";

  if (
    ["name", "fullname", "contactname", "customername"].includes(value)
  ) return "Full Name";

  if (
    ["address", "fulladdress", "location"].includes(value)
  ) return "Full Address";

  if (
    ["phone", "phonenumber", "contactnumber", "mobile", "mobilenumber"].includes(value)
  ) return "Phone Number";

  if (["email", "emailaddress"].includes(value)) {
    return "Email Address";
  }

  return "Ignore Column";
};

const buildRows = (records, mapping, existingIds) => {
  const seen = new Set();

  return records.map((record, index) => {
    const getValue = (field) => {
      const header = Object.keys(mapping).find(
        (key) => mapping[key] === field
      );

      return header ? String(record[header] ?? "").trim() : "";
    };

    const permanentId = getValue("Permanent ID");
    const name = getValue("Full Name");
    const idKey = normalize(permanentId);

    let status = "New";

    if (!permanentId || !name) {
      status = "Invalid";
    } else if (existingIds.has(idKey)) {
      status = "Existing";
    } else if (seen.has(idKey)) {
      status = "Duplicate";
    }

    if (idKey) seen.add(idKey);

    return {
      sourceIndex: index,
      permanentId,
      name,
      address: getValue("Full Address"),
      phone: getValue("Phone Number"),
      email: getValue("Email Address"),
      status,
    };
  });
};

function Import() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [activeTab, setActiveTab] = useState("excel");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rawRecords, setRawRecords] = useState([]);
  const [mapping, setMapping] = useState({});
  const [rows, setRows] = useState([]);
  const [existingIds, setExistingIds] = useState(new Set());
  const [showAllRows, setShowAllRows] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [importResult, setImportResult] = useState(null);

  const handleFile = (selectedFile, type) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileType(type);
    setIsAnalyzed(false);
    setIsConfirmed(false);
    setRows([]);
    setRawRecords([]);
    setMapping({});
    setMessage("");
    setError("");
    setImportResult(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileType("");
    setIsAnalyzed(false);
    setIsConfirmed(false);
    setRows([]);
    setRawRecords([]);
    setMapping({});
    setMessage("");
    setError("");
    setImportResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    if (fileType !== "excel") {
      setError(
        "Scanned document reading is not implemented yet. Please use Excel or CSV for now."
      );
      return;
    }

    try {
      setError("");
      setMessage("");

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const records = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (!records.length) {
        setError("The selected file is empty or has no readable rows.");
        return;
      }

      const headers = Object.keys(records[0]);

      if (!headers.length) {
        setError("No column headings were found in this file.");
        return;
      }

      const suggestedMapping = {};

      headers.forEach((header) => {
        suggestedMapping[header] = detectField(header);
      });

      const contactsResponse = await getContacts();
      const contacts = contactsResponse.contacts || [];

      const ids = new Set(
        contacts.map((contact) => normalize(contact.permanentId))
      );

      setExistingIds(ids);
      setRawRecords(records);
      setMapping(suggestedMapping);
      setRows(buildRows(records, suggestedMapping, ids));
      setIsAnalyzed(true);
      setIsConfirmed(false);
      setImportResult(null);
    } catch (err) {
      setError(err.message || "Unable to read the selected file.");
    }
  };

  const updateMapping = (column, value) => {
    const nextMapping = {
      ...mapping,
      [column]: value,
    };

    setMapping(nextMapping);
    setRows(buildRows(rawRecords, nextMapping, existingIds));
    setImportResult(null);
    setIsConfirmed(false);
  };

  const updateRow = (index, field, value) => {
    setRows((previous) =>
      previous.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
    setImportResult(null);
    setIsConfirmed(false);
  };

  const handleImport = async () => {
    const candidates = rows.filter((row) => row.status === "New");

    if (!candidates.length) {
      setError("There are no new valid contacts to import.");
      return;
    }

    try {
      setIsImporting(true);
      setError("");
      setMessage("");

      // Refresh existing IDs before importing to avoid duplicates.
      const latestResponse = await getContacts();
      const latestContacts = latestResponse.contacts || [];

      const latestIds = new Set(
        latestContacts.map((contact) => normalize(contact.permanentId))
      );

      let imported = 0;
      let skipped = 0;
      const updatedRows = [...rows];

      for (const row of candidates) {
        const idKey = normalize(row.permanentId);

        if (!row.name.trim() || !idKey || latestIds.has(idKey)) {
          skipped++;

          const index = updatedRows.findIndex(
            (item) => item.sourceIndex === row.sourceIndex
          );

          if (index !== -1) {
            updatedRows[index] = {
              ...updatedRows[index],
              status: "Existing",
            };
          }

          continue;
        }

        try {
          await createContact({
            permanentId: row.permanentId.trim(),
            name: row.name.trim(),
            phone: row.phone.trim(),
            email: row.email.trim(),
            address: row.address.trim(),
          });

          latestIds.add(idKey);
          imported++;

          const index = updatedRows.findIndex(
            (item) => item.sourceIndex === row.sourceIndex
          );

          if (index !== -1) {
            updatedRows[index] = {
              ...updatedRows[index],
              status: "Imported",
            };
          }
        } catch (err) {
          skipped++;

          const index = updatedRows.findIndex(
            (item) => item.sourceIndex === row.sourceIndex
          );

          if (index !== -1) {
            updatedRows[index] = {
              ...updatedRows[index],
              status: "Error",
            };
          }
        }
      }

      setRows(updatedRows);
      setExistingIds(latestIds);
      setIsConfirmed(true);
      setImportResult({ imported, skipped });

      if (imported > 0) {
        setMessage(
          `${imported} contact(s) successfully saved to MongoDB.`
        );
      } else {
        setMessage("No new contacts were imported.");
      }
    } catch (err) {
      setError(err.message || "Unable to import contacts.");
    } finally {
      setIsImporting(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      New: "bg-green-50 text-green-700",
      Existing: "bg-amber-50 text-amber-700",
      Duplicate: "bg-amber-50 text-amber-700",
      Invalid: "bg-red-50 text-red-700",
      Imported: "bg-blue-50 text-blue-700",
      Error: "bg-red-50 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-600";
  };

  const newCount = rows.filter((row) => row.status === "New").length;
  const existingCount = rows.filter(
    (row) => row.status === "Existing" || row.status === "Duplicate"
  ).length;
  const invalidCount = rows.filter(
    (row) => row.status === "Invalid" || row.status === "Error"
  ).length;
  const importedCount = rows.filter(
    (row) => row.status === "Imported"
  ).length;

  const displayedRows = showAllRows ? rows : rows.slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-blue-600">Import / Scan</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            AI Import Center
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Import contacts from Excel and CSV files into your database.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Sparkles size={16} />
          Smart Contact Import
        </div>
      </div>

      {/* INFORMATION BANNER */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <ShieldCheck size={21} className="mt-0.5 shrink-0 text-blue-600" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Smart Contact Recognition
          </h3>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            Upload your contact file, review the detected columns, check
            duplicate Permanent IDs and save valid contacts to MongoDB.
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

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("excel")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
              activeTab === "excel"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet size={17} />
            Excel / CSV
          </button>

          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
              activeTab === "scan"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ScanLine size={17} />
            Scanned Documents
          </button>
        </div>

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
              onChange={(e) => handleFile(e.target.files[0], activeTab)}
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
              Browse your computer to select a file.
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {activeTab === "excel"
                ? "Supported formats: XLSX, XLS, CSV"
                : "PDF, JPG, JPEG, PNG (OCR not available yet)"}
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
              Review the selected file before analyzing.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzed}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-green-600"
            >
              {isAnalyzed ? (
                <>
                  <CheckCircle2 size={17} />
                  Analysis Complete
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Analyze File
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ERRORS AND MESSAGES */}
      {error && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} className="shrink-0" />
          {error}
        </div>
      )}

      {message && (
        <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 size={20} className="shrink-0" />
          {message}
        </div>
      )}

      {/* ANALYSIS */}
      {isAnalyzed && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Records",
                value: rows.length,
                icon: FileText,
                color: "text-blue-600",
              },
              {
                label: "New Contacts",
                value: newCount,
                icon: UserPlus,
                color: "text-green-600",
              },
              {
                label: "Existing / Duplicates",
                value: existingCount,
                icon: RefreshCcw,
                color: "text-amber-600",
              },
              {
                label: "Invalid / Errors",
                value: invalidCount,
                icon: AlertCircle,
                color: "text-red-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <Icon className={item.color} size={21} />
                  </div>
                  <h3 className={`mt-3 text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* COLUMN MAPPING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                Column Mapping
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Match your file columns with the contact fields in our system.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(mapping).map(([column, value]) => (
                <div
                  key={column}
                  className="grid grid-cols-1 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_auto_1fr]"
                >
                  <div>
                    <p className="text-xs text-slate-400">File Column</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {column}
                    </p>
                  </div>

                  <div className="hidden text-slate-400 sm:block">
                    <ArrowRight size={19} />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Contact Field
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
              Permanent ID and Full Name are required. Check the mappings
              before importing.
            </div>
          </div>

          {/* DATA PREVIEW */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Contact Data Preview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review and correct your records before saving.
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
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Permanent ID</th>
                    <th className="px-4 py-4">Full Name</th>
                    <th className="px-4 py-4">Address</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {displayedRows.map((row, index) => (
                    <tr key={row.sourceIndex} className="hover:bg-slate-50">
                      {[
                        ["permanentId", "w-28"],
                        ["name", "w-32"],
                        ["address", "w-40"],
                        ["phone", "w-32"],
                        ["email", "w-40"],
                      ].map(([field, width]) => (
                        <td key={field} className="px-4 py-3">
                          <input
                            value={row[field]}
                            onChange={(e) =>
                              updateRow(
                                row.sourceIndex,
                                field,
                                e.target.value
                              )
                            }
                            className={`${width} rounded border border-transparent bg-transparent px-2 py-1 text-slate-700 outline-none focus:border-blue-300 focus:bg-white`}
                          />
                        </td>
                      ))}

                      <td className="px-4 py-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
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
              Showing {displayedRows.length} of {rows.length} records.
              Imported records are saved in MongoDB.
            </div>
          </div>

          {/* IMPORT BUTTON */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-bold text-slate-800">
                Ready to Import?
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                {newCount} new contact(s) are ready to save.
                Existing and invalid records will be skipped.
              </p>
            </div>

            <button
              onClick={handleImport}
              disabled={isImporting || newCount === 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isImporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Import {newCount} Contacts
                </>
              )}
            </button>
          </div>

          {importResult && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={20} />
                Import completed
              </div>
              <p className="mt-2 text-sm">
                Successfully imported: {importResult.imported}
              </p>
              <p className="text-sm">
                Skipped or failed: {importResult.skipped}
              </p>
              <p className="mt-2 text-sm">
                Open Contacts and refresh to verify the imported records.
              </p>
            </div>
          )}
        </>
      )}

      {!isAnalyzed && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Sparkles className="mb-3 text-blue-600" size={23} />
            <h3 className="font-semibold text-slate-800">
              Column Detection
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Automatically suggest mappings for common contact column names.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <ScanLine className="mb-3 text-purple-600" size={23} />
            <h3 className="font-semibold text-slate-800">
              Document Scanning
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              PDF and image OCR integration will be added in a later stage.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Users className="mb-3 text-green-600" size={23} />
            <h3 className="font-semibold text-slate-800">
              Duplicate Detection
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Check Permanent IDs against existing contacts before saving.
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
