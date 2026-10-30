# Midnight Ledger: UI/UX Design Spec
 
> *Every application, accounted for.*
 
A dark, moody internship tracker. Calm, editorial, atmospheric. The goal is to make job hunting feel quiet and organised rather than stressful.
 
---
 
## 1. Design Principles
 
1. **Calm over loud.** Muted colours, soft glows, no harsh contrast.
2. **Numbers are the hero.** The "days since applied" counter is the visual highlight of every card.
3. **Glanceable.** Within 3 seconds the user should know what needs attention.
4. **Editorial feel.** Serif headings, generous spacing, thin borders.
5. **Minimal decoration.** Only small moon or clock icons. No flowers, no clutter.
---
 
## 2. Colour Palette
 
### Base (Dark Mode, default)
 
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0E0F14` | Page background |
| `--surface` | `#171923` | Cards, panels |
| `--surface-raised` | `#1E2130` | Modals, dropdowns, hover state |
| `--border` | `#2A2D3E` | Thin 1px borders |
| `--text` | `#E8E6E1` | Primary text |
| `--text-muted` | `#9A98A3` | Secondary text, labels |
| `--text-faint` | `#5F6070` | Placeholders, disabled |
 
### Status Accents
 
Each status has a muted accent, used for the badge, the card's left border, and a soft glow on hover.
 
| Status | Accent | Hex | Badge background (accent at 15% opacity) |
|---|---|---|---|
| Wishlist | Mist grey-blue | `#8C97B2` | `rgba(140,151,178,0.15)` |
| Applied | Dusty violet | `#9B8AC4` | `rgba(155,138,196,0.15)` |
| Online Assessment | Deep teal | `#4FA3A5` | `rgba(79,163,165,0.15)` |
| Interview | Ember amber | `#E0A458` | `rgba(224,164,88,0.15)` |
| Offer | Sage green | `#7DB88A` | `rgba(125,184,138,0.15)` |
| Rejected | Muted rose | `#C46B7B` | `rgba(196,107,123,0.15)` |
| Ghosted | Ash | `#6B6D7A` | `rgba(107,109,122,0.15)` |
 
### Functional Colours
 
| Purpose | Hex |
|---|---|
| Primary action (buttons, links) | `#E0A458` (ember amber) |
| Follow-up badge | `#E0A458` on amber 15% |
| Success | `#7DB88A` |
| Danger (delete) | `#C46B7B` |
| Focus ring | `#9B8AC4`, 2px |
 
### Light Mode (optional toggle)
 
| Token | Hex |
|---|---|
| `--bg` | `#F4F1EC` |
| `--surface` | `#FFFFFF` |
| `--border` | `#E2DED6` |
| `--text` | `#1C1D26` |
| `--text-muted` | `#6B6A73` |
 
Status accents stay the same but are darkened about 10% for contrast on light backgrounds.
 
### Effects
 
- **Glow on hover:** `box-shadow: 0 0 24px -6px <status accent at 40%>`
- **Background atmosphere:** a radial gradient in the top corner, `radial-gradient(600px at 15% 0%, rgba(155,138,196,0.10), transparent)`
- **Grain texture:** a fixed noise overlay at 3 to 4% opacity.
---
 
## 3. Typography
 
| Role | Font | Weight | Size (desktop / mobile) |
|---|---|---|---|
| Site title | Fraunces (or Cormorant Garamond) | 600 | 32px / 26px |
| Section headings | Fraunces | 500 | 22px / 20px |
| Dashboard numbers | Fraunces | 600 | 44px / 34px |
| **Days counter on card** | Fraunces | 600 | 36px / 30px |
| Body text | Inter (or DM Sans) | 400 | 15px |
| Labels, badges | Inter | 500 | 12px, uppercase, 0.06em tracking |
| Small / meta | Inter | 400 | 13px |
 
Both fonts are loaded from Google Fonts, with fallbacks: `Georgia, serif` and `system-ui, sans-serif`.
 
---
 
