import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRightLeft, Check, Laptop, Mail, PhoneCall, RefreshCw, Send, Sparkles } from 'lucide-react';

const HELP_DESK_EMAIL = 'ITHelpDesk@udservices.org';

const initialRequests = [
  {
    id: 'req-14021',
    mode: 'request',
    employee: 'Jessie Rivera',
    department: 'Facilities',
    details: 'Requesting a 14" laptop and docking setup for new hire onboarding on 3/18.',
    email: 'jrivera@udservices.org',
    status: 'Pending',
    timestamp: 'Mar 2',
  },
  {
    id: 'req-14022',
    mode: 'issue',
    employee: 'Pat Miles',
    department: 'Finance',
    details: 'Spare Surface power adapter needed for travel; ship to Harrisburg office.',
    email: 'pmiles@udservices.org',
    status: 'In review',
    timestamp: 'Mar 1',
  },
];

const selfServiceGuides = [
  { title: 'Request hardware', body: 'Tell us what you need, when you need it, and who it’s for.', icon: Laptop },
  { title: 'Report an issue', body: 'Describe the symptoms, urgency, and your location so we can triage.', icon: AlertTriangle },
  { title: 'Talk to a human', body: 'Call the IT Help Desk for urgent incidents or outages.', icon: PhoneCall },
];

const buildHelpDeskEmailBody = (entry) => {
  const rows = [
    `Request ID: ${entry.id}`,
    `Type: ${entry.mode === 'request' ? 'Hardware request' : 'Issue report'}`,
    `Name: ${entry.employee}`,
    `Email: ${entry.email}`,
    `Department/Location: ${entry.department || 'N/A'}`,
    `Details: ${entry.details}`,
    `Timestamp: ${entry.timestamp}`,
  ];
  return rows.join('\n');
};

