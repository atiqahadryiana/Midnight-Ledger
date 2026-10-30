import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Clock3,
  CircleUserRound,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Ellipsis,
  Grid2X2,
  Link as LinkIcon,
  List,
  MapPin,
  MessageSquare,
  Moon,
  Pencil,
  Plus,
  Search,
  Send,
  Sun,
  Trash2,
  Upload,
  X,
} from "lucide-react";
const STATUSES = [
    "Wishlist",
    "Applied",
    "Online Assessment",
    "Interview",
    "Offer",
    "Rejected",
    "Ghosted",
  ],
  ACTIVE = new Set(["Applied", "Online Assessment", "Interview"]);
const STORAGE_KEY = "midnight-ledger-applications-v1",
  THEME_KEY = "midnight-ledger-theme",
  today = () => new Date().toISOString().slice(0, 10);
const GITHUB_USERNAME =
  import.meta.env.VITE_GITHUB_USERNAME || "atiqahadryiana";
const FEEDBACK_CATEGORIES = ["Idea", "Bug", "Praise", "Other"];
const FEEDBACK_PLACEHOLDERS = {
  Idea: "I wish it could...",
  Bug: "What happened, and what did you expect?",
  Praise: "What did you like?",
  Other: "Tell us anything.",
};
function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18a10.97 10.97 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.72 5.39-5.3 5.68.42.36.79 1.07.79 2.16v3.21c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}
const blank = () => ({
  company: "",
  role: "",
  location: "",
  link: "",
  dateApplied: today(),
  status: "Applied",
  contact: "",
  notes: "",
  followedUpAt: null,
});
const starterData = [
  {
    id: "sample-1",
    company: "Northstar Labs",
    role: "Product Design Intern",
    location: "Singapore · Hybrid",
    link: "https://example.com",
    dateApplied: new Date(Date.now() - 8 * 864e5).toISOString().slice(0, 10),
    status: "Interview",
    contact: "Maya Chen",
    notes: "Portfolio review with the design lead next week.",
  },
  {
    id: "sample-2",
    company: "Arc & Co.",
    role: "Strategy Intern",
    location: "Remote",
    link: "",
    dateApplied: new Date(Date.now() - 16 * 864e5).toISOString().slice(0, 10),
    status: "Applied",
    contact: "",
    notes: "Sent a tailored cover letter.",
  },
  {
    id: "sample-3",
    company: "Fieldwork Studio",
    role: "Research Intern",
    location: "Kuala Lumpur",
    link: "https://example.com",
    dateApplied: new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10),
    status: "Online Assessment",
    contact: "",
    notes: "Assessment due Friday.",
  },
];
const daysFrom = (date) => {
    const parsed = new Date(`${date}T00:00:00`);
    if (!date || Number.isNaN(parsed.getTime())) return 0;
    return Math.max(
      0,
      Math.floor((new Date().setHours(0, 0, 0, 0) - parsed) / 864e5),
    );
  },
  waitDays = (app) => daysFrom(app.followedUpAt || app.dateApplied),
  cleanApplication = ({ id, ...application }) => application,
  pretty = (date) => {
    const parsed = new Date(`${date}T00:00:00`);
    if (!date || Number.isNaN(parsed.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  };
function IconButton({ label, children, ...props }) {
  return (
    <button className="icon-button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
function StatusBadge({ status }) {
  return (
    <span className="status-badge" data-status={status}>
      <i />
      {status}
    </span>
  );
}
function ApplicationCard({ app, view, onOpen, onEdit, onDelete, onStatus }) {
  const days = waitDays(app),
    urgency =
      app.status === "Applied"
        ? days >= 14
          ? "urgent"
          : days >= 7
            ? "soon"
            : "calm"
        : "closed",
    stop = (e) => e.stopPropagation();
  return (
    <article
      className={`application-card ${view === "list" ? "is-list" : ""}`}
      data-status={app.status}
      draggable={view !== "list"}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", app.id)}
      onClick={() => onOpen(app)}
      tabIndex="0"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(app)}
    >
      <div className="card-main">
        <div className="card-topline">
          <StatusBadge status={app.status} />
          <div className="card-actions" onClick={stop}>
            <IconButton
              label={`Edit ${app.company}`}
              onClick={() => onEdit(app)}
            >
              <Pencil size={15} />
            </IconButton>
            <IconButton
              label={`Delete ${app.company}`}
              className="icon-button danger"
              onClick={() => onDelete(app)}
            >
              <Trash2 size={15} />
            </IconButton>
          </div>
        </div>
        <h3>{app.company}</h3>
        <p className="role">{app.role}</p>
        <div className="meta">
          <span>
            <MapPin size={13} />
            {app.location || "Location not set"}
          </span>
          <span>Applied {pretty(app.dateApplied)}</span>
        </div>
      </div>
      <div className="waiting" data-urgency={urgency}>
        <span className="waiting-number">{days}</span>
        <span className="waiting-label">
          {days === 1 ? "day" : "days"}
          <br />
          since {app.followedUpAt ? "follow-up" : "applied"}
        </span>
        {app.status === "Applied" && days >= 14 && (
          <span
            className="follow-up"
            title="No update in 14+ days. A short, polite email can help."
          >
            <Clock3 size={12} />
            time to follow up
          </span>
        )}
      </div>
      <div className="status-control" onClick={stop}>
        <label>
          <span className="sr-only">Change status for {app.company}</span>
          <select
            value={app.status}
            onChange={(e) => onStatus(app.id, e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={13} />
        </label>
      </div>
    </article>
  );
}
function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || blank()),
    [errors, setErrors] = useState({});
  const dialog = useRef(),
    first = useRef();
  useEffect(() => {
    first.current?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const n = [
        ...dialog.current.querySelectorAll("button,input,select,textarea"),
      ];
      if (e.shiftKey && document.activeElement === n[0]) {
        e.preventDefault();
        n.at(-1).focus();
      } else if (!e.shiftKey && document.activeElement === n.at(-1)) {
        e.preventDefault();
        n[0].focus();
      }
    };
    addEventListener("keydown", trap);
    return () => removeEventListener("keydown", trap);
  }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    const next = Object.fromEntries(
      ["company", "role"]
        .filter((k) => !form[k].trim())
        .map((k) => [k, "Required"]),
    );
    if (form.link && !/^https?:\/\//i.test(form.link))
      next.link = "Use a full link beginning with http:// or https://";
    setErrors(next);
    if (!Object.keys(next).length) onSave(form);
  };
  const field = (key, label, props = {}) => (
    <label>
      <span>
        {label}
        {!props.optional && <b className="required-dot" title="Required" />}
        {props.optional && <small> optional</small>}
      </span>
      <input
        ref={key === "company" ? first : null}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        {...props}
      />
      {errors[key] && <em>{errors[key]}</em>}
    </label>
  );
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={dialog}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <header>
          <div>
            <p className="kicker">Ledger entry</p>
            <h2 id="form-title">
              {initial ? "Edit application" : "Log an application"}
            </h2>
          </div>
          <IconButton label="Close form" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </header>
        <form onSubmit={submit}>
          <div className="form-fields">
            {field("company", "Company")}
            {field("role", "Role")}
            {field("location", "Location", { optional: true })}
            {field("link", "Application link", {
              optional: true,
              type: "url",
              placeholder: "https://",
            })}
            {field("dateApplied", "Date applied", { type: "date" })}
            <label>
              <span>
                Status
                <b className="required-dot" />
              </span>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {field("contact", "Contact person", { optional: true })}
            <label>
              <span>
                Notes <small>optional</small>
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows="3"
                placeholder="Interview details, reminders, or context…"
              />
            </label>
          </div>
          <footer>
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button primary" type="submit">
              <Check size={17} />
              {initial ? "Save changes" : "Log application"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
function DetailDrawer({
  app,
  onClose,
  onEdit,
  onDelete,
  onStatus,
  onFollowUp,
}) {
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header>
          <StatusBadge status={app.status} />
          <IconButton label="Close details" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </header>
        <div className="drawer-body">
          <p className="kicker">Application detail</p>
          <h2 id="detail-title">{app.company}</h2>
          <p className="drawer-role">{app.role}</p>
          <div className="detail-days">
            <strong>{waitDays(app)}</strong>
            <span>
              days since {app.followedUpAt ? "last follow-up" : "applied"}
            </span>
          </div>
          <dl>
            <div>
              <dt>Location</dt>
              <dd>{app.location || "Not set"}</dd>
            </div>
            <div>
              <dt>Date applied</dt>
              <dd>{pretty(app.dateApplied)}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{app.contact || "Not set"}</dd>
            </div>
          </dl>
          {app.notes && (
            <section>
              <h3>Notes</h3>
              <p>{app.notes}</p>
            </section>
          )}
          {app.link && (
            <a
              className="button secondary full"
              href={app.link}
              target="_blank"
              rel="noreferrer"
            >
              <LinkIcon size={16} />
              Open application
              <ExternalLink size={14} />
            </a>
          )}
          <label className="drawer-status">
            <span>Change status</span>
            <select
              value={app.status}
              onChange={(e) => onStatus(app.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {app.status === "Applied" && (
            <button
              className="button secondary full"
              onClick={() => onFollowUp(app.id)}
            >
              <Clock3 size={16} />
              Mark as followed up today
            </button>
          )}
        </div>
        <footer>
          <button
            className="button danger-button"
            onClick={() => onDelete(app)}
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button className="button primary" onClick={() => onEdit(app)}>
            <Pencil size={16} />
            Edit application
          </button>
        </footer>
      </aside>
    </div>
  );
}

function AppFooter({ onFeedback }) {
  return (
    <footer className={`site-footer ${onFeedback ? "" : "auth-footer"}`}>
      <span>
        <Moon size={14} />
        Midnight Ledger
      </span>
      <div className="footer-links">
        {onFeedback && (
          <button type="button" onClick={onFeedback}>
            Feedback
          </button>
        )}
        <a
          className="developer-link"
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Developer on GitHub, opens in a new tab"
        >
          <GitHubIcon />
          Built by @{GITHUB_USERNAME}
        </a>
      </div>
    </footer>
  );
}

function FeedbackModal({ onClose }) {
  const [category, setCategory] = useState("Idea"),
    [message, setMessage] = useState(""),
    [rating, setRating] = useState(null),
    [includeInfo, setIncludeInfo] = useState(true),
    [sending, setSending] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  const dialog = useRef(),
    textarea = useRef();
  const requestClose = () => {
    if (message.trim() && !sent && !confirm("Discard your note?")) return;
    onClose();
  };
  useEffect(() => {
    textarea.current?.focus();
    const keys = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
      if (event.key !== "Tab") return;
      const nodes = [
        ...dialog.current.querySelectorAll("button,input,textarea"),
      ].filter((node) => !node.disabled);
      if (event.shiftKey && document.activeElement === nodes[0]) {
        event.preventDefault();
        nodes.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === nodes.at(-1)) {
        event.preventDefault();
        nodes[0].focus();
      }
    };
    addEventListener("keydown", keys);
    return () => removeEventListener("keydown", keys);
  }, [message, sent]);
  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [sent, onClose]);
  const submit = async (event) => {
    event.preventDefault();
    if (message.trim().length < 10 || message.length > 1000) return;
    setSending(true);
    setError("");
    try {
      await api("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          category,
          message: message.trim(),
          rating,
          includeInfo,
          page: includeInfo ? location.pathname : null,
          screenSize: includeInfo ? `${screen.width}x${screen.height}` : null,
        }),
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <div
      className="modal-backdrop feedback-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && requestClose()
      }
    >
      <section
        ref={dialog}
        className="modal feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        {sent ? (
          <div className="feedback-success">
            <Moon size={38} />
            <h2>Thank you.</h2>
            <p>Your note has been sent. It helps shape what comes next.</p>
            <button className="button secondary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <header>
              <div>
                <p className="kicker">A quiet note</p>
                <h2 id="feedback-title">Help improve Midnight Ledger</h2>
                <p>
                  Tell us what’s working and what isn’t. Every note gets read.
                </p>
              </div>
              <IconButton label="Close feedback" onClick={requestClose}>
                <X size={20} />
              </IconButton>
            </header>
            <form onSubmit={submit}>
              <div className="feedback-fields">
                <fieldset>
                  <legend>What’s this about?</legend>
                  <div className="category-pills">
                    {FEEDBACK_CATEGORIES.map((item) => (
                      <label key={item} data-category={item}>
                        <input
                          type="radio"
                          name="category"
                          value={item}
                          checked={category === item}
                          onChange={() => setCategory(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="feedback-message">
                  <span>Your message</span>
                  <textarea
                    ref={textarea}
                    rows="5"
                    maxLength="1000"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={FEEDBACK_PLACEHOLDERS[category]}
                    aria-describedby="feedback-counter feedback-error"
                  />
                  <small
                    id="feedback-counter"
                    className={message.length >= 900 ? "near-limit" : ""}
                    aria-live="polite"
                  >
                    {message.length} / 1000
                  </small>
                </label>
                <fieldset>
                  <legend>
                    How’s your experience? <small>optional</small>
                  </legend>
                  <div className="moon-rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="rating"
                          value={value}
                          checked={rating === value}
                          onChange={() => setRating(value)}
                        />
                        <Moon
                          size={25}
                          fill={rating >= value ? "currentColor" : "none"}
                        />
                        <span className="sr-only">{value} out of 5</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="include-info">
                  <input
                    type="checkbox"
                    checked={includeInfo}
                    onChange={(event) => setIncludeInfo(event.target.checked)}
                  />
                  <span>Include page and device info</span>
                </label>
                {error && (
                  <p
                    id="feedback-error"
                    className="feedback-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
              <footer>
                <button
                  type="button"
                  className="button secondary"
                  onClick={requestClose}
                >
                  Cancel
                </button>
                <button
                  className="button primary"
                  disabled={
                    sending ||
                    message.trim().length < 10 ||
                    message.length > 1000
                  }
                >
                  {sending ? (
                    <>
                      <i className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send note
                    </>
                  )}
                </button>
              </footer>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || "Network request failed");
  return body;
}

function LedgerApp({ user, onLogout }) {
  const [apps, setApps] = useState([]),
    [loading, setLoading] = useState(true),
    [theme, setTheme] = useState(
      () => localStorage.getItem(THEME_KEY) || "dark",
    ),
    [view, setView] = useState(() =>
      matchMedia("(max-width: 639px)").matches ? "list" : "board",
    ),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All"),
    [sort, setSort] = useState("date-desc"),
    [editing, setEditing] = useState(),
    [selected, setSelected] = useState(),
    [modalOpen, setModalOpen] = useState(false),
    [feedbackOpen, setFeedbackOpen] = useState(false),
    [toast, setToast] = useState("");
  const fileRef = useRef(),
    searchRef = useRef(),
    lastTrigger = useRef(),
    feedbackTrigger = useRef();
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let data = await api("/api/applications");
        const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (
          Array.isArray(legacy) &&
          legacy.length &&
          confirm("Import your existing applications to your account?")
        ) {
          await Promise.all(
            legacy.map(({ id, ...application }) =>
              api("/api/applications", {
                method: "POST",
                body: JSON.stringify(application),
              }),
            ),
          );
          localStorage.removeItem(STORAGE_KEY);
          data = await api("/api/applications");
        }
        if (active) setApps(data.applications);
      } catch (error) {
        if (active) tell(error.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  useEffect(() => {
    const keys = (e) => {
      if ((modalOpen || selected) && e.key === "Escape") {
        setModalOpen(false);
        setSelected(null);
        lastTrigger.current?.focus();
      }
      if (
        !modalOpen &&
        !selected &&
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (
        !modalOpen &&
        !selected &&
        e.key.toLowerCase() === "n" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        openNew(e.currentTarget);
      }
      if (
        !modalOpen &&
        !selected &&
        !feedbackOpen &&
        e.key.toLowerCase() === "f" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        feedbackTrigger.current = e.currentTarget;
        setFeedbackOpen(true);
      }
    };
    addEventListener("keydown", keys);
    return () => removeEventListener("keydown", keys);
  }, [modalOpen, selected, feedbackOpen]);
  const tell = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  };
  const visible = useMemo(
    () =>
      apps
        .filter(
          (a) =>
            (filter === "All" || a.status === filter) &&
            `${a.company} ${a.role} ${a.location} ${a.contact}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "company"
            ? a.company.localeCompare(b.company)
            : sort === "days"
              ? waitDays(b) - waitDays(a)
              : new Date(b.dateApplied) - new Date(a.dateApplied),
        ),
    [apps, filter, search, sort],
  );
  const metrics = useMemo(() => {
    const waiting = apps.filter((a) => ACTIVE.has(a.status));
    return [
      ["Total", apps.length],
      ["Active", waiting.length],
      ["Interviews", apps.filter((a) => a.status === "Interview").length],
      ["Offers", apps.filter((a) => a.status === "Offer").length],
      ["Rejections", apps.filter((a) => a.status === "Rejected").length],
      [
        "Avg. wait",
        waiting.length
          ? `${Math.round(waiting.reduce((n, a) => n + waitDays(a), 0) / waiting.length)}d`
          : "0d",
      ],
    ];
  }, [apps]);
  const openNew = (trigger) => {
      lastTrigger.current = trigger?.currentTarget || document.activeElement;
      setEditing(null);
      setModalOpen(true);
    },
    openEdit = (a) => {
      setSelected(null);
      setEditing(a);
      setModalOpen(true);
    },
    save = async (form) => {
      const snapshot = apps,
        temporary = { ...form, id: editing?.id || crypto.randomUUID() };
      setApps((old) =>
        editing
          ? old.map((a) => (a.id === editing.id ? temporary : a))
          : [temporary, ...old],
      );
      setModalOpen(false);
      try {
        const result = await api(
          editing ? `/api/applications/${editing.id}` : "/api/applications",
          { method: editing ? "PUT" : "POST", body: JSON.stringify(form) },
        );
        setApps((old) =>
          old.map((a) => (a.id === temporary.id ? result.application : a)),
        );
        tell(editing ? "Updated." : "Logged.");
      } catch (error) {
        setApps(snapshot);
        tell(error.message);
      }
      setTimeout(() => lastTrigger.current?.focus(), 0);
    },
    remove = async (app) => {
      if (confirm(`Delete ${app.company} from your ledger?`)) {
        const snapshot = apps;
        setApps((old) => old.filter((a) => a.id !== app.id));
        setSelected(null);
        try {
          await api(`/api/applications/${app.id}`, { method: "DELETE" });
          tell("Application deleted.");
        } catch (error) {
          setApps(snapshot);
          tell(error.message);
        }
      }
    },
    changeStatus = async (id, status) => {
      const snapshot = apps,
        current = apps.find((a) => a.id === id);
      if (!current) return;
      setApps((old) => old.map((a) => (a.id === id ? { ...a, status } : a)));
      setSelected((s) => (s?.id === id ? { ...s, status } : s));
      try {
        await api(`/api/applications/${id}`, {
          method: "PUT",
          body: JSON.stringify(cleanApplication({ ...current, status })),
        });
        tell(`Moved to ${status}.`);
      } catch (error) {
        setApps(snapshot);
        setSelected(current);
        tell(error.message);
      }
    },
    followUp = async (id) => {
      const date = today();
      const snapshot = apps,
        current = apps.find((a) => a.id === id);
      setApps((old) =>
        old.map((a) => (a.id === id ? { ...a, followedUpAt: date } : a)),
      );
      setSelected((s) => ({ ...s, followedUpAt: date }));
      try {
        await api(`/api/applications/${id}`, {
          method: "PUT",
          body: JSON.stringify(
            cleanApplication({ ...current, followedUpAt: date }),
          ),
        });
        tell("Follow-up recorded.");
      } catch (error) {
        setApps(snapshot);
        setSelected(current);
        tell(error.message);
      }
    },
    exportData = () => {
      const blob = new Blob([JSON.stringify(apps, null, 2)], {
          type: "application/json",
        }),
        a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `midnight-ledger-${today()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      tell("Backup exported.");
    },
    importData = async (e) => {
      try {
        const parsed = JSON.parse(await e.target.files[0].text());
        if (!Array.isArray(parsed)) throw 0;
        if (confirm("Import these applications to your account?")) {
          const created = await Promise.all(
            parsed.map(({ id, ...application }) =>
              api("/api/applications", {
                method: "POST",
                body: JSON.stringify(application),
              }),
            ),
          );
          setApps((old) => [
            ...created.map((item) => item.application),
            ...old,
          ]);
          tell(`${parsed.length} applications imported.`);
        }
      } catch {
        tell("That file is not a valid ledger backup.");
      }
      e.target.value = "";
    };
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">
            <span>
              <Moon size={20} />
            </span>
            <div>
              <strong>Midnight Ledger</strong>
              <small>every application, accounted for.</small>
            </div>
          </a>
          <label className="header-search">
            <Search size={16} />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications"
            />
            <kbd>/</kbd>
          </label>
          <nav className="header-actions">
            <input
              ref={fileRef}
              hidden
              type="file"
              accept="application/json"
              onChange={importData}
            />
            <IconButton
              label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            <button className="button primary header-add" onClick={openNew}>
              <Plus size={18} />
              <span>Add application</span>
            </button>
            <details className="account-menu">
              <summary aria-label="Open account menu">
                <CircleUserRound size={19} />
                <Ellipsis size={16} />
              </summary>
              <div className="account-popover">
                <div className="account-identity">
                  <small>Signed in as</small>
                  <strong>{user.email}</strong>
                </div>
                <button onClick={exportData}>
                  <Download size={16} />
                  Export JSON
                </button>
                <button onClick={() => fileRef.current.click()}>
                  <Upload size={16} />
                  Import JSON
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api("/api/auth/regenerate", { method: "POST" });
                      tell("A new token is on its way.");
                    } catch (error) {
                      tell(error.message);
                    }
                  }}
                >
                  <Clock3 size={16} />
                  Email a new token
                </button>
                <button className="menu-danger" onClick={onLogout}>
                  Log out
                </button>
              </div>
            </details>
          </nav>
        </div>
      </header>
      <main id="top">
        <section className="metrics" aria-label="Application summary">
          {metrics.map(([label, value]) => (
            <article
              key={label}
              className={label.toLowerCase().replace(/\W/g, "")}
            >
              <strong>{value}</strong>
              <p>{label}</p>
            </article>
          ))}
        </section>
        <section className="workspace">
          <div className="section-heading">
            <div>
              <p className="kicker">
                <Moon size={13} />
                The ledger
              </p>
              <h1>Your applications</h1>
            </div>
            <span>
              {visible.length} {visible.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <div className="toolbar">
            <div className="view-toggle">
              <button
                className={view === "board" ? "active" : ""}
                onClick={() => setView("board")}
              >
                <Grid2X2 size={16} />
                Board
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                <List size={17} />
                List
              </button>
            </div>
            <label className="select-wrap">
              <span className="sr-only">Filter by status</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
            <label className="select-wrap">
              <ArrowDownUp size={15} />
              <span className="sr-only">Sort applications</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date-desc">Date applied</option>
                <option value="company">Company A–Z</option>
                <option value="days">Days waiting</option>
              </select>
              <ChevronDown size={15} />
            </label>
          </div>
          {loading ? (
            <div className="skeleton-list" aria-label="Loading applications">
              <i />
              <i />
              <i />
            </div>
          ) : visible.length === 0 ? (
            <div className="empty">
              <Moon size={30} />
              <h2>{apps.length ? "No matches." : "Nothing here yet."}</h2>
              <p>
                {apps.length
                  ? "Try a different name or clear your filters."
                  : "Log your first application."}
              </p>
              <button
                className="button primary"
                onClick={
                  apps.length
                    ? () => {
                        setSearch("");
                        setFilter("All");
                      }
                    : openNew
                }
              >
                {apps.length ? "Clear filters" : "Log an application"}
              </button>
            </div>
          ) : view === "list" ? (
            <div className="list-view">
              {visible.map((a) => (
                <ApplicationCard
                  key={a.id}
                  app={a}
                  view="list"
                  onOpen={setSelected}
                  onEdit={openEdit}
                  onDelete={remove}
                  onStatus={changeStatus}
                />
              ))}
            </div>
          ) : (
            <div className="board">
              {STATUSES.map((status) => {
                const cards = visible.filter((a) => a.status === status);
                return (
                  <section
                    className="board-column"
                    key={status}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) =>
                      changeStatus(e.dataTransfer.getData("text/plain"), status)
                    }
                  >
                    <header>
                      <StatusBadge status={status} />
                      <span>{cards.length}</span>
                    </header>
                    <div>
                      {cards.map((a) => (
                        <ApplicationCard
                          key={a.id}
                          app={a}
                          onOpen={setSelected}
                          onEdit={openEdit}
                          onDelete={remove}
                          onStatus={changeStatus}
                        />
                      ))}
                      {!cards.length && (
                        <p className="column-empty">Quiet here.</p>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <button
        className="mobile-fab"
        aria-label="Add application"
        onClick={openNew}
      >
        <Plus />
      </button>
      <button
        className="feedback-bubble"
        onClick={(event) => {
          feedbackTrigger.current = event.currentTarget;
          setFeedbackOpen(true);
        }}
        aria-label="Send feedback"
      >
        <MessageSquare size={17} />
        <span>Feedback</span>
        <kbd>F</kbd>
      </button>
      <AppFooter
        onFeedback={(event) => {
          feedbackTrigger.current = event.currentTarget;
          setFeedbackOpen(true);
        }}
      />
      {modalOpen && (
        <ApplicationForm
          initial={editing}
          onSave={save}
          onClose={() => {
            setModalOpen(false);
            lastTrigger.current?.focus();
          }}
        />
      )}
      {selected && (
        <DetailDrawer
          app={selected}
          onClose={() => setSelected(null)}
          onEdit={openEdit}
          onDelete={remove}
          onStatus={changeStatus}
          onFollowUp={followUp}
        />
      )}{" "}
      {feedbackOpen && (
        <FeedbackModal
          onClose={() => {
            setFeedbackOpen(false);
            setTimeout(() => feedbackTrigger.current?.focus?.(), 0);
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"),
    [value, setValue] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const input = useRef();
  const switchMode = (next) => {
    setMode(next);
    setValue("");
    setError("");
    setNotice("");
    setTimeout(() => input.current?.focus(), 0);
  };
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "login") {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ token: value }),
        });
        onLogin(data.user);
      } else {
        await api(
          mode === "recover" ? "/api/auth/recover" : "/api/auth/register",
          { method: "POST", body: JSON.stringify({ email: value }) },
        );
        setNotice(
          mode === "register"
            ? "Check your inbox. Your token is on its way."
            : "If that email is registered, a token has been sent",
        );
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Network error. Check your connection and try again."
          : err.message,
      );
      setTimeout(() => input.current?.focus(), 0);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-shell">
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-brand">
            <span>
              <Moon size={22} />
            </span>
            <strong>Midnight Ledger</strong>
          </div>
          <p className="kicker">Every application, accounted for.</p>
          <h1>
            {mode === "login"
              ? "Open your ledger."
              : mode === "register"
                ? "Start your ledger."
                : "Replace your token."}
          </h1>
          <p className="auth-intro">
            {mode === "login"
              ? "Paste the private token sent to your email."
              : "We’ll email a new access token to you. It will never be shown here."}
          </p>
          <div className="auth-tabs" role="tablist">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Log in
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>
          {notice ? (
            <div className="auth-notice" role="status">
              <Check size={18} />
              <p>{notice}</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                <span>
                  {mode === "login" ? "Access token" : "Email address"}
                </span>
                <div className="auth-input">
                  <input
                    ref={input}
                    type={
                      mode === "login" && !show
                        ? "password"
                        : mode === "login"
                          ? "text"
                          : "email"
                    }
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete={
                      mode === "login" ? "current-password" : "email"
                    }
                    placeholder={mode === "login" ? "ml_…" : "you@example.com"}
                    aria-invalid={!!error}
                  />
                  {mode === "login" && (
                    <IconButton
                      type="button"
                      label={show ? "Hide token" : "Show token"}
                      onClick={() => setShow((s) => !s)}
                    >
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </IconButton>
                  )}
                </div>
                {error && <em className="auth-error">{error}</em>}
              </label>
              <button className="button primary auth-submit" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : "Email my token"}
              </button>
              {mode === "login" && (
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => switchMode("recover")}
                >
                  Lost your token?
                </button>
              )}
              {mode === "recover" && (
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => switchMode("login")}
                >
                  Back to log in
                </button>
              )}
            </form>
          )}
          <p className="auth-trust">
            Tokens are delivered by email and stored only as one-way hashes.
            Your applications remain private to your account.
          </p>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(),
    [checking, setChecking] = useState(true);
  useEffect(() => {
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);
  if (checking)
    return (
      <div className="auth-shell">
        <main className="auth-page">
          <div className="auth-loading">
            <Moon size={28} />
            <span>Opening the ledger…</span>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  if (!user) return <AuthScreen onLogin={setUser} />;
  return (
    <LedgerApp
      user={user}
      onLogout={async () => {
        try {
          await api("/api/auth/logout", { method: "POST" });
        } finally {
          setUser(null);
        }
      }}
    />
  );
}