## 4. Spacing, Shape and Motion
 
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64px.
- **Corner radius:** cards 16px, buttons 10px, badges 999px (pill), inputs 10px.
- **Borders:** 1px solid `--border`. No heavy shadows; depth comes from surface colour and glow.
- **Max content width:** 1280px, centred, with 24px side padding (16px on mobile).
- **Motion:** 180ms ease-out for hovers, 250ms for modals. Cards lift 2px on hover. Respect `prefers-reduced-motion`.
---
 
## 5. Layout
 
### 5.1 Desktop (1024px and up)
 
```
┌──────────────────────────────────────────────────────────┐
│  ☾ Midnight Ledger                    [Search...]  [+ Add]│  Header
│  every application, accounted for      [☀/☾]  [⋯ Export] │
├──────────────────────────────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌────┐│
│  │ Total │ │Active │ │Interv.│ │Offers │ │Reject.│ │Avg ││  Dashboard
│  │  12   │ │   8   │ │   2   │ │   1   │ │   3   │ │ 9d ││  (6 stat cards)
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └────┘│
├──────────────────────────────────────────────────────────┤
│  [Board | List]   Filter: [All ▾]   Sort: [Days waiting ▾]│  Toolbar
├──────────────────────────────────────────────────────────┤
│ Wishlist   Applied    Assessment  Interview  Offer  ...  │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │  Kanban board
│ │ Card   │ │ Card   │ │ Card   │ │ Card   │             │  (horizontal scroll
│ │        │ │        │ │        │ │        │             │   if columns overflow)
│ └────────┘ └────────┘ └────────┘ └────────┘             │
└──────────────────────────────────────────────────────────┘
```
 
- Header is sticky with a blurred, translucent background.
- Dashboard is a 6-column grid.
- Each Kanban column is 280px wide with a coloured dot and count in its header.
### 5.2 Tablet (640 to 1023px)
 
- Dashboard becomes a 3×2 grid.
- Kanban columns scroll horizontally with snap points.
### 5.3 Mobile (below 640px)
 
- Header collapses: title on the left, **+ Add** and a menu icon on the right. Search moves into a row below.
- Dashboard becomes a 2×3 grid of compact cards.
- **List view is the default** on mobile. Board view stays available, with one column visible at a time and swipe to switch.
- Add button becomes a floating action button (amber, bottom right, 56px).
- Add and Edit forms open as a full-height bottom sheet.
---
 
## 6. Components
 
### 6.1 Application Card
 
```
┌─────────────────────────────────┐
│▌ Google                  ⋯     │  Company (Fraunces 18px) + menu
│▌ Software Engineering Intern    │  Role (Inter 14px, muted)
│▌ 📍 Singapore                   │  Location (13px, faint)
│▌                                │
│▌  14 days                       │  Days counter (hero number)
│▌  since applied                 │
│▌                                │
│▌ [Applied]   [⏱ time to follow up]│  Status badge + follow-up badge
└─────────────────────────────────┘
```
 
- 4px left border in the status accent colour.
- Background `--surface`, 1px border, 16px radius, 16 to 20px padding.
- Hover: lift 2px, border brightens, soft glow in the status colour.
- **Days counter colour shifts with urgency** (Applied status only):
  - 0 to 6 days: `--text` (neutral)
  - 7 to 13 days: amber at 70% opacity
  - 14+ days: full amber, with the follow-up badge shown
- Offer and Rejected cards dim the counter to `--text-muted`, since the waiting is over.
- Click opens the detail drawer.
### 6.2 Dashboard Stat Card
 
- Surface background, 1px border, 16px radius.
- Large Fraunces number, with a small uppercase label below in `--text-muted`.
- The Offers card has a faint sage glow. The Rejected card uses a faint rose tint. Others stay neutral.
### 6.3 Status Badge
 
- Pill shape, 12px uppercase Inter, accent text on a 15% accent background, with a 6px dot on the left.
### 6.4 Follow-up Badge
 
- Amber pill with a small clock icon, text "time to follow up".
- Tooltip: "No update in 14+ days. A short, polite email can help."
### 6.5 Buttons
 
| Type | Style |
|---|---|
| Primary | Amber background `#E0A458`, dark text `#0E0F14`, 10px radius |
| Secondary | Transparent, 1px `--border`, `--text` text, hover surface-raised |
| Ghost | No border, `--text-muted`, hover `--text` |
| Danger | Rose text, rose 15% background on hover |
 