const sendHelpDeskEmail = (entry) => {
  if (typeof window === 'undefined') {
    return;
  }
  const subject = `HelpDesk ${entry.mode === 'request' ? 'request' : 'issue'} from ${entry.employee || 'unknown'}`;
  const body = buildHelpDeskEmailBody(entry);
  const href = `mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(href);
};

const faq = [
  { q: 'How soon will I hear back?', a: 'We acknowledge new requests within 1 business day. Critical incidents are routed immediately.' },
  { q: 'What details help the most?', a: 'Include device type, urgency, location, and any error messages or steps already tried.' },
  { q: 'Can I track my request?', a: 'Yes—submitted requests appear in the queue below. We will email you with updates.' },
];

const StatCard = ({ label, value, tone = 'slate' }) => {
  const palette = {
    slate: 'bg-slate-50 text-slate-900 border-slate-200',
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  }[tone];

  return (
    <div className={`rounded-2xl border ${palette} p-4 shadow-sm`}>
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
};

const RequestForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    mode: 'request',
    employee: '',
    email: '',
    department: '',
    details: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.employee || !form.email || !form.details) {
      return;
    }
    onSubmit(form);
    setForm((prev) => ({ ...prev, employee: '', email: '', department: '', details: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
        <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${form.mode === 'request' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
          <input type="radio" name="mode" value="request" checked={form.mode === 'request'} onChange={() => update('mode', 'request')} />
          Hardware needed
        </label>
        <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${form.mode === 'issue' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200'}`}>
          <input type="radio" name="mode" value="issue" checked={form.mode === 'issue'} onChange={() => update('mode', 'issue')} />
          Report an issue
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Name
          <input
            value={form.employee}
            onChange={(event) => update('employee', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Jamie Rivera"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="you@udservices.org"
            required
          />
        </label>
      </div>
      <label className="text-sm font-medium text-slate-700">
        Department / Location
        <input
          value={form.department}
          onChange={(event) => update('department', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Finance, Lancaster"
        />
      </label>
      <label className="text-sm font-medium text-slate-700">
        Details
        <textarea
          rows={4}
          value={form.details}
          onChange={(event) => update('details', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder={form.mode === 'request' ? 'Device type, accessories, needed by date' : 'Symptoms, urgency, location, steps tried'}
          required
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Send className="h-4 w-4" />
          Submit to IT
        </button>
        <a
          href={`mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent('IT Help Request')}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          <Mail className="h-4 w-4" />
          Email the Help Desk
        </a>
      </div>
    </form>
  );
};

const RequestList = ({ requests }) => (
  <div className="space-y-4">
    {requests.map((req) => (
      <div key={req.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-slate-500">
          <span>{req.mode === 'request' ? 'Device request' : 'Issue report'}</span>
          <span>{req.timestamp}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{req.employee}</p>
            <p className="text-xs text-slate-500">{req.department || 'UDS Team'}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              /pending/i.test(req.status)
                ? 'bg-amber-50 text-amber-700'
                : /review/i.test(req.status)
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {req.status}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">{req.details}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>{req.email}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1 text-slate-600">
            <HistoryDot status={req.status} />
            Status updated
          </span>
        </div>
      </div>
    ))}
    {requests.length === 0 && <p className="text-sm text-slate-500">No requests yet. Submit one above to see it here.</p>}
  </div>
);

const HistoryDot = ({ status }) => {
  const tone = /pending/i.test(status) ? 'bg-amber-500' : /review/i.test(status) ? 'bg-blue-500' : 'bg-emerald-500';
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone}`} />;
};

const GuideCard = ({ title, body, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-slate-900 text-white p-3">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{body}</p>
      </div>
    </div>
  </div>
);

function App() {
  const [requests, setRequests] = useState(initialRequests);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => /pending/i.test(r.status)).length;
    const review = requests.filter((r) => /review/i.test(r.status)).length;
    const closed = requests.filter((r) => /fulfill|close|done/i.test(r.status)).length;
    return { total, pending, review, closed };
  }, [requests]);

  const handleSubmit = (payload) => {
    const now = new Date();
    const entry = {
      id: `req-${now.getTime()}`,
      ...payload,
      status: payload.mode === 'request' ? 'Pending' : 'In review',
      timestamp: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setRequests((prev) => [entry, ...prev]);
    sendHelpDeskEmail(entry);
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-slate-400">UDS HelpDesk Portal</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Get IT help, request hardware, report an issue</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Employees can contact the IT department, submit requests, and track responses from one place. For urgent incidents, call the Help Desk immediately.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Employee-facing
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <Check className="h-4 w-4" />
                  Triaged by IT
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href={`mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent('Open HelpDesk Ticket')}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <Mail className="h-4 w-4" />
                Email the Help Desk
              </a>
              <a
                href="tel:+17175553000"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <PhoneCall className="h-4 w-4" />
                Call for urgent issues
              </a>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <StatCard label="Total requests" value={stats.total} tone="slate" />
            <StatCard label="Pending" value={stats.pending} tone="amber" />
            <StatCard label="In review" value={stats.review} tone="blue" />
            <StatCard label="Closed" value={stats.closed} tone="emerald" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        <section className="mb-8 grid gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-slate-400">Submit a request</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Tell us what you need</h2>
            <p className="mt-1 text-sm text-slate-600">Your request goes straight to the IT department. We’ll email you updates.</p>
            <div className="mt-4">
              <RequestForm onSubmit={handleSubmit} />
            </div>
          </div>

          <div className="space-y-3">
            {selfServiceGuides.map((guide) => (
              <GuideCard key={guide.title} {...guide} />
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm text-sm text-slate-700">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2rem] text-slate-400">
                <RefreshCw className="h-4 w-4" />
                Self-service
              </div>
              <p className="mt-2 text-sm text-slate-700">Need to check device status or licenses? IT will share a link to the asset portal when needed.</p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3rem] text-slate-400">Queue</p>
                <h3 className="text-lg font-semibold text-slate-900">Latest requests</h3>
                <p className="text-sm text-slate-600">New submissions appear instantly. We’ll email when status changes.</p>
              </div>
              <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">{requests.length} in queue</span>
            </div>
            <div className="mt-4">
              <RequestList requests={requests} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">
              <ArrowRightLeft className="h-4 w-4" />
              What to expect
            </div>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li>• You’ll get a confirmation email after submitting.</li>
              <li>• IT prioritizes urgent incidents first.</li>
              <li>• Add screenshots or error text in the details field for faster triage.</li>
            </ul>
            <div className="mt-4 space-y-3">
              {faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="text-sm font-semibold text-slate-900">{item.q}</p>
                  <p className="text-xs text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35rem] text-white/60">Need the IT dashboard?</p>
              <p className="text-lg font-semibold text-white">IT department tools live in the Asset Management app.</p>
              <p className="text-sm text-white/80">Inventory, vendors, and lifecycle analytics are managed separately by IT.</p>
            </div>
            <a
              href="../"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              <Laptop className="h-4 w-4" />
              Open IT dashboard
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
