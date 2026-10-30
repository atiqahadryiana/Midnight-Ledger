import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ArrowDownUp, BriefcaseBusiness, CalendarDays, Check, ChevronDown,
  Download, ExternalLink, FileText, Grid2X2, List, Moon, Pencil, Plus, Search,
  Sun, Trash2, Upload, UserRound, X
} from 'lucide-react';

const STATUSES = ['Wishlist', 'Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected', 'Ghosted'];
const ACTIVE = new Set(['Applied', 'Online Assessment', 'Interview']);
const STORAGE_KEY = 'midnight-ledger-applications-v1';
const THEME_KEY = 'midnight-ledger-theme';

const starterData = [
  { id: 'sample-1', company: 'Northstar Labs', role: 'Product Design Intern', location: 'Singapore · Hybrid', link: 'https://example.com', dateApplied: new Date(Date.now() - 8 * 864e5).toISOString().slice(0, 10), status: 'Interview', contact: 'Maya Chen', notes: 'Portfolio review with the design lead next week.' },
  { id: 'sample-2', company: 'Arc & Co.', role: 'Strategy Intern', location: 'Remote', link: '', dateApplied: new Date(Date.now() - 16 * 864e5).toISOString().slice(0, 10), status: 'Applied', contact: '', notes: 'Sent a tailored cover letter.' },
  { id: 'sample-3', company: 'Fieldwork Studio', role: 'Research Intern', location: 'Kuala Lumpur', link: 'https://example.com', dateApplied: new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10), status: 'Online Assessment', contact: '', notes: 'Assessment due Friday.' }
];

const blank = () => ({ company: '', role: '', location: '', link: '', dateApplied: new Date().toISOString().slice(0, 10), status: 'Wishlist', contact: '', notes: '' });
const daysSince = date => Math.max(0, Math.floor((new Date().setHours(0,0,0,0) - new Date(`${date}T00:00:00`)) / 864e5));
const prettyDate = date => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));

function IconButton({ label, children, ...props }) {
  return <button className="icon-button" aria-label={label} title={label} {...props}>{children}</button>;
}

function StatusBadge({ status }) {
  return <span className="status-badge" data-status={status}><i />{status}</span>;
}

function ApplicationCard({ app, onEdit, onDelete, view }) {
  const days = daysSince(app.dateApplied);
  return (
    <article className={`application-card ${view === 'list' ? 'is-list' : ''}`}>
      <div className="card-main">
        <div className="card-topline"><StatusBadge status={app.status} />
          <div className="card-actions"><IconButton label={`Edit ${app.company}`} onClick={() => onEdit(app)}><Pencil size={15}/></IconButton><IconButton label={`Delete ${app.company}`} onClick={() => onDelete(app)}><Trash2 size={15}/></IconButton></div>
        </div>
        <h3>{app.company}</h3><p className="role">{app.role}</p>
        <div className="meta"><span>{app.location || 'Location not set'}</span><span>Applied {prettyDate(app.dateApplied)}</span></div>
        {(app.contact || app.notes) && <div className="card-detail">{app.contact && <span><UserRound size={14}/> {app.contact}</span>}{app.notes && <p>{app.notes}</p>}</div>}
      </div>
      <div className="waiting">
        <span className="waiting-number">{days}</span><span className="waiting-label">{days === 1 ? 'day' : 'days'} waiting</span>
        {app.status === 'Applied' && days >= 14 && <span className="follow-up">Time to follow up</span>}
        {app.link && <a href={app.link} target="_blank" rel="noreferrer">View application <ExternalLink size={13}/></a>}
      </div>
    </article>
  );
}