All buttons are 40px tall (44px on mobile) with a visible focus ring.
 
### 6.6 Forms (Add / Edit)
 
- Opens as a centred modal on desktop (max 520px) and as a bottom sheet on mobile.
- Fields stacked in one column, with labels above inputs.
- Order: Company, Role, Location, Application link, Date applied (defaults to today), Status, Contact person, Notes.
- Inputs: `--surface-raised` background, 1px border, violet focus ring.
- Required fields are marked with a small amber dot, not red asterisks.
- Sticky footer with Cancel and Save.
### 6.7 Toolbar
 
- **View toggle:** segmented control (Board / List), active segment in raised surface with amber text.
- **Filter:** dropdown with status dots.
- **Sort:** dropdown (Date applied, Company A to Z, Days waiting).
- **Search:** icon-prefixed input, `/` keyboard shortcut to focus.
### 6.8 List View
 
- Table-like rows on desktop: Company and Role, Location, Status badge, Days, Date applied, Actions.
- On mobile each row becomes a compact card with the days counter on the right.
- Row hover: raised surface background.
### 6.9 Empty States
 
| Situation | Copy |
|---|---|
| No applications | "Nothing here yet. Log your first application." + amber button |
| Empty Kanban column | "Quiet here." (faint, italic Fraunces) |
| No search results | "No matches. Try a different name." |
 
Each empty state has a small crescent moon icon in `--text-faint`.
 
---
 
## 7. UX Flows
 
### Add an application
1. Click **+ Add** (or press `N`).
2. Form opens with date applied pre-filled to today and status set to Applied.
3. Fill in the essentials (company and role are enough). Save.
4. Card appears in the Applied column with a brief fade-in. A toast says "Logged."
### Update status
- **Board view:** drag a card to another column.
- **Any view:** use the card's ⋯ menu, then Change status.
- On change, the card's accent and glow update smoothly.
### Follow up
1. A card shows the "time to follow up" badge after 14 days.
2. The user opens the card, sees the contact person and link, and can mark as followed up.
3. Marking as followed up resets the 14-day timer.
### Backup
- Header menu holds **Export JSON** and **Import JSON**.
- Import shows a confirmation ("This will replace your current data") before applying.
---
 
## 8. Authentication Screens
 
Accounts use email-only registration and a unique access token for login (no passwords). The token is delivered by email only and is never shown on screen after registering.
 
### 8.1 Layout (all screens)
 
```
┌──────────────────────────────────────────┐
│                                          │
│                   ☾                      │  Moon icon, faint
│            Midnight Ledger               │  Fraunces 32px
│    every application, accounted for      │  Tagline, muted
│                                          │
│        ┌────────────────────────┐        │
│        │  [ Log in | Register ] │        │  Segmented tabs
│        │                        │        │
│        │  Access token          │        │
│        │  [••••••••••••••  👁]  │        │
│        │                        │        │
│        │  [      Log in      ]  │        │  Primary amber button
│        │                        │        │
│        │  Lost your token?      │        │  Ghost link
│        └────────────────────────┘        │
│                                          │
└──────────────────────────────────────────┘
```
 
- Full-viewport page with the same background atmosphere as the app (violet radial glow in the top corner, grain overlay).
- Single centred card: max width 420px, `--surface` background, 1px `--border`, 16px radius, 32px padding (24px on mobile).
- Card has a very soft amber glow on the top edge: `box-shadow: 0 -1px 0 rgba(224,164,88,0.25), 0 24px 60px -20px rgba(0,0,0,0.6)`.
- Mobile: card spans the full width with 16px margins, vertically centred. No bottom sheet here.
- No header, sidebar, or dashboard is visible until the user is logged in.
### 8.2 Log in (default tab)
 
| Element | Spec |
|---|---|
| Heading | "Welcome back" (Fraunces 22px) |
| Subtext | "Paste the token from your email." (muted 14px) |
| Token field | Password-style input with show/hide eye icon, monospace font (JetBrains Mono or `ui-monospace`), 44px tall, autofocus |
| Paste helper | Pasting trims spaces and line breaks automatically |
| Primary button | "Log in", full width, amber. Shows a small spinner and "Checking..." while loading |
| Secondary link | "Lost your token?" opens the recovery view |
| Enter key | Submits the form |
 
