import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  CalendarClock,
  CheckCircle2,
  Headset,
  Laptop,
  Lightbulb,
  Mail,
  PenLine,
  PhoneCall,
  Plug,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from 'lucide-react';

const HELP_DESK_EMAIL = 'ITHelpDesk@udservices.org';

const knowledgeBase = [
  { id: 'kb-1', title: 'Reset your UDS password', summary: 'Use the self-service reset portal and add a backup method.', tags: ['account', 'password'], minutes: 3 },
  { id: 'kb-2', title: 'Connect to VPN offsite', summary: 'How to launch GlobalProtect, pick the UDS gateway, and verify MFA.', tags: ['remote', 'vpn'], minutes: 4 },
  { id: 'kb-3', title: 'Request new hardware', summary: 'Choose laptop, dock, monitors, and accessories with lead times.', tags: ['hardware', 'request'], minutes: 5 },
  { id: 'kb-4', title: 'Report a phishing email', summary: 'Forward to IT, then block and delete. What screenshots help most.', tags: ['security'], minutes: 2 },
  { id: 'kb-5', title: 'Teams and Zoom audio fixes', summary: 'Check input/output devices, restart drivers, and run call health.', tags: ['audio', 'meetings'], minutes: 4 },
];

const serviceCatalog = [
  { id: 'svc-1', title: 'Hardware request', desc: 'Laptop, dock, monitors, adapters, or a wheelchair-mounted tray.', icon: Laptop, tone: 'primary' },
  { id: 'svc-2', title: 'Software/access', desc: 'New app access, license upgrades, VPN, shared drives, or MFA help.', icon: ShieldCheck, tone: 'neutral' },
  { id: 'svc-3', title: 'Report an issue', desc: 'Broken device, error pop-up, slow Wi‑Fi, or something just stopped.', icon: AlertTriangle, tone: 'warning' },
  { id: 'svc-4', title: 'Schedule time', desc: 'Book a setup or training slot with IT for you or your team.', icon: CalendarClock, tone: 'info' },
];

const systemStatus = [
  { name: 'Email & MFA', state: 'Operational', color: '#16a34a' },
  { name: 'VPN / Remote Access', state: 'Degraded', color: '#f59e0b' },
  { name: 'File Shares', state: 'Operational', color: '#16a34a' },
  { name: 'Printing', state: 'Investigating', color: '#f97316' },
];

const buildHelpDeskEmailBody = ({ name, email, department, urgency, topic, details }) => {
  const rows = [
    `Name: ${name || 'N/A'}`,
    `Email: ${email || 'N/A'}`,
    `Department/Location: ${department || 'N/A'}`,
    `Urgency: ${urgency || 'Normal'}`,
    `Topic: ${topic || 'N/A'}`,
    '',
    `Details:`,
    details || 'N/A',
  ];
  return rows.join('\n');
};