function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || blank());
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);
  useEffect(() => { firstRef.current?.focus(); }, []);
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const submit = e => {
    e.preventDefault();
    const next = Object.fromEntries(['company','role','dateApplied'].filter(k => !form[k]).map(k => [k, 'Required']));
    if (form.link && !/^https?:\/\//i.test(form.link)) next.link = 'Use a full link beginning with http:// or https://';
    setErrors(next); if (Object.keys(next).length) return;
    onSave(form);
  };
  const field = (key, label, props = {}) => <label><span>{label}{props.optional && <small> (optional)</small>}</span><input ref={key === 'company' ? firstRef : null} value={form[key]} onChange={e => set(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} {...props}/>{errors[key] && <em id={`${key}-error`}>{errors[key]}</em>}</label>;
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <header><div><p className="kicker">Ledger entry</p><h2 id="form-title">{initial ? 'Edit application' : 'Log an application'}</h2></div><IconButton label="Close form" onClick={onClose}><X size={20}/></IconButton></header>
      <form onSubmit={submit}>
        <div className="form-grid">{field('company','Company')}{field('role','Role')}{field('location','Location',{optional:true})}{field('dateApplied','Date applied',{type:'date'})}
          <label><span>Status</span><select value={form.status} onChange={e => set('status',e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></label>
          {field('contact','Contact person',{optional:true})}
        </div>
        {field('link','Application link',{optional:true,type:'url',placeholder:'https://'})}
        <label><span>Notes <small>(optional)</small></span><textarea value={form.notes} onChange={e => set('notes',e.target.value)} rows="3" placeholder="Interview details, reminders, or context…"/></label>
        <footer><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit"><Check size={17}/>{initial ? 'Save changes' : 'Add to ledger'}</button></footer>
      </form>
    </section>
  </div>;
}

export default function App() {
  const [apps, setApps] = useState(() => { try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : starterData; } catch { return starterData; } });
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [view, setView] = useState('board'); const [search, setSearch] = useState(''); const [filter, setFilter] = useState('All'); const [sort, setSort] = useState('date-desc');
  const [editing, setEditing] = useState(undefined); const [modalOpen, setModalOpen] = useState(false); const [toast, setToast] = useState('');
  const fileRef = useRef(null);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); }, [apps]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }, [theme]);
  useEffect(() => { if (!modalOpen) return; const close = e => e.key === 'Escape' && setModalOpen(false); addEventListener('keydown', close); return () => removeEventListener('keydown', close); }, [modalOpen]);
  const tell = message => { setToast(message); setTimeout(() => setToast(''), 2600); };
  const visible = useMemo(() => apps.filter(a => (filter === 'All' || a.status === filter) && `${a.company} ${a.role} ${a.location} ${a.contact}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === 'company' ? a.company.localeCompare(b.company) : sort === 'days' ? daysSince(b.dateApplied)-daysSince(a.dateApplied) : new Date(b.dateApplied)-new Date(a.dateApplied)), [apps, filter, search, sort]);
  const metrics = useMemo(() => {
    const applied = apps.filter(a => a.status !== 'Wishlist'); const waiting = applied.filter(a => ACTIVE.has(a.status));
    return [
      ['Total', apps.length, 'All entries'], ['Active', apps.filter(a => ACTIVE.has(a.status)).length, 'In progress'], ['Interviews', apps.filter(a => a.status === 'Interview').length, 'Current'],
      ['Offers', apps.filter(a => a.status === 'Offer').length, 'Worth celebrating'], ['Rejections', apps.filter(a => a.status === 'Rejected').length, 'Closed'], ['Avg. wait', waiting.length ? Math.round(waiting.reduce((n,a) => n + daysSince(a.dateApplied),0)/waiting.length) : 0, 'Days active']
    ];
  }, [apps]);
  const save = form => { setApps(old => editing ? old.map(a => a.id === editing.id ? {...form,id:a.id} : a) : [{...form,id:crypto.randomUUID()},...old]); setModalOpen(false); tell(editing ? 'Application updated' : 'Application added'); };
  const remove = app => { if (confirm(`Delete ${app.company} from your ledger?`)) { setApps(old => old.filter(a => a.id !== app.id)); tell('Application deleted'); } };
  const exportData = () => { const blob = new Blob([JSON.stringify(apps,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`midnight-ledger-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); tell('Backup exported'); };
  const importData = async e => { try { const parsed=JSON.parse(await e.target.files[0].text()); if(!Array.isArray(parsed)) throw new Error(); setApps(parsed); tell(`${parsed.length} applications imported`); } catch { tell('That file is not a valid ledger backup'); } e.target.value=''; };
  const openNew=()=>{setEditing(undefined);setModalOpen(true)}; const openEdit=a=>{setEditing(a);setModalOpen(true)};

  return <div className="app-shell">
    <header className="site-header"><a className="brand" href="#top"><span><Moon size={20}/></span><div><strong>Midnight Ledger</strong><small>every application, accounted for.</small></div></a>
      <nav><button className="text-button" onClick={exportData}><Download size={16}/>Export</button><button className="text-button" onClick={()=>fileRef.current.click()}><Upload size={16}/>Import</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={importData}/><IconButton label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</IconButton><button className="button primary" onClick={openNew}><Plus size={18}/>Add application</button></nav>
    </header>
    <main id="top">
      <section className="intro"><div><p className="kicker"><CalendarDays size={14}/> Your application season</p><h1>Keep every opportunity <em>in view.</em></h1><p>A quiet record of where you applied, what comes next, and when it’s time to follow up.</p></div><div className="today"><span>{new Intl.DateTimeFormat('en',{weekday:'long'}).format(new Date())}</span><strong>{new Intl.DateTimeFormat('en',{day:'2-digit'}).format(new Date())}</strong><span>{new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(new Date())}</span></div></section>
      <section className="metrics" aria-label="Application summary">{metrics.map(([label,value,note],i)=><article key={label} className={i===0?'primary-metric':''}><p>{label}</p><strong>{value}</strong><span>{note}</span></article>)}</section>
      <section className="workspace">
        <div className="section-heading"><div><p className="kicker"><Archive size={14}/> The ledger</p><h2>Your applications</h2></div><span>{visible.length} {visible.length===1?'entry':'entries'} shown</span></div>
        <div className="toolbar"><label className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, role, location…" aria-label="Search applications"/></label>
          <label className="select-wrap"><span className="sr-only">Filter by status</span><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={15}/></label>
          <label className="select-wrap"><ArrowDownUp size={15}/><span className="sr-only">Sort applications</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="date-desc">Newest first</option><option value="company">Company A–Z</option><option value="days">Longest waiting</option></select><ChevronDown size={15}/></label>
          <div className="view-toggle" aria-label="View options"><button className={view==='board'?'active':''} onClick={()=>setView('board')} aria-label="Board view"><Grid2X2 size={17}/></button><button className={view==='list'?'active':''} onClick={()=>setView('list')} aria-label="List view"><List size={18}/></button></div>
        </div>
        {visible.length === 0 ? <div className="empty"><div><FileText size={28}/></div><h3>Nothing here yet.</h3><p>{apps.length ? 'No applications match this view. Try clearing your filters.' : 'Log your first application and begin the record.'}</p><button className="button secondary" onClick={apps.length?()=>{setSearch('');setFilter('All')}:openNew}>{apps.length?'Clear filters':'Log an application'}</button></div> : view === 'list' ? <div className="list-view">{visible.map(a=><ApplicationCard key={a.id} app={a} view="list" onEdit={openEdit} onDelete={remove}/>)}</div> : <div className="board">{STATUSES.map(status=>{const cards=visible.filter(a=>a.status===status); return <section className="board-column" key={status}><header><StatusBadge status={status}/><span>{cards.length}</span></header><div>{cards.map(a=><ApplicationCard key={a.id} app={a} onEdit={openEdit} onDelete={remove}/>)}{!cards.length&&<p className="column-empty">No entries</p>}</div></section>})}</div>}
      </section>
    </main>
    <footer className="site-footer"><span><Moon size={14}/> Midnight Ledger</span><span>Your data stays in this browser.</span></footer>
    {modalOpen&&<ApplicationForm initial={editing} onSave={save} onClose={()=>setModalOpen(false)}/>} {toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}
  </div>;
}