**Error states** (shown inline under the field, rose text with a small alert icon, field border turns rose):
- Invalid token: "That token doesn't look right. Check your email and try again."
- Rate limited: "Too many attempts. Try again in 15 minutes."
- Network: "Can't reach the server. Check your connection."
### 8.3 Register tab
 
| Element | Spec |
|---|---|
| Heading | "Start your ledger" |
| Subtext | "Just your email. We'll send you a token to log in." |
| Email field | Type email, autocomplete email, 44px tall, autofocus |
| Primary button | "Send my token" |
| Fine print | "No password needed. Keep the token safe, it's your key." (faint 12px) |
 
**Success state** replaces the form (same card, fade transition 250ms):
- Icon: envelope with a small moon, in ember amber, 48px
- Heading: "Check your inbox"
- Text: "If that address can be used, your token is on its way. It may take a minute."
- Buttons: "Go to log in" (primary) and "Use a different email" (ghost)
- Optional: "Resend" link, disabled for 60 seconds with a countdown.
**Error states:** invalid email format ("That doesn't look like an email."), rate limited, network.
 
The success message is identical whether the email is new or already registered, so nobody can discover which emails have accounts.
 
### 8.4 Lost token view
 
- Reached from "Lost your token?" and shown in the same card with a back arrow.
- Heading: "Get a new token"
- Text: "Enter your email. We'll send a new token and the old one will stop working."
- Email field plus "Send new token" button.
- Success: "If that email is registered, a new token has been sent." (same neutral wording)
### 8.5 Token email design
 
The email matches the app's dark look.
 
```
┌────────────────────────────────────┐
│  (background #0E0F14)              │
│                                    │
│          ☾ Midnight Ledger         │  Georgia/serif fallback, #E8E6E1
│                                    │
│  Here's your access token          │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ml_k3J9...x7Qp               │  │  Monospace, #E0A458 text
│  └──────────────────────────────┘  │  on #171923, 1px #2A2D3E border
│                                    │
│  Paste it on the login page to     │
│  get in. Keep it safe, it's your   │
│  key.                              │
│                                    │
│  [     Open Midnight Ledger     ]  │  Amber button
│                                    │
│  Didn't request this? Ignore this  │
│  email. Nothing will change.       │
└────────────────────────────────────┘
```
 
- Width 560px max, inline CSS only, with fallback fonts (Georgia, Arial).
- Token box is selectable, with generous padding so it's easy to copy on mobile.
- Includes a plain-text version of the email.
### 8.6 Logged-in additions to the main app
 
| Location | Addition |
|---|---|
| Header menu (⋯) | Shows the user's email (muted, truncated), then: Export JSON, Import JSON, Regenerate token, **Log out** |
| Regenerate token | Confirmation modal: "This will email you a new token and sign out other devices. Continue?" |
| Log out | Returns to the login screen with a toast: "Logged out." |
| Session expired | Redirect to login with the message "Your session ended. Please log in again." |
| First login with old local data | Modal: "We found applications saved on this device. Import them to your account?" Buttons: "Import" (primary) and "Skip" |
 
### 8.7 Auth microcopy tone
 
Keep it calm and short, matching the moody theme.
 
| Moment | Copy |
|---|---|
| Loading login | "Checking..." |
| Login success toast | "Welcome back." |
| Registration done | "Check your inbox." |
| Logout toast | "Logged out." |
| Generic error | "Something went wrong. Try again." |
 
### 8.8 Auth accessibility
 
- Labels are always visible above fields (no placeholder-only labels).
- Errors use `aria-live="polite"` and are linked to the field with `aria-describedby`.
- Show/hide toggle is a real button with an `aria-label` ("Show token" / "Hide token").
- Tab order: tabs, field, button, secondary link.
- Autofill and password managers should be able to save the token (`autocomplete="current-password"` on the token field).
---
 
## 9. Feedback Form
 