const sendHelpDeskEmail = (payload) => {
  if (typeof window === 'undefined') return;
  const subject = `IT Help Request from ${payload.name || 'UDS employee'}`;
  const body = buildHelpDeskEmailBody(payload);
  const href = `mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
};

const starterMessages = [
  'Reset my Windows password',
  'VPN keeps disconnecting at home',
  'I need a laptop and dock for a new hire',
  'Teams can’t find my microphone',
];

const initialRequests = [
  { id: 'REQ-4221', type: 'Request', name: 'Jessie Rivera', topic: 'New laptop for onboarding', status: 'Pending', timestamp: 'Today 9:12a' },
  { id: 'REQ-4219', type: 'Issue', name: 'Pat Miles', topic: 'VPN drops every 20 minutes', status: 'In Review', timestamp: 'Yesterday' },
  { id: 'REQ-4215', type: 'Request', name: 'Claire V.', topic: 'Add to Finance shared drive', status: 'Closed', timestamp: 'Mon' },
];

const quickHelp = [
  { title: 'Password or MFA', body: 'Locked out or code not working? Try the reset portal and add a backup method.', icon: ShieldCheck },
  { title: 'Internet / Wi‑Fi', body: 'If Wi‑Fi is slow, restart the device, forget/rejoin UDS-Secure, then test speed.', icon: WifiOff },
  { title: 'VPN remote access', body: 'Open GlobalProtect, select the UDS gateway, and confirm Duo on your phone.', icon: Plug },
  { title: 'Printer jams / toner', body: 'Share the printer ID and location. Include a photo of any error code.', icon: Server },
];

const InlineTag = ({ children }) => <span className="chip">{children}</span>;

const ServiceCard = ({ item }) => {
  const Icon = item.icon;
  return (
    <div className="card service-card">
      <span className="service-icon">
        <Icon size={20} />
      </span>
      <div style={{ flex: 1 }}>
        <div className="list-inline" style={{ marginBottom: 4 }}>
          <InlineTag>{item.tone === 'warning' ? 'Priority' : 'Self-service first'}</InlineTag>
        </div>
        <h3 style={{ margin: '4px 0', fontSize: 16 }}>{item.title}</h3>
        <p style={{ margin: 0, color: '#55607a' }}>{item.desc}</p>
      </div>
      <ArrowRight size={18} color="#0e1117" />
    </div>
  );
};

const ArticleCard = ({ article }) => (
  <div className="card article-card">
    <div className="list-inline" style={{ marginBottom: 6 }}>
      {article.tags.map((tag) => (
        <InlineTag key={tag}>{tag}</InlineTag>
      ))}
    </div>
    <h4 style={{ fontSize: 15 }}>{article.title}</h4>
    <p>{article.summary}</p>
    <div className="list-inline">
      <span className="badge">
        <BookOpen size={14} />
        {article.minutes} min read
      </span>
      <span className="badge" style={{ background: '#e0f2fe', color: '#075985' }}>
        <Sparkles size={14} />
        Self help
      </span>
    </div>
  </div>
);

const RequestRow = ({ request }) => {
  const tone =
    request.status === 'Closed' ? '#16a34a' : request.status === 'In Review' ? '#2563eb' : '#f59e0b';
  return (
    <div className="card request-row">
      <div>
        <div className="list-inline">
          <InlineTag>{request.type}</InlineTag>
          <InlineTag className="mono">{request.id}</InlineTag>
        </div>
        <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{request.topic}</p>
        <p style={{ margin: '4px 0 0', color: '#55607a' }}>{request.name}</p>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="pill" style={{ background: '#f8fafc' }}>
          <span className="status-dot" style={{ background: tone }} />
          {request.status}
        </span>
        <span style={{ color: '#55607a', fontSize: 12 }}>{request.timestamp}</span>
      </div>
      <button className="btn btn-ghost" type="button">
        View
      </button>
    </div>
  );
};

const ChatMessage = ({ role, text }) => (
  <div style={{ display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start' }}>
    <div className={`chat-bubble ${role}`}>
      {role === 'bot' && (
        <div className="list-inline" style={{ marginBottom: 6 }}>
          <InlineTag>
            <Bot size={14} />
            UDS Tech Assist
          </InlineTag>
        </div>
      )}
      <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
    </div>
  </div>
);

const buildAiReply = (text) => {
  const input = text.toLowerCase();
  if (input.includes('password')) {
    return 'Got it. For password resets: open the UDS self-service reset page, choose “I forgot my password”, and approve the Duo prompt. If you cannot receive Duo, reply with “no mfa” and I will route to IT with urgency.';
  }
  if (input.includes('vpn')) {
    return 'Let’s steady the VPN. Confirm you’re on UDS-Secure or wired, then open GlobalProtect and select the “UDS-Gateway”. If disconnects continue, include the exact time and I will open a ticket with logs.';
  }
  if (input.includes('laptop') || input.includes('hardware')) {
    return 'I can start a laptop request. Share who it’s for, needed-by date, and whether you need a dock/monitors. I will summarize and send to IT to stage hardware.';
  }
  if (input.includes('printer')) {
    return 'For printing issues: share the printer ID and location, and a photo of the error panel if possible. I’ll package this for the Help Desk.';
  }
  return 'I’ll help route this. Please add details like device type, urgency, and where you’re working (onsite/remote). I can also draft a ticket for IT.';
};

function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    topic: '',
    urgency: 'Normal',
    details: '',
  });
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hi! I’m the UDS Tech Guide. Tell me what you need—password help, VPN issues, or hardware requests.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return knowledgeBase;
    return knowledgeBase.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.summary.toLowerCase().includes(term) ||
        a.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }, [search]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.topic || !form.details) return;
    const now = new Date();
    const entry = {
      id: `REQ-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: form.topic.toLowerCase().includes('issue') ? 'Issue' : 'Request',
      name: form.name,
      topic: form.topic,
      status: 'Pending',
      timestamp: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setRequests((prev) => [entry, ...prev]);
    setForm((prev) => ({ ...prev, topic: '', details: '' }));
    sendHelpDeskEmail({
      name: form.name,
      email: form.email,
      department: form.department,
      urgency: form.urgency,
      topic: form.topic,
      details: form.details,
    });
  };

  const sendChat = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: 'bot', text: buildAiReply(trimmed) }]);
    }, 150);
  };

  return (
    <div className="helpdesk-app">
      <div className="shell">
        <header className="hero">
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 12 }}>
            <span className="pill">
              <Sparkles size={16} />
              UDS Tech Help Center
            </span>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>Answers, tickets, and live IT support for every UDS employee.</h1>
            <p style={{ margin: 0, maxWidth: 720, color: '#334155' }}>
              Start with self-help, ask the AI guide, or send a request to IT. For urgent outages, call immediately—everything else can be logged here.
            </p>
            <div className="cta-row">
              <button className="btn btn-primary" type="button" onClick={() => document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <Send size={18} />
                Submit a request
              </button>
              <a className="btn btn-ghost" href={`mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent('Open Help Desk Ticket')}`}>
                <Mail size={18} />
                Email IT
              </a>
              <a className="btn btn-ghost" href="tel:+17175553000">
                <PhoneCall size={18} />
                Call for urgent issues
              </a>
            </div>
            <div className="cta-strip">
              <div className="cta-tile">
                <div className="list-inline">
                  <InlineTag>Service status</InlineTag>
                </div>
                {systemStatus.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
                    <span>{item.name}</span>
                    <span className="pill" style={{ background: '#fff' }}>
                      <span className="status-dot" style={{ background: item.color }} />
                      {item.state}
                    </span>
                  </div>
                ))}
              </div>
              <div className="cta-tile">
                <div className="list-inline">
                  <InlineTag>Response targets</InlineTag>
                </div>
                <p style={{ margin: '6px 0 0', color: '#0e1117', fontWeight: 700 }}>Critical incidents: immediate</p>
                <p style={{ margin: '4px 0 0', color: '#55607a' }}>New tickets acknowledged within 1 business day.</p>
              </div>
              <div className="cta-tile">
                <div className="list-inline">
                  <InlineTag>Need the IT dashboard?</InlineTag>
                </div>
                <p style={{ margin: '6px 0 0', color: '#55607a' }}>Inventory and admin tools stay in the Asset Management app for IT staff.</p>
                <a className="btn btn-ghost" href="../">
                  <Laptop size={16} />
                  Open IT dashboard
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="grid" style={{ marginTop: 24, gap: 18 }}>
          <section className="grid" style={{ gridTemplateColumns: '1.35fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="section-title">Self help</div>
              <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
                <label className="label">
                  Search tips or issues
                  <input
                    className="input"
                    placeholder="Try “VPN disconnects” or “reset password”"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                  {filteredArticles.length === 0 && <p style={{ color: '#55607a' }}>No matches—ask the AI guide or submit a ticket.</p>}
                </div>
              </div>
            </div>
            <div className="card" style={{ display: 'grid', gap: 10 }}>
              <div className="section-title">Quick fixes</div>
              <div className="grid" style={{ gap: 10 }}>
                {quickHelp.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="card" style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="service-icon">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px' }}>{item.title}</h4>
                          <p style={{ margin: 0, color: '#55607a' }}>{item.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid" style={{ gridTemplateColumns: '1fr 0.9fr', gap: 16 }}>
            <div className="card">
              <div className="section-title">Start a request</div>
              <h2 style={{ margin: '6px 0 8px' }}>Tell IT what you need</h2>
              <p style={{ margin: '0 0 12px', color: '#55607a' }}>Use this form for non-urgent requests. We will acknowledge within 1 business day.</p>
              <form id="request-form" onSubmit={handleFormSubmit} className="grid" style={{ gap: 12 }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="label">
                    Name
                    <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                  </label>
                  <label className="label">
                    Email
                    <input className="input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                  </label>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label className="label">
                    Department / Location
                    <input className="input" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} placeholder="Finance, Lancaster" />
                  </label>
                  <label className="label">
                    Urgency
                    <select className="select" value={form.urgency} onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value }))}>
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent (service down)</option>
                    </select>
                  </label>
                </div>
                <label className="label">
                  What do you need?
                  <input
                    className="input"
                    value={form.topic}
                    onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                    placeholder="Example: VPN keeps disconnecting"
                    required
                  />
                </label>
                <label className="label">
                  Details
                  <textarea
                    className="textarea"
                    value={form.details}
                    onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                    placeholder="Include device, urgency, steps tried, and screenshots if any."
                    required
                  />
                </label>
                <div className="cta-row">
                  <button className="btn btn-primary" type="submit">
                    <Send size={18} />
                    Submit to IT
                  </button>
                  <a className="btn btn-ghost" href={`mailto:${HELP_DESK_EMAIL}?subject=${encodeURIComponent('IT Help Request')}`}>
                    <Mail size={18} />
                    Email instead
                  </a>
                </div>
              </form>
            </div>

            <div className="card chat-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="service-icon">
                    <Bot size={18} />
                  </span>
                  <div>
                    <div className="section-title" style={{ letterSpacing: '0.2em' }}>
                      AI Tech Guide
                    </div>
                    <p style={{ margin: 0, color: '#55607a', fontSize: 14 }}>Ask about issues, hardware, or policies. I’ll draft a ticket if needed.</p>
                  </div>
                </div>
                <InlineTag>Beta</InlineTag>
              </div>
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <ChatMessage key={`${msg.role}-${idx}-${msg.text.slice(0, 8)}`} role={msg.role} text={msg.text} />
                ))}
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                <div className="list-inline">
                  {starterMessages.map((prompt) => (
                    <button key={prompt} className="btn btn-ghost" type="button" onClick={() => sendChat(prompt)}>
                      <Sparkles size={14} />
                      {prompt}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder="Type your question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChat(chatInput);
                      }
                    }}
                  />
                  <button className="btn btn-primary" type="button" onClick={() => sendChat(chatInput)}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card">
              <div className="section-title">Service catalog</div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {serviceCatalog.map((item) => (
                  <ServiceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div className="card">
              <div className="section-title">Your recent requests</div>
              <p style={{ margin: '6px 0 12px', color: '#55607a' }}>We email updates as statuses change. Newest first.</p>
              <div className="requests-list">
                {requests.map((req) => (
                  <RequestRow key={req.id} request={req} />
                ))}
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 12 }}>
                <div className="card" style={{ background: '#0f172a', color: 'white' }}>
                  <div className="list-inline">
                    <InlineTag>
                      <CheckCircle2 size={14} />
                      SLA
                    </InlineTag>
                  </div>
                  <p style={{ margin: '8px 0 0' }}>Standard requests</p>
                  <p style={{ margin: 0, opacity: 0.8 }}>Acknowledged in 1 business day.</p>
                </div>
                <div className="card" style={{ background: '#ecfeff', borderColor: '#a5f3fc' }}>
                  <div className="list-inline">
                    <InlineTag>
                      <Lightbulb size={14} />
                      Tips
                    </InlineTag>
                  </div>
                  <p style={{ margin: '8px 0 0' }}>Add screenshots</p>
                  <p style={{ margin: 0, color: '#0e1117' }}>Include error text or steps for faster triage.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title">What to expect</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 10 }}>
              <div className="card" style={{ background: '#f8fafc' }}>
                <div className="list-inline">
                  <InlineTag>
                    <Headset size={14} />
                    Support
                  </InlineTag>
                </div>
                <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>Live help</p>
                <p style={{ margin: 0, color: '#55607a' }}>Urgent or down? Call the Help Desk so we can jump in.</p>
              </div>
              <div className="card" style={{ background: '#fdf6b2', borderColor: '#fde68a' }}>
                <div className="list-inline">
                  <InlineTag>
                    <PenLine size={14} />
                    Tickets
                  </InlineTag>
                </div>
                <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>Clear details</p>
                <p style={{ margin: 0, color: '#7c2d12' }}>Include device, urgency, and steps tried to avoid delays.</p>
              </div>
              <div className="card" style={{ background: '#ecfdf3', borderColor: '#bbf7d0' }}>
                <div className="list-inline">
                  <InlineTag>
                    <ShieldCheck size={14} />
                    Security
                  </InlineTag>
                </div>
                <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>Phishing?</p>
                <p style={{ margin: 0, color: '#166534' }}>Forward to {HELP_DESK_EMAIL} then delete. Do not click links.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
