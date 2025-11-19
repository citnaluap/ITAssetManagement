import React, { useState, useMemo, useEffect } from 'react';
import {
  Laptop,
  Server,
  Monitor,
  HardDrive,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  Download,
  Key,
  History,
  ArrowRightLeft,
  Wrench,
  X,
  Check,
  RefreshCw,
  Share2,
  ShieldCheck,
  Bell,
  CalendarClock,
  Tag,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const initialAssets = [
  { id: 1, type: 'Laptop', brand: 'Dell', model: 'Latitude 5420', serialNumber: 'DL2024001', assignedTo: 'John Smith', department: 'Engineering', location: 'HQ-Floor 3', status: 'Active', purchaseDate: '2023-01-15', warrantyExpiry: '2026-01-15', cost: 1200, checkedOut: true, checkOutDate: '2023-01-20', qrCode: 'QR-DL2024001' },
  { id: 2, type: 'Desktop', brand: 'HP', model: 'EliteDesk 800', serialNumber: 'HP2024002', assignedTo: 'Sarah Johnson', department: 'Finance', location: 'HQ-Floor 2', status: 'Active', purchaseDate: '2023-03-20', warrantyExpiry: '2026-03-20', cost: 950, checkedOut: true, checkOutDate: '2023-03-25', qrCode: 'QR-HP2024002' },
  { id: 3, type: 'Server', brand: 'Dell', model: 'PowerEdge R740', serialNumber: 'DL2024003', assignedTo: 'IT Department', department: 'IT', location: 'Data Center', status: 'Active', purchaseDate: '2022-06-10', warrantyExpiry: '2025-06-10', cost: 8500, checkedOut: false, qrCode: 'QR-DL2024003' },
  { id: 4, type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1', serialNumber: 'LN2024004', assignedTo: 'Mike Chen', department: 'Marketing', location: 'HQ-Floor 4', status: 'Active', purchaseDate: '2023-08-05', warrantyExpiry: '2026-08-05', cost: 1400, checkedOut: true, checkOutDate: '2023-08-10', qrCode: 'QR-LN2024004' },
];

const initialLicenses = [
  { id: 1, software: 'Microsoft Office 365', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX', seats: 50, used: 42, expiryDate: '2025-12-31', cost: 3000, vendor: 'Microsoft' },
  { id: 2, software: 'Adobe Creative Cloud', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX', seats: 10, used: 10, expiryDate: '2025-06-30', cost: 6000, vendor: 'Adobe' },
  { id: 3, software: 'Slack Enterprise', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX', seats: 100, used: 87, expiryDate: '2025-09-15', cost: 8000, vendor: 'Slack' },
  { id: 4, software: 'AutoCAD', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX', seats: 5, used: 5, expiryDate: '2025-03-20', cost: 4500, vendor: 'Autodesk' },
];

const initialMaintenance = [
  { id: 1, assetId: 2, date: '2024-10-15', type: 'Repair', description: 'Replaced faulty RAM module', cost: 150, technician: 'Tom Wilson', status: 'Completed' },
  { id: 2, assetId: 1, date: '2024-09-20', type: 'Upgrade', description: 'Upgraded SSD to 1TB', cost: 200, technician: 'Tom Wilson', status: 'Completed' },
  { id: 3, assetId: 4, date: '2024-10-25', type: 'Maintenance', description: 'Routine cleaning and inspection', cost: 50, technician: 'Jane Martinez', status: 'Completed' },
  { id: 4, assetId: 3, date: '2024-11-01', type: 'Repair', description: 'Server cooling fan replacement', cost: 300, technician: 'Tom Wilson', status: 'In Progress' },
];

const initialCheckInOut = [
  { id: 1, assetId: 1, action: 'Check Out', user: 'John Smith', date: '2023-01-20', notes: 'For remote work' },
  { id: 2, assetId: 2, action: 'Check Out', user: 'Sarah Johnson', date: '2023-03-25', notes: 'Desk assignment' },
  { id: 3, assetId: 4, action: 'Check Out', user: 'Mike Chen', date: '2023-08-10', notes: 'New employee setup' },
];

const STORAGE_KEYS = {
  assets: 'uds_assets',
  licenses: 'uds_licenses',
  maintenance: 'uds_maintenance',
  history: 'uds_history',
};

const assetTypeIcons = {
  Laptop,
  Desktop: Monitor,
  Server,
  Storage: HardDrive,
};

const defaultAsset = {
  id: null,
  type: 'Laptop',
  brand: '',
  model: '',
  serialNumber: '',
  assignedTo: '',
  department: '',
  location: '',
  status: 'Active',
  purchaseDate: '',
  warrantyExpiry: '',
  cost: 0,
  checkedOut: false,
  checkOutDate: '',
  qrCode: '',
};

const NAV_LINKS = ['Overview', 'Hardware', 'Software', 'Vendors'];

const isBrowser = typeof window !== 'undefined';

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota errors so the dashboard still works offline.
    }
  }, [key, state]);

  return [state, setState];
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) => {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const statusClasses = {
  Active: 'bg-emerald-50 text-emerald-700',
  Maintenance: 'bg-amber-50 text-amber-700',
  Retired: 'bg-slate-100 text-slate-500',
};

const StatCard = ({ icon: Icon, label, value, subline }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="rounded-full bg-slate-900/5 p-3 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    {subline && <p className="mt-4 text-xs text-slate-500">{subline}</p>}
  </div>
);

const CardShell = ({ title, icon: Icon, action, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-slate-500" />}
        <p className="text-sm font-semibold text-slate-800">{title}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const PrimaryNav = ({ onAdd, onExport }) => (
  <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 px-5 py-4 backdrop-blur">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-600">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">UDS Command</p>
        <p className="text-base font-semibold text-slate-900">Asset Control Studio</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
      {NAV_LINKS.map((item, index) => (
        <button
          key={item}
          className={`transition hover:text-slate-900 ${index === 0 ? 'text-slate-900' : ''}`}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        New asset
      </button>
      <button className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300" type="button">
        <Bell className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
        <div>
          <p className="text-xs font-semibold text-slate-700">Operations</p>
          <p className="text-[11px] text-slate-400">team@uds.co</p>
        </div>
      </div>
    </div>
  </nav>
);

const QuickActionCard = ({ title, description, icon: Icon, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm backdrop-blur">
    <div className="flex items-start gap-3">
      <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <button
      onClick={onAction}
      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      type="button"
    >
      {actionLabel}
      <ArrowRightLeft className="h-4 w-4" />
    </button>
  </div>
);

const AssetFilters = ({ filters, onChange, onReset, types }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search by brand, serial, or user"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <select
        value={filters.type}
        onChange={(event) => onChange('type', event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(event) => onChange('status', event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="all">All statuses</option>
        <option value="Active">Active</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Retired">Retired</option>
      </select>
      <button
        onClick={onReset}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  </div>
);
const AssetTable = ({ assets, onEdit, onDelete, onAction, onSelect = () => {}, selectedId }) => {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-sm text-slate-500">
        No assets match the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {assets.map((asset) => {
              const Icon = assetTypeIcons[asset.type] || Monitor;
              const isSelected = selectedId === asset.id;
              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className={`cursor-pointer transition ${
                    isSelected ? 'bg-blue-50/80 shadow-inner ring-1 ring-blue-100' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {asset.brand} {asset.model}
                        </p>
                        <p className="text-xs text-slate-500">{asset.serialNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{asset.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{asset.department}</div>
                    <div className="text-xs text-slate-400">{asset.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[asset.status] || 'bg-slate-100 text-slate-500'}`}>
                      {asset.checkedOut ? 'Checked Out' : asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(asset.cost)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onAction(asset, asset.checkedOut ? 'checkin' : 'checkout');
                        }}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        {asset.checkedOut ? 'Check In' : 'Check Out'}
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(asset);
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                        title="Edit asset"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(asset);
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                        title="Remove asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LicenseUsage = ({ licenses }) => {
  const usage = useMemo(
    () =>
      licenses.map((license) => ({
        name: license.software,
        used: license.used,
        available: license.seats - license.used,
      })),
    [licenses],
  );

  return (
    <CardShell title="License usage" icon={Key}>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
          <BarChart data={usage} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="used" stackId="a" fill="#2563eb" name="Used seats" />
            <Bar dataKey="available" stackId="a" fill="#94a3b8" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
};

const MaintenanceList = ({ records, getAssetName }) => (
  <CardShell title="Recent maintenance" icon={Wrench}>
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{record.type}</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                record.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {record.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{record.date}</p>
          <p className="mt-3 text-sm text-slate-600">{record.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{getAssetName(record.assetId)}</span>
            <span>${record.cost}</span>
          </div>
        </div>
      ))}
    </div>
  </CardShell>
);

const ActivityPanel = ({ history, lookupAsset }) => (
  <CardShell title="Check-in/out activity" icon={History}>
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
          <div
            className={`rounded-full p-2 ${
              entry.action === 'Check Out' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {entry.action} • {lookupAsset(entry.assetId)}
            </p>
            <p className="text-xs text-slate-500">
              {entry.date} · {entry.user}
            </p>
            {entry.notes && <p className="mt-1 text-sm text-slate-600">{entry.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  </CardShell>
);

const AssetSpotlight = ({ asset, onEdit }) => {
  const Icon = asset ? assetTypeIcons[asset.type] || Monitor : Monitor;

  return (
    <div className="sticky top-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Asset spotlight</p>
          <p className="text-base font-semibold text-slate-900">{asset ? 'Live snapshot' : 'Choose a device'}</p>
        </div>
        {asset && (
          <button
            onClick={() => onEdit(asset)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
            type="button"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Update
          </button>
        )}
      </div>

      {asset ? (
        <>
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/60">{asset.type}</p>
                <p className="text-lg font-semibold">{asset.brand} {asset.model}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {asset.status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                {formatCurrency(asset.cost)}
              </span>
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-400">Assigned to</dt>
                <dd className="text-base font-semibold text-slate-900">{asset.assignedTo || 'Unassigned'}</dd>
              </div>
              <div className="text-right text-xs text-slate-400">
                {asset.checkedOut ? `Checked out ${formatDate(asset.checkOutDate)}` : 'Available'}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{asset.location || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="h-4 w-4 text-slate-400" />
                <span>{asset.qrCode || 'Not generated'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarClock className="h-4 w-4 text-slate-400" />
                <span>Purchased {formatDate(asset.purchaseDate)}</span>
              </div>
              <div className="text-slate-600">
                Warranty ends {formatDate(asset.warrantyExpiry)}
              </div>
            </div>
          </dl>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          Select an asset from the table to view a friendly summary of ownership, warranty, and deployment details.
        </div>
      )}
    </div>
  );
};
const ModalShell = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 px-4 py-8">
    <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-6 py-4">{children}</div>
    </div>
  </div>
);

const AssetFormModal = ({ asset, onSubmit, onCancel }) => {
  const [form, setForm] = useState(asset || defaultAsset);

  useEffect(() => {
    setForm(asset || defaultAsset);
  }, [asset]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <ModalShell title={asset?.id ? 'Edit asset' : 'New asset'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Asset type
            <select
              value={form.type}
              onChange={(event) => update('type', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Server">Server</option>
              <option value="Storage">Storage</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Brand
            <input
              value={form.brand}
              onChange={(event) => update('brand', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Model
            <input
              value={form.model}
              onChange={(event) => update('model', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Serial number
            <input
              value={form.serialNumber}
              onChange={(event) => update('serialNumber', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Department
            <input
              value={form.department}
              onChange={(event) => update('department', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Assigned to
            <input
              value={form.assignedTo}
              onChange={(event) => update('assignedTo', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(event) => update('status', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Purchase date
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(event) => update('purchaseDate', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Warranty expiry
            <input
              type="date"
              value={form.warrantyExpiry}
              onChange={(event) => update('warrantyExpiry', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Cost
            <input
              type="number"
              value={form.cost}
              onChange={(event) => update('cost', Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            QR code value
            <input
              value={form.qrCode}
              onChange={(event) => update('qrCode', event.target.value)}
              placeholder="QR-XXXXXX"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Save asset
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const CheckActionModal = ({ asset, mode, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    user: asset?.assignedTo || '',
    notes: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    setForm({
      user: asset?.assignedTo || '',
      notes: '',
      date: new Date().toISOString().slice(0, 10),
    });
  }, [asset, mode]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      assetId: asset.id,
      mode,
      user: form.user || 'Unassigned',
      notes: form.notes,
      date: form.date,
    });
  };

  return (
    <ModalShell title={mode === 'checkout' ? 'Check out asset' : 'Check in asset'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {asset.brand} {asset.model}
          </p>
          <p className="text-xs text-slate-500">{asset.serialNumber}</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          User
          <input
            value={form.user}
            onChange={(event) => update('user', event.target.value)}
            placeholder="Person receiving the asset"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Date
          <input
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Notes
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {mode === 'checkout' ? 'Check out' : 'Check in'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
const App = () => {
  const [assets, setAssets] = usePersistentState(STORAGE_KEYS.assets, initialAssets);
  const [licenses, setLicenses] = usePersistentState(STORAGE_KEYS.licenses, initialLicenses);
  const [maintenanceRecords] = usePersistentState(STORAGE_KEYS.maintenance, initialMaintenance);
  const [history, setHistory] = usePersistentState(STORAGE_KEYS.history, initialCheckInOut);

  const [filters, setFilters] = useState({ search: '', type: 'all', status: 'all' });
  const [assetForm, setAssetForm] = useState(null);
  const [actionState, setActionState] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const filteredAssets = useMemo(() => {
    const query = filters.search.toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.brand.toLowerCase().includes(query) ||
        asset.model.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.assignedTo.toLowerCase().includes(query);
      const matchesType = filters.type === 'all' || asset.type === filters.type;
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'Active' && !asset.checkedOut && asset.status === 'Active') ||
        (filters.status === 'Maintenance' && asset.status === 'Maintenance') ||
        (filters.status === 'Retired' && asset.status === 'Retired');

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, filters]);

  useEffect(() => {
    if (filteredAssets.length === 0) {
      setSelectedAssetId(null);
      return;
    }
    if (!filteredAssets.some((asset) => asset.id === selectedAssetId)) {
      setSelectedAssetId(filteredAssets[0].id);
    }
  }, [filteredAssets, selectedAssetId]);

  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + Number(asset.cost || 0), 0);
    const checkedOut = assets.filter((asset) => asset.checkedOut).length;
    const available = assets.length - checkedOut;
    const expiringSoon = assets.filter((asset) => {
      if (!asset.warrantyExpiry) {
        return false;
      }
      const diff = new Date(asset.warrantyExpiry) - new Date();
      return diff > 0 && diff / (1000 * 60 * 60 * 24) <= 90;
    }).length;
    const newThisYear = assets.filter((asset) => new Date(asset.purchaseDate).getFullYear() === new Date().getFullYear()).length;

    return {
      total: assets.length,
      totalValue,
      checkedOut,
      available,
      expiringSoon,
      newThisYear,
    };
  }, [assets]);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) || null,
    [assets, selectedAssetId],
  );

  const typeDistribution = useMemo(() => {
    const map = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const recentMaintenance = useMemo(
    () =>
      maintenanceRecords
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4),
    [maintenanceRecords],
  );

  const recentHistory = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [history],
  );

  const assetAcquisitionTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, index) => {
      const temp = new Date(now);
      temp.setMonth(now.getMonth() - (5 - index));
      const label = temp.toLocaleString('default', { month: 'short' });
      const count = assets.filter(
        (asset) => new Date(asset.purchaseDate).getMonth() === temp.getMonth() && new Date(asset.purchaseDate).getFullYear() === temp.getFullYear(),
      ).length;

      return { name: label, assets: count };
    });
  }, [assets]);

  const typeColors = ['#2563eb', '#a855f7', '#f97316', '#10b981'];

  const typeOptions = useMemo(() => Array.from(new Set(assets.map((asset) => asset.type))), [assets]);

  const licenseInsights = useMemo(() => {
    const totals = licenses.reduce(
      (acc, license) => {
        acc.used += license.used;
        acc.seats += license.seats;
        return acc;
      },
      { used: 0, seats: 0 },
    );
    const percent = totals.seats ? Math.round((totals.used / totals.seats) * 100) : 0;
    return { ...totals, percent };
  }, [licenses]);

  const utilization = stats.total ? Math.round((stats.checkedOut / stats.total) * 100) : 0;
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleRowSelect = (asset) => {
    setSelectedAssetId(asset.id);
  };

  const handleSaveAsset = (payload) => {
    const normalized = {
      ...payload,
      id: payload.id ?? Date.now(),
      cost: Number(payload.cost) || 0,
      qrCode: payload.qrCode || `QR-${payload.serialNumber || payload.id}`,
    };

    setAssets((prev) => {
      const exists = prev.some((asset) => asset.id === normalized.id);
      if (exists) {
        return prev.map((asset) => (asset.id === normalized.id ? normalized : asset));
      }
      return [...prev, normalized];
    });

    setAssetForm(null);
  };

  const handleDeleteAsset = (asset) => {
    if (window.confirm(`Delete ${asset.brand} ${asset.model}?`)) {
      setAssets((prev) => prev.filter((item) => item.id !== asset.id));
    }
  };

  const handleActionSubmit = ({ assetId, mode, user, notes, date }) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id !== assetId) {
          return asset;
        }
        if (mode === 'checkout') {
          return { ...asset, assignedTo: user, checkedOut: true, checkOutDate: date };
        }
        return { ...asset, assignedTo: '', checkedOut: false, checkOutDate: '' };
      }),
    );

    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        assetId,
        action: mode === 'checkout' ? 'Check Out' : 'Check In',
        user,
        notes,
        date,
      },
    ]);

    setActionState(null);
  };

  const handleResetData = () => {
    if (window.confirm('This will replace your data with the starter set. Continue?')) {
      setAssets(initialAssets);
      setLicenses(initialLicenses);
      setHistory(initialCheckInOut);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ assets, licenses, maintenanceRecords, history }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'asset-management-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const quickActions = [
    {
      title: 'Register new hardware',
      description: 'Log laptops, peripherals, or sensors and auto-assign to teams.',
      icon: Plus,
      actionLabel: 'Add asset',
      onAction: () => setAssetForm(defaultAsset),
    },
    {
      title: 'Share executive snapshot',
      description: 'Export JSON for finance, compliance, or reporting workflows.',
      icon: Share2,
      actionLabel: 'Export data',
      onAction: handleExport,
    },
    {
      title: 'Refresh the sandbox',
      description: 'Reset demo content to explore workflows from a clean slate.',
      icon: RefreshCw,
      actionLabel: 'Reset sample data',
      onAction: handleResetData,
    },
  ];

  const getAssetName = (id) => {
    const asset = assets.find((item) => item.id === id);
    return asset ? `${asset.brand} ${asset.model}` : 'Unknown asset';
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PrimaryNav onAdd={() => setAssetForm(defaultAsset)} onExport={handleExport} />

        <section className="mb-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-8 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.3rem] text-white/60">Intelligent operations</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">One command center for every asset lifecycle</h1>
            <p className="mt-3 text-sm text-white/70">
              Monitor procurement, deployment, and renewals from a single, human-friendly surface. Everything updates in real time so you can make confident decisions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Compliance ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Live audit logs
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setAssetForm(defaultAsset)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
                Add hardware
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                Share snapshot
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Assets tracked</p>
                <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Inventory value</p>
                <p className="mt-1 text-2xl font-semibold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">Warranty alerts</p>
                <p className="mt-1 text-2xl font-semibold">{stats.expiringSoon}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-900/60 bg-slate-900 p-6 text-white shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-white/60">Fleet health</p>
            <p className="mt-3 text-4xl font-semibold">{utilization}%</p>
            <p className="text-sm text-white/70">Checked out utilisation</p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-300"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Active hardware</span>
                <span className="font-semibold">{stats.available} available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Checked out</span>
                <span className="font-semibold">{stats.checkedOut} devices</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">License usage</span>
                <span className="font-semibold">{licenseInsights.percent}% of {licenseInsights.seats} seats</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Laptop} label="Assets tracked" value={stats.total} subline={`${stats.newThisYear} purchased this year`} />
          <StatCard icon={ArrowRightLeft} label="Checked out" value={stats.checkedOut} subline={`${stats.available} available`} />
          <StatCard icon={HardDrive} label="Inventory value" value={formatCurrency(stats.totalValue)} subline="Replacement cost" />
          <StatCard icon={AlertTriangle} label="Warranty alerts" value={stats.expiringSoon} subline="Expiring in 90 days" />
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <AssetFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={() => setFilters({ search: '', type: 'all', status: 'all' })}
              types={typeOptions}
            />
            <AssetTable
              assets={filteredAssets}
              onEdit={setAssetForm}
              onDelete={handleDeleteAsset}
              onAction={(asset, mode) => setActionState({ asset, mode })}
              onSelect={handleRowSelect}
              selectedId={selectedAssetId}
            />
          </div>
          <AssetSpotlight asset={selectedAsset} onEdit={setAssetForm} />
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-2">
          <CardShell title="Asset mix" icon={Laptop}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                <PieChart>
                  <Tooltip />
                  <Pie data={typeDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label>
                    {typeDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={typeColors[index % typeColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardShell>
          <CardShell title="New assets by month" icon={HardDrive}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                <LineChart data={assetAcquisitionTrend} margin={{ top: 5, right: 16, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="assets" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardShell>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <LicenseUsage licenses={licenses} />
          <MaintenanceList records={recentMaintenance} getAssetName={getAssetName} />
          <ActivityPanel history={recentHistory} lookupAsset={getAssetName} />
        </section>
      </div>

      {assetForm && <AssetFormModal asset={assetForm} onSubmit={handleSaveAsset} onCancel={() => setAssetForm(null)} />}
      {actionState && <CheckActionModal asset={actionState.asset} mode={actionState.mode} onSubmit={handleActionSubmit} onCancel={() => setActionState(null)} />}
    </div>
  );
};

export default App;