A quiet way for users to report bugs and suggest improvements. Only available to logged-in users, so each message is tied to an account.
 
### 9.1 Entry points
 
| Location | Spec |
|---|---|
| Header menu (⋯) | "Send feedback" item with a message icon, placed above Log out |
| Footer | Small ghost link: "Feedback" (muted, 13px) |
| Mobile | Same header menu item. No extra floating button, so it doesn't compete with the **+ Add** button |
| Keyboard | Shortcut `F` opens the form (disabled while typing in a field) |
 
### 9.2 Form layout
 
Desktop opens as a centred modal (max 480px). Mobile opens as a bottom sheet, same as the Add form.
 
```
┌────────────────────────────────────┐
│  Help improve Midnight Ledger   ✕  │  Fraunces 22px
│  Tell us what's working and what   │
│  isn't. Every note gets read.      │  Muted 14px
│                                    │
│  What's this about?                │
│  ( Idea )( Bug )( Praise )( Other )│  Pill selector, one active
│                                    │
│  Your message                      │
│  ┌──────────────────────────────┐  │
│  │                              │  │  Textarea, 5 rows
│  │                              │  │
│  └──────────────────────────────┘  │
│                           0 / 1000 │  Live counter
│                                    │
│  How's your experience? (optional) │
│  ☾  ☾  ☾  ☾  ☾                    │  5 moons, amber when selected
│                                    │
│  ☐ Include page and device info    │  Checked by default, helps with bugs
│                                    │
│  [ Cancel ]          [ Send note ] │
└────────────────────────────────────┘
```
 
### 9.3 Fields
 
| Field | Type | Rules |
|---|---|---|
| Category | Pill selector (Idea, Bug, Praise, Other) | Required, defaults to Idea |
| Message | Textarea | Required, 10 to 1000 characters, live counter turns amber at 900 |
| Rating | 5 moon icons | Optional. Selected moons fill with ember amber, hover previews the fill |
| Include page and device info | Checkbox | Optional, on by default. Sends the current screen name, browser and screen size, never personal data |
| Email | Not shown | Taken from the logged-in account, so users don't retype it |
 
The category pills use the same style as status badges: neutral by default, and the active pill gets an accent tint.
 
| Category | Accent |
|---|---|
| Idea | Ember amber `#E0A458` |
| Bug | Muted rose `#C46B7B` |
| Praise | Sage green `#7DB88A` |
| Other | Mist grey-blue `#8C97B2` |
 
### 9.4 Behaviour and states
 
| State | Behaviour |
|---|---|
| Default | Send button disabled until a category is selected and the message has at least 10 characters |
| Sending | Button shows a small spinner and "Sending..." |
| Success | Form fades to a thank-you view: crescent moon icon, "Thank you.", "Your note has been sent. It helps shape what comes next.", and a **Close** button. Auto-closes after 4 seconds |
| Error | Inline rose message: "Couldn't send that. Your text is still here, try again." Message is never cleared on failure |
| Rate limited | "You've sent a few notes already. Please try again later." |
| Unsaved text | Closing with text typed asks "Discard your note?" with Keep writing / Discard |
| Esc key | Closes the modal (with the discard check above) |
 
### 9.5 Microcopy
 
| Moment | Copy |
|---|---|
| Title | "Help improve Midnight Ledger" |
| Placeholder (Idea) | "I wish it could..." |
| Placeholder (Bug) | "What happened, and what did you expect?" |
| Placeholder (Praise) | "What did you like?" |
| Placeholder (Other) | "Tell us anything." |
| Success toast (if closed early) | "Note sent. Thank you." |
 
The textarea placeholder changes with the selected category.
 
### 9.6 Feedback accessibility
 
- Category selector is a radio group with arrow-key navigation and visible focus rings.
- Moon rating is a radio group with labels ("1 out of 5" ... "5 out of 5"), not just icons.
- Counter and error messages use `aria-live="polite"`.
- Modal traps focus, returns focus to the menu item on close, and the bottom sheet on mobile is swipe-to-dismiss with a visible close button.
### 9.7 Owner view (optional)
 
A simple private page at `/admin/feedback`, available only to the owner's email (set by an environment variable).
 
- Table or card list, newest first: date, category pill, rating moons, message, user email, device info.
- Filter by category, and a "Mark as done" toggle.
- Same dark theme, no extra navigation. Not linked anywhere in the public UI.
### 9.8 Footer and developer link
 
Shown on every screen, including the login screen.
 
```
┌──────────────────────────────────────────────────────────┐
│  ☾ Midnight Ledger            Feedback       </> Built by @YOUR_GITHUB_USERNAME │
└──────────────────────────────────────────────────────────┘
```
 
| Element | Spec |
|---|---|
| Footer bar | 1px top border in `--border`, 24px vertical padding, text in `--text-muted` at 13px |
| Developer link | GitHub icon + "Built by @YOUR_GITHUB_USERNAME", linking to `https://github.com/YOUR_GITHUB_USERNAME` |
| Link behaviour | Opens in a new tab with `target="_blank"` and `rel="noopener noreferrer"` |
| Hover | Text turns `--text`, with a thin amber underline that slides in (180ms) |
| Feedback link | The ghost "Feedback" link from 9.1. It is hidden on the login screen, since feedback is for logged-in users only |
| Mobile | Footer stacks and centres: Feedback, then the GitHub link. Keeps 16px side padding and clears the floating **+ Add** button |
| Login screen | Footer sits below the card in `--text-faint`, showing only the GitHub link |
| Accessibility | Link has an `aria-label` ("Developer on GitHub, opens in a new tab"). The icon is decorative (`aria-hidden`) |
 
Replace `YOUR_GITHUB_USERNAME` with your real GitHub username before deploying.
 
---
 
## 10. Accessibility
 
- Text contrast is at least 4.5:1 against surfaces. Check muted text on `--surface`.
- Status is never conveyed by colour alone: every badge also has a text label.
- Full keyboard navigation, with visible focus rings and logical tab order.
- Drag and drop has a keyboard alternative (the Change status menu).
- Modals trap focus, close on `Esc`, and return focus to the trigger.
- Touch targets are at least 44×44px on mobile.
- Honour `prefers-reduced-motion` and `prefers-color-scheme`.
---
 
## 11. Icons
 
- Library: Lucide (outline, 1.5px stroke).
- Allowed decorative icons: `moon`, `clock`, `hourglass`.
- Functional icons: `plus`, `search`, `more-horizontal`, `map-pin`, `link`, `download`, `upload`, `trash-2`, `pencil`, `github`, `message-square`, `send`.
---
 
## 12. Tailwind Tokens (starter)
 
```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0E0F14',
        surface: '#171923',
        raised: '#1E2130',
        line: '#2A2D3E',
        ink: '#E8E6E1',
        muted: '#9A98A3',
        faint: '#5F6070',
        ember: '#E0A458',
        violet: '#9B8AC4',
        teal: '#4FA3A5',
        sage: '#7DB88A',
        rose: '#C46B7B',
        mist: '#8C97B2',
        ash: '#6B6D7A',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '16px' },
    },
  },
}
```
 
---
 
## 13. Build Checklist
 
- [ ] Colour tokens and fonts set up
- [ ] Auth screens: Log in, Register, Lost token, success and error states
- [ ] Token email template (HTML and plain text)
- [ ] Header menu with email, Regenerate token, Send feedback and Log out
- [ ] Feedback modal / bottom sheet with category, message, moon rating and success state
- [ ] Owner feedback page (optional)
- [ ] Header, dashboard and toolbar
- [ ] Application card with days counter and badges
- [ ] Kanban board with drag and drop, plus list view
- [ ] Add / Edit form (modal on desktop, bottom sheet on mobile)
- [ ] Follow-up logic (14+ days in Applied)
- [ ] Search, filter, sort
- [ ] Account-based persistence (API) and JSON export / import
- [ ] One-time import of old localStorage data after first login
- [ ] Light mode toggle
- [ ] Empty states and toasts
- [ ] Footer with GitHub developer link (real username set)
- [ ] Feedback API tied to the account, with rate limiting
- [ ] Accessibility pass
- [ ] Deploy to Vercel or Netlify
 