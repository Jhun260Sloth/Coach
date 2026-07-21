import React, { useState, useMemo, useEffect } from "react";
import {
  Search, MapPin, Star, ChevronLeft, ChevronRight, ChevronDown, Bell,
  MessageCircle, Calendar, Clock, CheckCircle2, XCircle, Camera, Upload,
  Shield, ShieldCheck, CreditCard, Fingerprint, Home, User, LayoutGrid,
  List as ListIcon, Filter, Send, Paperclip, Play, Plus, Settings, LogOut,
  AlertCircle, DollarSign, TrendingUp, Users, FileText, HelpCircle,
  ArrowRight, Check, X, Edit3, Trash2, Share2, Download, Lock, Heart,
  Flag, Video, Navigation, WifiOff, BadgeCheck, ClipboardList, PieChart,
  Percent, Info, Sparkles, ArrowLeft, Mail, Banknote, Wallet, Eye, EyeOff,
  RefreshCcw, MoreHorizontal
} from "lucide-react";

/* =========================================================================
   DESIGN TOKENS — CoachLink brand
   Jet anchors dark surfaces. Signal Orange = primary action / urgency.
   Fog = light surface. White = base. Display: Outfit. Body: Inter.
   ========================================================================= */
const C = {
  jet: "#16181D",
  jetSoft: "#2A2D35",
  orange: "#FF5A36",
  orangeTint: "#FFF0EB",
  fog: "#F4F5F7",
  white: "#FFFFFF",
  slate: "#6B7280",
  slateLight: "#9CA3AF",
  border: "#E7E8EC",
  success: "#1E9E5A",
  successTint: "#E9F9EF",
  warnTint: "#FFF4E9",
};

const FONT_IMPORT_ID = "coachlink-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}
const fDisplay = { fontFamily: "'Outfit', sans-serif" };
const fBody = { fontFamily: "'Inter', sans-serif" };

/* =========================================================================
   MOCK DATA
   ========================================================================= */
const CONFIG = { serviceFeeRate: 0.06, commissionRate: 0.15 };

const SPORTS = ["Tennis", "Swimming", "Basketball", "Strength & Conditioning", "Football", "Yoga", "Rock Climbing", "Athletics"];

const AVATAR_PALETTE = ["#16181D", "#FF5A36", "#3F4759", "#B23A22", "#5B6472"];
function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}
function hashColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

const COACHES = [
  {
    id: "c1", name: "Maya Okafor", sport: "Tennis", tags: ["Junior development", "Match strategy"],
    suburb: "Bondi, Sydney", distanceKm: 2.1, rating: 4.9, reviews: 132,
    verified: { identity: true, wwcc: true, quals: true }, instantBook: true,
    experience: "8 yrs coaching", style: "High-energy, technical drills with a focus on footwork and match IQ.",
    bio: "Former state-level competitor turned full-time coach. I work with players from age 8 through adult club level, building technique that holds up under pressure.",
    cancellationPolicy: "Moderate — free reschedule up to 24h before session, 50% refund inside 24h.",
    reelsCount: 6,
    packages: [
      { id: "p1", name: "1:1 Court Session", type: "1:1", duration: 60, mode: "In-person", price: 75 },
      { id: "p2", name: "Junior Group (max 4)", type: "Group", duration: 60, mode: "In-person", price: 32 },
      { id: "p3", name: "8-Week Term Block", type: "Term", duration: 60, mode: "In-person", price: 520 },
    ],
    availability: { Mon: ["07:00", "16:00", "17:00"], Wed: ["16:00", "17:00", "18:00"], Fri: ["07:00", "08:00"], Sat: ["09:00", "10:00", "11:00"] },
  },
  {
    id: "c2", name: "Josh Whitfield", sport: "Strength & Conditioning", tags: ["Powerlifting", "Injury return"],
    suburb: "Fitzroy, Melbourne", distanceKm: 4.6, rating: 4.8, reviews: 96,
    verified: { identity: true, wwcc: false, quals: true }, instantBook: false,
    experience: "6 yrs coaching", style: "Programming-first — every block is periodised and tracked.",
    bio: "Accredited S&C coach working with amateur athletes and everyday lifters. Specialising in safe return-to-training after injury.",
    cancellationPolicy: "Strict — 50% refund up to 48h before, no refund inside 48h.",
    reelsCount: 11,
    packages: [
      { id: "p1", name: "1:1 Programming Session", type: "1:1", duration: 45, mode: "In-person", price: 68 },
      { id: "p2", name: "Small Group (max 3)", type: "Group", duration: 60, mode: "In-person", price: 40 },
    ],
    availability: { Tue: ["06:00", "07:00", "18:00"], Thu: ["06:00", "07:00"], Sat: ["08:00", "09:00"] },
  },
  {
    id: "c3", name: "Priya Nandan", sport: "Swimming", tags: ["Squad training", "Stroke correction"],
    suburb: "Manly, Sydney", distanceKm: 6.3, rating: 5.0, reviews: 58,
    verified: { identity: true, wwcc: true, quals: true }, instantBook: true,
    experience: "10 yrs coaching", style: "Patient, technical, big on video review between sets.",
    bio: "Ex-national squad swimmer. I coach juniors through masters swimmers, with a focus on efficient technique over raw yardage.",
    cancellationPolicy: "Flexible — free cancellation up to 12h before session.",
    reelsCount: 4,
    packages: [
      { id: "p1", name: "1:1 Poolside Session", type: "1:1", duration: 45, mode: "In-person", price: 60 },
      { id: "p2", name: "Term Block (10 sessions)", type: "Term", duration: 45, mode: "In-person", price: 540 },
    ],
    availability: { Mon: ["06:00", "06:45"], Wed: ["06:00", "06:45"], Fri: ["06:00", "06:45"], Sun: ["08:00", "08:45"] },
  },
  {
    id: "c4", name: "Daniel Reyes", sport: "Basketball", tags: ["Shooting mechanics", "IQ & film"],
    suburb: "South Yarra, Melbourne", distanceKm: 3.0, rating: 4.7, reviews: 74,
    verified: { identity: true, wwcc: true, quals: false }, instantBook: true,
    experience: "5 yrs coaching", style: "Skill-first sessions built around repeatable shooting mechanics.",
    bio: "Former college player now coaching juniors and adult rec players. Sessions are filmed so you can see what changed.",
    cancellationPolicy: "Moderate — free reschedule up to 24h before session, 50% refund inside 24h.",
    reelsCount: 9,
    packages: [
      { id: "p1", name: "1:1 Skills Session", type: "1:1", duration: 60, mode: "In-person", price: 70 },
      { id: "p2", name: "Virtual Film Review", type: "1:1", duration: 30, mode: "Virtual", price: 35 },
    ],
    availability: { Tue: ["17:00", "18:00"], Thu: ["17:00", "18:00"], Sun: ["10:00", "11:00", "12:00"] },
  },
  {
    id: "c5", name: "Ella Fontaine", sport: "Yoga", tags: ["Vinyasa", "Mobility"],
    suburb: "Newtown, Sydney", distanceKm: 1.4, rating: 4.9, reviews: 210,
    verified: { identity: true, wwcc: false, quals: true }, instantBook: true,
    experience: "9 yrs coaching", style: "Breath-led movement, adaptable to every level.",
    bio: "500hr certified instructor. I teach 1:1 and small group vinyasa with a focus on building sustainable mobility.",
    cancellationPolicy: "Flexible — free cancellation up to 12h before session.",
    reelsCount: 14,
    packages: [
      { id: "p1", name: "1:1 Private Session", type: "1:1", duration: 60, mode: "In-person", price: 55 },
      { id: "p2", name: "Virtual Session", type: "1:1", duration: 45, mode: "Virtual", price: 38 },
      { id: "p3", name: "4-Week Bundle", type: "Term", duration: 60, mode: "In-person", price: 200 },
    ],
    availability: { Mon: ["07:00", "18:00"], Wed: ["07:00", "18:00"], Fri: ["07:00"], Sat: ["09:00", "10:00"] },
  },
  {
    id: "c6", name: "Tom Baxter", sport: "Rock Climbing", tags: ["Bouldering", "Lead climbing"],
    suburb: "Brunswick, Melbourne", distanceKm: 5.8, rating: 4.6, reviews: 41,
    verified: { identity: true, wwcc: true, quals: true }, instantBook: false,
    experience: "4 yrs coaching", style: "Movement-focused coaching — reading routes before pulling on.",
    bio: "Gym and outdoor routesetter turned coach. I work with complete beginners through to lead-climbing prep.",
    cancellationPolicy: "Strict — 50% refund up to 48h before, no refund inside 48h.",
    reelsCount: 7,
    packages: [
      { id: "p1", name: "1:1 Coaching Session", type: "1:1", duration: 90, mode: "In-person", price: 85 },
      { id: "p2", name: "Small Group (max 4)", type: "Group", duration: 90, mode: "In-person", price: 45 },
    ],
    availability: { Tue: ["16:00"], Thu: ["16:00"], Sat: ["10:00", "13:00"] },
  },
];

const THREADS = [
  { id: "t1", withName: "Maya Okafor", withRole: "coach", context: "Booking · Tue 4:00pm", lastMsg: "Sounds great, see you at the courts!", time: "9:41am", unread: 0 },
  { id: "t2", withName: "Josh Whitfield", withRole: "coach", context: "Enquiry", lastMsg: "Do you have any morning slots next week?", time: "Yesterday", unread: 2 },
  { id: "t3", withName: "Priya Nandan", withRole: "coach", context: "Booking · Sun 8:00am", lastMsg: "I've sent through the drill sheet, take a look 🙂", time: "Mon", unread: 0 },
];
const COACH_THREADS = [
  { id: "ct1", withName: "Sarah Lin", withRole: "client", context: "Booking · Tue 4:00pm", lastMsg: "Sounds great, see you at the courts!", time: "9:41am", unread: 0 },
  { id: "ct2", withName: "Marcus Webb", withRole: "client", context: "Enquiry", lastMsg: "Do you run sessions on weekends?", time: "Yesterday", unread: 1 },
  { id: "ct3", withName: "The Chen Family", withRole: "client", context: "Booking · Sat 9:00am", lastMsg: "Perfect, thank you for confirming!", time: "Mon", unread: 0 },
];

const CHAT_MESSAGES = [
  { id: 1, from: "them", text: "Hi! Looking forward to Tuesday's session.", time: "9:12am" },
  { id: 2, from: "me", text: "Me too — should I bring my own racquet?", time: "9:15am" },
  { id: 3, from: "them", text: "Either is fine, I've got spares courtside.", time: "9:20am" },
  { id: 4, from: "them", text: "Sounds great, see you at the courts!", time: "9:41am" },
];

const INITIAL_BOOKINGS = [
  { id: "b1", coachId: "c1", coachName: "Maya Okafor", clientName: "Sarah Lin", service: "1:1 Court Session", date: "Tue, 22 Jul", time: "4:00pm", mode: "In-person", status: "confirmed", price: 75, reviewed: false },
  { id: "b2", coachId: "c2", coachName: "Josh Whitfield", clientName: "Sarah Lin", service: "1:1 Programming Session", date: "Fri, 25 Jul", time: "6:00am", mode: "In-person", status: "pending", price: 68, reviewed: false },
  { id: "b3", coachId: "c3", coachName: "Priya Nandan", clientName: "Sarah Lin", service: "1:1 Poolside Session", date: "Sun, 13 Jul", time: "8:00am", mode: "In-person", status: "completed", price: 60, reviewed: false },
  { id: "b4", coachId: "c5", coachName: "Ella Fontaine", clientName: "Sarah Lin", service: "Virtual Session", date: "Wed, 9 Jul", time: "7:00am", mode: "Virtual", status: "completed", price: 38, reviewed: true },
];

const COACH_BOOKINGS = [
  { id: "cb1", clientName: "Sarah Lin", service: "1:1 Court Session", date: "Tue, 22 Jul", time: "4:00pm", mode: "In-person", status: "confirmed", price: 75 },
  { id: "cb2", clientName: "Marcus Webb", service: "Junior Group (max 4)", date: "Wed, 23 Jul", time: "5:00pm", mode: "In-person", status: "pending", price: 32 },
  { id: "cb3", clientName: "The Chen Family (u18)", service: "1:1 Court Session", date: "Sat, 26 Jul", time: "9:00am", mode: "In-person", status: "pending", price: 75 },
  { id: "cb4", clientName: "Ravi Patel", service: "8-Week Term Block", date: "Mon, 14 Jul", time: "7:00am", mode: "In-person", status: "completed", price: 520 },
];

const REVIEWS = [
  { id: "r1", name: "Sarah L.", rating: 5, text: "Maya spotted a footwork issue in my first session that nobody else had picked up on. Genuinely improved my game.", verified: true, date: "3 weeks ago" },
  { id: "r2", name: "Priya D.", rating: 5, text: "Great with my two kids — patient but pushes them just enough.", verified: true, date: "1 month ago" },
  { id: "r3", name: "Owen K.", rating: 4, text: "Solid technical feedback, sessions run a little over time but worth it.", verified: true, date: "2 months ago" },
];

const FAQS = {
  client: [
    { q: "How do I book a session?", a: "Search for a coach, open their profile, choose a package, then pick a time. Coaches with Instant Book confirm automatically — others review your request first." },
    { q: "When am I charged?", a: "Your card is charged at the time of booking. Funds are held securely and released to the coach once the session is marked complete." },
    { q: "What if I need to cancel?", a: "Open the booking from your dashboard and select Cancel or Reschedule. Refunds follow the individual coach's cancellation policy, shown at checkout." },
    { q: "How do refunds work?", a: "Approved refunds are returned to your original payment method within 5–10 business days." },
    { q: "Is my payment information secure?", a: "Yes — CoachLink never stores full card details. Payments are processed through an encrypted, PCI-compliant provider." },
  ],
  coach: [
    { q: "How do I get verified?", a: "Submit an identity document and, if you coach under-18s, a Working with Children Check. Most reviews complete within 2 business days." },
    { q: "When do I get paid?", a: "Payouts release automatically once a client confirms a session is complete, minus CoachLink's commission. Funds typically land in 2–3 business days." },
    { q: "Can I set my own cancellation policy?", a: "Yes — choose Flexible, Moderate or Strict from your Services tab. This is shown to clients before they book." },
    { q: "How does Instant Book differ from Request to Book?", a: "Instant Book confirms matching client requests automatically. Request to Book lets you review and accept each one." },
  ],
};

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
function Btn({ children, onClick, variant = "primary", full, icon: Icon, disabled, size = "md", type = "button" }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    borderRadius: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer",
    border: "1px solid transparent", transition: "opacity .15s ease",
    opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto",
    padding: size === "sm" ? "9px 14px" : "13px 18px",
    fontSize: size === "sm" ? 13 : 15, ...fBody,
  };
  const variants = {
    primary: { background: C.orange, color: C.white },
    dark: { background: C.jet, color: C.white },
    secondary: { background: C.fog, color: C.jet },
    outline: { background: "transparent", color: C.jet, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.slate },
    danger: { background: "transparent", color: "#D64545", border: "1px solid #F3D2D2" },
  };
  return (
    <button type={type} disabled={disabled} onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {Icon && <Icon size={size === "sm" ? 14 : 17} strokeWidth={2.3} />}
      {children}
    </button>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 14, cursor: onClick ? "pointer" : "default", ...style }}
    >
      {children}
    </div>
  );
}

function Chip({ children, active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 999,
        fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: `1px solid ${active ? C.orange : C.border}`,
        background: active ? C.orangeTint : C.white, color: active ? C.orange : C.jet, ...fBody,
      }}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  );
}

function Badge({ tone = "neutral", children, icon: Icon }) {
  const tones = {
    neutral: { bg: C.fog, fg: C.slate },
    orange: { bg: C.orangeTint, fg: C.orange },
    success: { bg: C.successTint, fg: C.success },
    dark: { bg: C.jet, fg: C.white },
  };
  const t = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: t.bg, color: t.fg, fontSize: 11.5, fontWeight: 600, padding: "4px 8px", borderRadius: 8, ...fBody }}>
      {Icon && <Icon size={11.5} />}
      {children}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: { label: "Pending", tone: "orange", pulse: true },
    confirmed: { label: "Confirmed", tone: "success" },
    completed: { label: "Completed", tone: "neutral" },
    cancelled: { label: "Cancelled", tone: "neutral" },
    live: { label: "Live now", tone: "orange", pulse: true },
  };
  const m = map[status] || map.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: m.tone === "orange" ? C.orangeTint : m.tone === "success" ? C.successTint : C.fog,
      color: m.tone === "orange" ? C.orange : m.tone === "success" ? C.success : C.slate,
      fontSize: 11.5, fontWeight: 700, padding: "4px 9px", borderRadius: 8, ...fBody,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: "currentColor", animation: m.pulse ? "clPulse 1.4s infinite" : "none" }} />
      {m.label}
    </span>
  );
}

function Avatar({ name, size = 42, ring }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size, background: hashColor(name), color: C.white,
      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36,
      flexShrink: 0, boxShadow: ring ? `0 0 0 2px ${C.white}, 0 0 0 3.5px ${C.orange}` : "none", ...fDisplay,
    }}>
      {initials(name)}
    </div>
  );
}

function StarRow({ value, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(value) ? C.orange : "none"} color={i <= Math.round(value) ? C.orange : C.slateLight} />
      ))}
    </span>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 25, borderRadius: 99, background: on ? C.orange : C.border, position: "relative", flexShrink: 0, border: "none", cursor: "pointer" }}>
      <span style={{ position: "absolute", top: 2.5, left: on ? 20 : 2.5, width: 20, height: 20, borderRadius: 99, background: C.white, transition: "left .15s ease", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    </button>
  );
}

function SegTabs({ items, value, onChange }) {
  return (
    <div style={{ display: "flex", background: C.fog, borderRadius: 13, padding: 3, gap: 2 }}>
      {items.map((it) => (
        <button key={it.value} onClick={() => onChange(it.value)}
          style={{
            flex: 1, padding: "8px 6px", borderRadius: 10, border: "none", cursor: "pointer",
            background: value === it.value ? C.white : "transparent",
            color: value === it.value ? C.jet : C.slate, fontWeight: 600, fontSize: 12.5,
            boxShadow: value === it.value ? "0 1px 3px rgba(0,0,0,.08)" : "none", ...fBody,
          }}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 4px 14px" }}>
      <div style={{ width: 34 }}>
        {onBack && (
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 11, background: C.fog, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color={C.jet} />
          </button>
        )}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: C.jet, ...fDisplay }}>{title}</div>
      <div style={{ width: 34, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.slate }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: C.fog, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Icon size={22} color={C.slateLight} />
      </div>
      <div style={{ fontWeight: 600, color: C.jet, marginBottom: 4, ...fDisplay }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "absolute", bottom: 96, left: 16, right: 16, background: C.jet, color: C.white,
      padding: "12px 14px", borderRadius: 14, fontSize: 13, fontWeight: 500, display: "flex",
      alignItems: "center", gap: 8, zIndex: 60, boxShadow: "0 8px 24px rgba(0,0,0,.25)", ...fBody,
    }}>
      <CheckCircle2 size={16} color={C.orange} />
      {toast}
    </div>
  );
}

function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M64 14 L30 32 L30 68 L64 86 L64 68 L46 58 L46 42 L64 32 Z" fill={C.jet} />
      <polygon points="52,6 88,6 70,26 40,26" fill={C.orange} />
    </svg>
  );
}
function Wordmark({ size = 20, dark }) {
  return (
    <span style={{ fontSize: size, fontWeight: 600, ...fDisplay }}>
      <span style={{ color: dark ? C.white : C.jet }}>Coach</span>
      <span style={{ color: dark ? "#B9BCC4" : C.slateLight, fontWeight: 500 }}>Link</span>
    </span>
  );
}

const KEYFRAMES = `
@keyframes clPulse { 0%,100%{opacity:1} 50%{opacity:.25} }
@keyframes clFadeUp { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
`;

function BottomTabs({ items, value, onChange }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, background: C.white,
      borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 4px 22px", zIndex: 40,
    }}>
      {items.map((it) => {
        const active = value === it.value;
        const Icon = it.icon;
        return (
          <button key={it.value} onClick={() => onChange(it.value)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", position: "relative" }}>
            {it.badge ? (
              <span style={{ position: "absolute", top: -1, right: "28%", width: 7, height: 7, borderRadius: 99, background: C.orange }} />
            ) : null}
            <Icon size={20} strokeWidth={active ? 2.4 : 1.9} color={active ? C.orange : C.slateLight} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? C.jet : C.slateLight, ...fBody }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
   ONBOARDING / AUTH SCREENS
   ========================================================================= */
function ScreenSplash({ nav }) {
  return (
    <div style={{ height: "100%", background: C.jet, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center" }}>
      <div style={{ animation: "clFadeUp .5s ease" }}>
        <LogoMark size={64} />
      </div>
      <div style={{ marginTop: 18 }}><Wordmark size={26} dark /></div>
      <div style={{ color: "#9CA0AC", fontSize: 14, marginTop: 10, lineHeight: 1.5, ...fBody }}>
        Find a coach you trust, or build your coaching business — all in one place.
      </div>
      <div style={{ marginTop: 40, width: "100%" }}>
        <Btn full onClick={() => nav("role-select")}>Get started <ArrowRight size={16} /></Btn>
        <div style={{ marginTop: 14 }}>
          <button onClick={() => nav("auth", { mode: "login" })} style={{ background: "none", border: "none", color: "#9CA0AC", fontSize: 13.5, cursor: "pointer", ...fBody }}>
            Already have an account? <span style={{ color: C.white, fontWeight: 600 }}>Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenRoleSelect({ nav, setRole }) {
  const Option = ({ role, title, body, icon: Icon }) => (
    <button onClick={() => { setRole(role); nav("auth", { mode: "signup" }); }}
      style={{ width: "100%", textAlign: "left", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 16, display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer", marginBottom: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: C.orangeTint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={C.orange} />
      </div>
      <div>
        <div style={{ fontWeight: 600, color: C.jet, fontSize: 15.5, marginBottom: 3, ...fDisplay }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.slate, lineHeight: 1.5, ...fBody }}>{body}</div>
      </div>
    </button>
  );
  return (
    <div style={{ padding: "24px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <LogoMark size={34} />
      <div style={{ fontSize: 24, fontWeight: 600, color: C.jet, marginTop: 22, ...fDisplay }}>What brings you<br />to CoachLink?</div>
      <div style={{ fontSize: 13.5, color: C.slate, marginTop: 6, marginBottom: 22, ...fBody }}>You can add a coaching profile later from the same account.</div>
      <Option role="client" icon={Search} title="Find a coach" body="Search, book and pay for sessions with verified coaches near you." />
      <Option role="coach" icon={Users} title="Coach others" body="List your services, manage bookings and get paid automatically." />
      <div style={{ marginTop: "auto", textAlign: "center" }}>
        <button onClick={() => nav("auth", { mode: "login" })} style={{ background: "none", border: "none", color: C.slate, fontSize: 13.5, cursor: "pointer", ...fBody }}>
          Already have an account? <span style={{ color: C.orange, fontWeight: 600 }}>Log in</span>
        </button>
      </div>
    </div>
  );
}

function ScreenAuth({ nav, params, role, toast }) {
  const [mode, setMode] = useState(params?.mode || "signup");
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="" onBack={() => nav("role-select")} />
      <div style={{ fontSize: 24, fontWeight: 600, color: C.jet, ...fDisplay }}>{mode === "signup" ? "Create your account" : "Welcome back"}</div>
      <div style={{ fontSize: 13.5, color: C.slate, marginTop: 6, marginBottom: 20, ...fBody }}>
        {role === "coach" ? "Signing up as a Coach." : "Signing up as a Client."} <button onClick={() => nav("role-select")} style={{ background: "none", border: "none", color: C.orange, fontWeight: 600, cursor: "pointer", fontSize: 13.5 }}>Change</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Field label="Full name" placeholder="Sarah Lin" show={mode === "signup"} />
        <Field label="Email" placeholder="you@email.com" icon={Mail} />
        <Field label="Password" placeholder="••••••••" type={showPw ? "text" : "password"} rightIcon={showPw ? EyeOff : Eye} onRight={() => setShowPw((s) => !s)} />
      </div>

      <div style={{ marginTop: 18 }}>
        <Btn full onClick={() => nav("tnc")}>{mode === "signup" ? "Create account" : "Log in"}</Btn>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 12, color: C.slateLight, ...fBody }}>or</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      <Btn full variant="dark" icon={Fingerprint} onClick={() => { toast("Face ID recognised — welcome back"); nav("client-home"); }}>
        Continue with Face ID
      </Btn>
      <div style={{ marginTop: 10 }}>
        <Btn full variant="outline" onClick={() => { toast("Signed in with Google"); nav("tnc"); }}>Continue with Google</Btn>
      </div>

      <div style={{ marginTop: "auto", textAlign: "center", paddingBottom: 22 }}>
        <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ background: "none", border: "none", color: C.slate, fontSize: 13, cursor: "pointer", ...fBody }}>
          {mode === "signup" ? "Already have an account? " : "New to CoachLink? "}
          <span style={{ color: C.orange, fontWeight: 600 }}>{mode === "signup" ? "Log in" : "Sign up"}</span>
        </button>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", icon: Icon, rightIcon: RightIcon, onRight, show = true }) {
  if (!show) return null;
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.jet, marginBottom: 6, ...fBody }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${C.border}`, borderRadius: 13, padding: "11px 13px" }}>
        {Icon && <Icon size={16} color={C.slateLight} />}
        <input placeholder={placeholder} type={type} style={{ border: "none", outline: "none", flex: 1, fontSize: 14, ...fBody }} />
        {RightIcon && <button onClick={onRight} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><RightIcon size={16} color={C.slateLight} /></button>}
      </div>
    </div>
  );
}

function ScreenTnc({ nav, role, toast }) {
  const [agree, setAgree] = useState(false);
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Terms & Privacy" onBack={() => nav("auth")} />
      <Badge tone="neutral">Version 2.1 · Updated Jun 2026</Badge>
      <div style={{ marginTop: 14, flex: 1, overflowY: "auto", fontSize: 13, color: C.slate, lineHeight: 1.7, ...fBody }}>
        <p style={{ marginBottom: 12 }}>By continuing you agree to CoachLink's Terms of Service and Privacy Policy. Key points:</p>
        {[
          "We collect your location to show nearby coaches and enable travel-radius search.",
          "Payment details are processed by our PCI-compliant payment partner — CoachLink never stores full card numbers.",
          "If you're booking for someone under 18, a parent or guardian must provide consent before the session is confirmed.",
          "Coaches working with minors must hold a valid Working with Children Check, verified before their profile goes live.",
          "You can request a full export or deletion of your data at any time from Account Settings.",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <Check size={14} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 0", borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setAgree(!agree)} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "none", border: "none", cursor: "pointer", textAlign: "left", marginBottom: 12 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${agree ? C.orange : C.border}`, background: agree ? C.orange : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            {agree && <Check size={13} color={C.white} />}
          </div>
          <span style={{ fontSize: 13, color: C.jet, ...fBody }}>I have read and agree to the Terms of Service and Privacy Policy.</span>
        </button>
        <Btn full disabled={!agree} onClick={() => {
          toast("Terms accepted");
          if (role === "coach") nav("verification"); else nav("client-home");
        }}>Accept & continue</Btn>
      </div>
    </div>
  );
}

function ScreenVerification({ nav, toast }) {
  const [worksWithMinors, setWorksWithMinors] = useState(true);
  const [docs, setDocs] = useState({ id: false, wwcc: false, quals: false });
  const allDone = docs.id && (!worksWithMinors || docs.wwcc) && docs.quals;
  const Row = ({ k, title, body }) => (
    <Card style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.jet, ...fDisplay }}>{title}</div>
          <div style={{ fontSize: 12, color: C.slate, marginTop: 2, ...fBody }}>{body}</div>
        </div>
        {docs[k] ? <Badge tone="success" icon={CheckCircle2}>Uploaded</Badge> :
          <Btn size="sm" variant="secondary" icon={Upload} onClick={() => setDocs((d) => ({ ...d, [k]: true }))}>Upload</Btn>}
      </div>
    </Card>
  );
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Get verified" />
      <div style={{ fontSize: 13, color: C.slate, marginBottom: 16, ...fBody }}>
        Verification builds trust with clients and unlocks bookings. Most reviews complete within 2 business days.
      </div>
      <Row k="id" title="Identity document" body="Driver's licence or passport" />
      <Card style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fBody }}>I coach clients under 18</div>
          <Toggle on={worksWithMinors} onClick={() => setWorksWithMinors((v) => !v)} />
        </div>
      </Card>
      {worksWithMinors && <Row k="wwcc" title="Working with Children Check" body="Required to coach minors — state/territory issued" />}
      <Row k="quals" title="Coaching qualifications" body="Certifications relevant to your sport (optional but recommended)" />

      <div style={{ marginTop: "auto", padding: "14px 0" }}>
        <Btn full disabled={!allDone} onClick={() => { toast("Documents submitted for review"); nav("coach-dashboard"); }}>
          Submit for review
        </Btn>
        <div style={{ marginTop: 10 }}>
          <Btn full variant="ghost" onClick={() => { toast("You can finish verification later"); nav("coach-dashboard"); }}>Finish later</Btn>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   CLIENT — DISCOVERY
   ========================================================================= */
function CoachListCard({ coach, onOpen, fav, onFav }) {
  return (
    <Card onClick={onOpen} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar name={coach.name} size={54} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.jet, ...fDisplay }}>{coach.name}</div>
              <div style={{ fontSize: 12.5, color: C.slate, ...fBody }}>{coach.sport}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onFav(); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Heart size={18} color={fav ? C.orange : C.slateLight} fill={fav ? C.orange : "none"} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: C.jet, fontWeight: 600, ...fBody }}>
              <Star size={12} fill={C.orange} color={C.orange} /> {coach.rating} <span style={{ color: C.slateLight, fontWeight: 400 }}>({coach.reviews})</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12.5, color: C.slate, ...fBody }}>
              <MapPin size={12} /> {coach.distanceKm} km
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {coach.verified.identity && <Badge tone="success" icon={BadgeCheck}>Verified</Badge>}
              {coach.instantBook && <Badge tone="orange" icon={Sparkles}>Instant Book</Badge>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.jet, ...fDisplay }}>${coach.packages[0].price}<span style={{ fontSize: 11, fontWeight: 500, color: C.slate }}>/session</span></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ScreenClientHome({ nav, favorites, toggleFav }) {
  const [view, setView] = useState("list");
  const [sportFilter, setSportFilter] = useState("All");
  const filtered = COACHES.filter((c) => sportFilter === "All" || c.sport === sportFilter);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12.5, color: C.slate, ...fBody }}>Good morning</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, ...fDisplay }}>Find your coach</div>
          </div>
          <button onClick={() => nav("client-profile")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ position: "relative" }}>
              <Bell size={22} color={C.jet} />
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: C.orange, borderRadius: 99, border: `1.5px solid ${C.white}` }} />
            </div>
          </button>
        </div>

        <button onClick={() => nav("search-filters")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: C.fog, border: "none", borderRadius: 14, padding: "13px 14px", marginTop: 16, cursor: "pointer" }}>
          <Search size={16} color={C.slateLight} />
          <span style={{ fontSize: 13.5, color: C.slateLight, ...fBody }}>Sport, coach name or suburb</span>
          <Filter size={15} color={C.slate} style={{ marginLeft: "auto" }} />
        </button>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 14, paddingBottom: 4 }}>
          <Chip active={sportFilter === "All"} onClick={() => setSportFilter("All")}>All sports</Chip>
          {SPORTS.map((s) => <Chip key={s} active={sportFilter === s} onClick={() => setSportFilter(s)}>{s}</Chip>)}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.jet, ...fDisplay }}>
            <Navigation size={13} color={C.orange} /> Coaches near you
          </div>
          <SegTabs value={view} onChange={setView} items={[{ value: "list", label: "List" }, { value: "map", label: "Map" }]} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 100px" }}>
        {view === "map" ? <MapView coaches={filtered} onOpen={(id) => nav("coach-profile", { id })} /> :
          filtered.map((c) => (
            <CoachListCard key={c.id} coach={c} fav={favorites.includes(c.id)} onFav={() => toggleFav(c.id)} onOpen={() => nav("coach-profile", { id: c.id })} />
          ))}
      </div>
    </div>
  );
}

function MapView({ coaches, onOpen }) {
  const positions = [[20, 30], [60, 15], [40, 55], [78, 45], [25, 70], [65, 75]];
  return (
    <div style={{ position: "relative", height: 320, borderRadius: 18, overflow: "hidden", background: C.fog, marginBottom: 16, border: `1px solid ${C.border}` }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <rect width="100" height="100" fill={C.fog} />
        {[10, 30, 50, 70, 90].map((x) => <line key={"v" + x} x1={x} y1="0" x2={x} y2="100" stroke="#E9EAEE" strokeWidth="0.4" />)}
        {[10, 30, 50, 70, 90].map((y) => <line key={"h" + y} x1="0" y1={y} x2="100" y2={y} stroke="#E9EAEE" strokeWidth="0.4" />)}
      </svg>
      {coaches.slice(0, 6).map((c, i) => {
        const [x, y] = positions[i % positions.length];
        return (
          <button key={c.id} onClick={() => onOpen(c.id)} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-100%)",
            background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{ background: C.jet, color: C.white, fontSize: 11, fontWeight: 700, padding: "5px 9px", borderRadius: 10, whiteSpace: "nowrap", marginBottom: 2, ...fBody }}>
              ${c.packages[0].price}
            </div>
            <MapPin size={22} color={C.orange} fill={C.orange} />
          </button>
        );
      })}
      <div style={{ position: "absolute", bottom: 10, left: 10, background: C.white, borderRadius: 10, padding: "5px 9px", fontSize: 10.5, color: C.slate, display: "flex", alignItems: "center", gap: 4, ...fBody }}>
        <Navigation size={11} color={C.orange} /> Using your location
      </div>
    </div>
  );
}

function ScreenSearchFilters({ nav }) {
  const [sports, setSports] = useState([]);
  const [radius, setRadius] = useState(10);
  const [price, setPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const toggle = (s) => setSports((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Filters" onBack={() => nav("client-home")} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <SectionLabel>Sport</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {SPORTS.map((s) => <Chip key={s} active={sports.includes(s)} onClick={() => toggle(s)}>{s}</Chip>)}
        </div>

        <SectionLabel>Travel radius — up to {radius} km</SectionLabel>
        <input type="range" min="1" max="30" value={radius} onChange={(e) => setRadius(e.target.value)} style={{ width: "100%", accentColor: C.orange, marginBottom: 20 }} />

        <SectionLabel>Max price per session — ${price}</SectionLabel>
        <input type="range" min="20" max="150" step="5" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%", accentColor: C.orange, marginBottom: 20 }} />

        <SectionLabel>Minimum rating</SectionLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[0, 3, 4, 4.5].map((r) => (
            <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r === 0 ? "Any" : `${r}+`}</Chip>
          ))}
        </div>

        <SectionLabel>Availability</SectionLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["Today", "This week", "Weekends", "Mornings", "Evenings"].map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
      <div style={{ padding: "14px 0", display: "flex", gap: 10 }}>
        <Btn variant="outline" onClick={() => { setSports([]); setRadius(10); setPrice(100); setMinRating(0); }}>Reset</Btn>
        <div style={{ flex: 1 }}><Btn full onClick={() => nav("client-home")}>Show results</Btn></div>
      </div>
    </div>
  );
}
function SectionLabel({ children }) {
  return <div style={{ fontSize: 12.5, fontWeight: 700, color: C.jet, marginBottom: 10, ...fDisplay }}>{children}</div>;
}

/* =========================================================================
   CLIENT — COACH PROFILE
   ========================================================================= */
function ScreenCoachProfile({ nav, params, favorites, toggleFav }) {
  const coach = COACHES.find((c) => c.id === params.id) || COACHES[0];
  const [tab, setTab] = useState("about");
  const fav = favorites.includes(coach.id);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 128, background: `linear-gradient(135deg, ${C.jet}, #33384A)`, position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <button onClick={() => nav("client-home")} style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color={C.white} />
          </button>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
          <button onClick={() => toggleFav(coach.id)} style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Heart size={16} color={C.white} fill={fav ? C.orange : "none"} />
          </button>
          <button style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Share2 size={15} color={C.white} />
          </button>
        </div>
      </div>

      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ marginTop: -34 }}>
          <Avatar name={coach.name} size={68} ring />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.jet, ...fDisplay }}>{coach.name}</div>
            <div style={{ fontSize: 13, color: C.slate, ...fBody }}>{coach.sport} · {coach.suburb}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: C.jet, ...fBody }}>
              <Star size={14} fill={C.orange} color={C.orange} /> {coach.rating}
            </div>
            <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>{coach.reviews} reviews</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {coach.verified.identity && <Badge tone="success" icon={ShieldCheck}>ID verified</Badge>}
          {coach.verified.wwcc && <Badge tone="success" icon={ShieldCheck}>WWCC verified</Badge>}
          {coach.verified.quals && <Badge tone="success" icon={BadgeCheck}>Qualifications checked</Badge>}
        </div>

        <div style={{ marginTop: 18 }}>
          <SegTabs value={tab} onChange={setTab} items={[
            { value: "about", label: "About" }, { value: "reels", label: "Reels" },
            { value: "packages", label: "Packages" }, { value: "reviews", label: "Reviews" },
          ]} />
        </div>

        {tab === "about" && (
          <div style={{ marginTop: 16 }}>
            <SectionLabel>Bio</SectionLabel>
            <p style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, marginBottom: 16, ...fBody }}>{coach.bio}</p>
            <SectionLabel>Coaching style</SectionLabel>
            <p style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, marginBottom: 16, ...fBody }}>{coach.style}</p>
            <SectionLabel>Experience</SectionLabel>
            <p style={{ fontSize: 13.5, color: C.slate, marginBottom: 16, ...fBody }}>{coach.experience}</p>
            <SectionLabel>Cancellation policy</SectionLabel>
            <p style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, marginBottom: 6, ...fBody }}>{coach.cancellationPolicy}</p>
          </div>
        )}

        {tab === "reels" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
            {Array.from({ length: coach.reelsCount }).map((_, i) => (
              <div key={i} style={{ aspectRatio: "3/4", borderRadius: 14, background: `linear-gradient(160deg, ${C.jetSoft}, ${C.jet})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: 99, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={14} color={C.white} fill={C.white} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "packages" && (
          <div style={{ marginTop: 16 }}>
            {coach.packages.map((p) => (
              <Card key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.jet, ...fDisplay }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.slate, marginTop: 3, ...fBody }}>{p.type} · {p.duration} min · {p.mode}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.jet, ...fDisplay }}>${p.price}</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Btn size="sm" full onClick={() => nav("booking-datetime", { coachId: coach.id, packageId: p.id })}>
                    {coach.instantBook ? "Book now" : "Request to book"}
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          <div style={{ marginTop: 16 }}>
            {REVIEWS.map((r) => (
              <Card key={r.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={r.name} size={30} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.slateLight, ...fBody }}>{r.date}</div>
                    </div>
                  </div>
                  <StarRow value={r.rating} />
                </div>
                <p style={{ fontSize: 13, color: C.slate, marginTop: 8, lineHeight: 1.55, ...fBody }}>{r.text}</p>
                {r.verified && <Badge tone="neutral" icon={CheckCircle2}>Verified booking</Badge>}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.border}`, padding: "12px 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.jet, ...fDisplay }}>${coach.packages[0].price}</div>
          <div style={{ fontSize: 11, color: C.slate, ...fBody }}>from / session</div>
        </div>
        <div style={{ flex: 1 }}>
          <Btn full onClick={() => nav("booking-datetime", { coachId: coach.id, packageId: coach.packages[0].id })}>
            {coach.instantBook ? "Book now" : "Request to book"}
          </Btn>
        </div>
        <button onClick={() => nav("chat-thread", { name: coach.name })} style={{ width: 46, height: 46, borderRadius: 14, background: C.fog, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <MessageCircle size={18} color={C.jet} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   CLIENT — BOOKING FLOW
   ========================================================================= */
function ScreenBookingDateTime({ nav, params, setDraft }) {
  const coach = COACHES.find((c) => c.id === params.coachId);
  const pkg = coach.packages.find((p) => p.id === params.packageId);
  const days = Object.keys(coach.availability);
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(null);
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Choose a time" onBack={() => nav("coach-profile", { id: coach.id })} />
      <Card style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <Avatar name={coach.name} size={42} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.jet, ...fDisplay }}>{pkg.name}</div>
          <div style={{ fontSize: 12, color: C.slate, ...fBody }}>with {coach.name} · {pkg.duration} min · ${pkg.price}</div>
        </div>
      </Card>

      <SectionLabel>Day</SectionLabel>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {days.map((d) => <Chip key={d} active={day === d} onClick={() => { setDay(d); setTime(null); }}>{d}</Chip>)}
      </div>

      <SectionLabel>Available times · real-time</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {coach.availability[day].map((t) => (
          <button key={t} onClick={() => setTime(t)} style={{
            padding: "12px 0", borderRadius: 12, border: `1.5px solid ${time === t ? C.orange : C.border}`,
            background: time === t ? C.orangeTint : C.white, color: time === t ? C.orange : C.jet,
            fontWeight: 600, fontSize: 13.5, cursor: "pointer", ...fBody,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: C.fog, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Info size={14} color={C.slate} style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: C.slate, lineHeight: 1.5, ...fBody }}>Only real-time open slots are shown — {coach.name.split(" ")[0]}'s calendar updates automatically once you book.</span>
      </div>

      <div style={{ marginTop: "auto", padding: "14px 0" }}>
        <Btn full disabled={!time} onClick={() => { setDraft({ coach, pkg, day, time, mode: pkg.mode }); nav("booking-review"); }}>Continue</Btn>
      </div>
    </div>
  );
}

function ScreenBookingReview({ nav, draft, setDraft, toast }) {
  const [under18, setUnder18] = useState(false);
  const [consent, setConsent] = useState(false);
  const fee = Math.round(draft.pkg.price * CONFIG.serviceFeeRate * 100) / 100;
  const total = draft.pkg.price + fee;
  const canContinue = !under18 || consent;
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Review booking" onBack={() => nav("booking-datetime", { coachId: draft.coach.id, packageId: draft.pkg.id })} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Card style={{ marginBottom: 14 }}>
          <Row label="Coach" value={draft.coach.name} />
          <Row label="Service" value={draft.pkg.name} />
          <Row label="When" value={`${draft.day}, ${draft.time}`} />
          <Row label="Location" value={draft.mode} last />
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, marginBottom: 6, ...fDisplay }}>Cancellation policy</div>
          <div style={{ fontSize: 12.5, color: C.slate, lineHeight: 1.55, ...fBody }}>{draft.coach.cancellationPolicy}</div>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fBody }}>This session is for someone under 18</div>
            <Toggle on={under18} onClick={() => setUnder18((v) => !v)} />
          </div>
          {under18 && (
            <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.jet, marginBottom: 8, ...fDisplay }}>Guardian consent</div>
              <Field label="Guardian full name" placeholder="Jamie Chen" />
              <div style={{ height: 10 }} />
              <Field label="Relationship to participant" placeholder="Parent" />
              <button onClick={() => setConsent(!consent)} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "none", border: "none", cursor: "pointer", textAlign: "left", marginTop: 12 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${consent ? C.orange : C.border}`, background: consent ? C.orange : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {consent && <Check size={12} color={C.white} />}
                </div>
                <span style={{ fontSize: 12, color: C.jet, lineHeight: 1.5, ...fBody }}>I confirm I am the parent or legal guardian and consent to this booking, including CoachLink's handling of the participant's data.</span>
              </button>
            </div>
          )}
        </Card>

        <Card>
          <Row label="Session" value={`$${draft.pkg.price.toFixed(2)}`} />
          <Row label="Service fee" value={`$${fee.toFixed(2)}`} />
          <Row label="Total" value={`$${total.toFixed(2)}`} bold last />
        </Card>
      </div>
      <div style={{ padding: "14px 0" }}>
        <Btn full disabled={!canContinue} onClick={() => { setDraft({ ...draft, total, under18 }); nav("payment"); }}>Continue to payment</Btn>
      </div>
    </div>
  );
}

function Row({ label, value, bold, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.slate, ...fBody }}>{label}</span>
      <span style={{ fontSize: 13, color: C.jet, fontWeight: bold ? 700 : 500, ...fBody }}>{value}</span>
    </div>
  );
}

function ScreenPayment({ nav, draft, toast, addBooking, biometric }) {
  const [confirming, setConfirming] = useState(false);
  const pay = () => {
    if (biometric) { setConfirming(true); setTimeout(() => { setConfirming(false); finish(); }, 1100); }
    else finish();
  };
  const finish = () => {
    addBooking(draft);
    toast("Payment confirmed");
    nav("booking-confirmation");
  };
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <TopBar title="Payment" onBack={() => nav("booking-review")} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Btn full variant="dark" onClick={pay}>Pay ${draft.total.toFixed(2)} with  Pay</Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} /><span style={{ fontSize: 11.5, color: C.slateLight, ...fBody }}>or pay by card</span><div style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <SectionLabel>Saved payment methods</SectionLabel>
        <Card style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 24, borderRadius: 5, background: C.jet, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={13} color={C.white} />
          </div>
          <div style={{ fontSize: 13, color: C.jet, fontWeight: 500, ...fBody }}>Visa •••• 4821</div>
          <CheckCircle2 size={16} color={C.orange} style={{ marginLeft: "auto" }} />
        </Card>
        <Btn variant="outline" size="sm" icon={Plus}>Add new card</Btn>

        <div style={{ marginTop: 20 }}>
          <Field label="Promo code" placeholder="Enter code" />
        </div>

        <Card style={{ marginTop: 20 }}>
          <Row label="Total due today" value={`$${draft.total.toFixed(2)}`} bold last />
        </Card>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 14 }}>
          <Lock size={13} color={C.slateLight} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: C.slateLight, lineHeight: 1.5, ...fBody }}>Funds are held securely and only released to {draft.coach.name.split(" ")[0]} once you confirm the session is complete.</span>
        </div>
      </div>
      <div style={{ padding: "14px 0" }}>
        <Btn full onClick={pay}>Pay & confirm booking</Btn>
      </div>

      {confirming && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(22,24,29,.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 70, borderRadius: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Fingerprint size={30} color={C.white} />
          </div>
          <div style={{ color: C.white, fontSize: 14, fontWeight: 600, ...fBody }}>Confirm with Face ID</div>
        </div>
      )}
    </div>
  );
}

function ScreenBookingConfirmation({ nav, draft, toast }) {
  const [synced, setSynced] = useState(false);
  const [locShare, setLocShare] = useState(false);
  return (
    <div style={{ padding: "28px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: 20, background: C.successTint, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <CheckCircle2 size={28} color={C.success} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.jet, ...fDisplay }}>
          {draft.coach.instantBook ? "Booking confirmed" : "Request sent"}
        </div>
        <div style={{ fontSize: 13, color: C.slate, marginTop: 4, ...fBody }}>
          {draft.coach.instantBook ? `You're all set with ${draft.coach.name}.` : `${draft.coach.name} will respond within 24 hours.`}
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <Row label="Service" value={draft.pkg.name} />
        <Row label="When" value={`${draft.day}, ${draft.time}`} />
        <Row label="Location" value={draft.mode} last />
      </Card>

      <Card style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={16} color={C.jet} />
            <span style={{ fontSize: 13, color: C.jet, fontWeight: 500, ...fBody }}>Sync to device calendar</span>
          </div>
          <Toggle on={synced} onClick={() => { setSynced((v) => !v); toast(!synced ? "Added to your calendar" : "Removed from calendar"); }} />
        </div>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Navigation size={16} color={C.jet} />
            <span style={{ fontSize: 13, color: C.jet, fontWeight: 500, ...fBody }}>Share live location during session</span>
          </div>
          <Toggle on={locShare} onClick={() => setLocShare((v) => !v)} />
        </div>
      </Card>

      <div style={{ marginTop: "auto", padding: "14px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn full variant="secondary" icon={MessageCircle} onClick={() => nav("chat-thread", { name: draft.coach.name })}>Message {draft.coach.name.split(" ")[0]}</Btn>
        <Btn full onClick={() => nav("client-dashboard")}>Go to dashboard</Btn>
      </div>
    </div>
  );
}

/* =========================================================================
   CLIENT — DASHBOARD
   ========================================================================= */
function ScreenClientDashboard({ nav, bookings, favorites, offline }) {
  const [tab, setTab] = useState("upcoming");
  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const favCoaches = COACHES.filter((c) => favorites.includes(c.id));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, ...fDisplay }}>My sessions</div>
        {offline && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.jet, color: C.white, padding: "9px 12px", borderRadius: 12, marginTop: 12, fontSize: 12, ...fBody }}>
            <WifiOff size={14} color={C.orange} /> You're offline — showing your last saved sessions.
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <SegTabs value={tab} onChange={setTab} items={[
            { value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" },
            { value: "favorites", label: "Favorites" }, { value: "payments", label: "Payments" },
          ]} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {tab === "upcoming" && (upcoming.length ? upcoming.map((b) => <BookingCard key={b.id} b={b} nav={nav} />) :
          <EmptyState icon={Calendar} title="No upcoming sessions" body="Search for a coach to book your next session." />)}

        {tab === "past" && (past.length ? past.map((b) => <BookingCard key={b.id} b={b} nav={nav} past />) :
          <EmptyState icon={ClipboardList} title="No past sessions yet" body="Completed sessions will show up here." />)}

        {tab === "favorites" && (favCoaches.length ? favCoaches.map((c) => (
          <CoachListCard key={c.id} coach={c} fav onFav={() => {}} onOpen={() => nav("coach-profile", { id: c.id })} />
        )) : <EmptyState icon={Heart} title="No favorites yet" body="Tap the heart on a coach's profile to save them here." />)}

        {tab === "payments" && (
          <>
            {[...upcoming, ...past].map((b) => (
              <Card key={b.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fBody }}>{b.service}</div>
                  <div style={{ fontSize: 11.5, color: C.slate, marginTop: 2, ...fBody }}>{b.date} · {b.coachName}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.jet, ...fDisplay }}>${b.price}</div>
                  <Download size={15} color={C.slateLight} />
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function BookingCard({ b, nav, past }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar name={b.coachName || b.clientName} size={42} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.jet, ...fDisplay }}>{b.service}</div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 2, ...fBody }}>{b.coachName || b.clientName}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.slate, marginTop: 4, ...fBody }}>
              <Clock size={11} /> {b.date} · {b.time}
            </div>
          </div>
        </div>
        <StatusPill status={b.status} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {!past ? (
          <>
            <Btn size="sm" variant="secondary" full onClick={() => {}}>Reschedule</Btn>
            <Btn size="sm" variant="outline" full onClick={() => {}}>Cancel</Btn>
            <Btn size="sm" variant="dark" icon={MessageCircle} onClick={() => nav("chat-thread", { name: b.coachName || b.clientName })} />
          </>
        ) : (
          b.status === "completed" && !b.reviewed ? (
            <Btn size="sm" full onClick={() => nav("leave-review", { bookingId: b.id, name: b.coachName })}>Leave a review</Btn>
          ) : b.reviewed ? (
            <Badge tone="success" icon={CheckCircle2}>Review submitted</Badge>
          ) : null
        )}
      </div>
    </Card>
  );
}

function ScreenLeaveReview({ nav, params, toast }) {
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState([]);
  const options = ["Great communicator", "Punctual", "Well prepared", "Motivating", "Flexible"];
  const toggle = (t) => setTags((arr) => arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]);
  return (
    <div style={{ padding: "20px 20px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar title="Leave a review" onBack={() => nav("client-dashboard")} />
      <div style={{ textAlign: "center", marginTop: 6, marginBottom: 20 }}>
        <Avatar name={params.name} size={54} />
        <div style={{ fontSize: 15, fontWeight: 600, color: C.jet, marginTop: 10, ...fDisplay }}>{params.name}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setRating(i)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Star size={30} fill={i <= rating ? C.orange : "none"} color={i <= rating ? C.orange : C.slateLight} />
            </button>
          ))}
        </div>
      </div>
      <SectionLabel>What stood out?</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {options.map((t) => <Chip key={t} active={tags.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
      </div>
      <textarea placeholder="Tell other clients about your session..." rows={4}
        style={{ border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 13, fontSize: 13.5, resize: "none", outline: "none", ...fBody }} />
      <div style={{ fontSize: 11, color: C.slateLight, marginTop: 10, ...fBody }}>Only clients with a verified booking can leave a review. Your review is moderated before it appears publicly.</div>
      <div style={{ marginTop: "auto", padding: "14px 0" }}>
        <Btn full onClick={() => { toast("Review submitted for moderation"); nav("client-dashboard"); }}>Submit review</Btn>
      </div>
    </div>
  );
}

/* =========================================================================
   MESSAGING (shared by client + coach)
   ========================================================================= */
function ScreenMessages({ nav, role }) {
  const threads = role === "coach" ? COACH_THREADS : THREADS;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, ...fDisplay }}>Messages</div>
          <button onClick={() => nav("support")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <HelpCircle size={22} color={C.jet} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px 100px" }}>
        {threads.map((t) => (
          <button key={t.id} onClick={() => nav("chat-thread", { name: t.withName, context: t.context })}
            style={{ width: "100%", display: "flex", gap: 12, alignItems: "center", padding: "12px 4px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
            <Avatar name={t.withName} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.jet, ...fDisplay }}>{t.withName}</span>
                <span style={{ fontSize: 11, color: C.slateLight, ...fBody }}>{t.time}</span>
              </div>
              <div style={{ fontSize: 11, color: C.orange, fontWeight: 600, marginTop: 1, ...fBody }}>{t.context}</div>
              <div style={{ fontSize: 12.5, color: C.slate, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...fBody }}>{t.lastMsg}</div>
            </div>
            {t.unread > 0 && <span style={{ width: 19, height: 19, borderRadius: 99, background: C.orange, color: C.white, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.unread}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenChatThread({ nav, params, role }) {
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: m.length + 1, from: "me", text: input, time: "now" }]);
    setInput("");
  };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => nav(role === "coach" ? "coach-messages" : "client-messages")} style={{ width: 34, height: 34, borderRadius: 11, background: C.fog, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color={C.jet} />
          </button>
          <Avatar name={params.name} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.jet, ...fDisplay }}>{params.name}</div>
            {params.context && <div style={{ fontSize: 11, color: C.orange, fontWeight: 600, ...fBody }}>{params.context}</div>}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "10px 13px", borderRadius: 16,
              borderBottomRightRadius: m.from === "me" ? 4 : 16, borderBottomLeftRadius: m.from === "me" ? 16 : 4,
              background: m.from === "me" ? C.orange : C.fog, color: m.from === "me" ? C.white : C.jet, fontSize: 13.5, lineHeight: 1.45, ...fBody,
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 16px 20px", display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${C.border}` }}>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}><Paperclip size={19} color={C.slate} /></button>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}><MapPin size={19} color={C.slate} /></button>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message..."
          style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "9px 14px", fontSize: 13.5, outline: "none", ...fBody }} />
        <button onClick={send} style={{ width: 36, height: 36, borderRadius: 99, background: C.orange, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Send size={15} color={C.white} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   CLIENT — PROFILE / SETTINGS
   ========================================================================= */
function ScreenClientProfile({ nav, biometric, setBiometric, toast, addCoachRole }) {
  const Row2 = ({ icon: Icon, label, onClick, right }) => (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 4px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
      <Icon size={17} color={C.jet} />
      <span style={{ flex: 1, fontSize: 13.5, color: C.jet, fontWeight: 500, ...fBody }}>{label}</span>
      {right || <ChevronRight size={16} color={C.slateLight} />}
    </button>
  );
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 18, ...fDisplay }}>Account</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Avatar name="Sarah Lin" size={58} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.jet, ...fDisplay }}>Sarah Lin</div>
            <div style={{ fontSize: 12.5, color: C.slate, ...fBody }}>sarah.lin@email.com</div>
          </div>
        </div>

        <Btn full variant="secondary" icon={Users} onClick={() => { addCoachRole(); toast("Coach profile added — switch anytime"); }}>Add a coaching profile</Btn>

        <div style={{ marginTop: 22 }}>
          <SectionLabel>Profile</SectionLabel>
          <Row2 icon={Edit3} label="Edit profile" onClick={() => {}} />
          <Row2 icon={Bell} label="Notification preferences" onClick={() => {}} />
          <Row2 icon={CreditCard} label="Payment methods" onClick={() => {}} />
        </div>

        <div style={{ marginTop: 22 }}>
          <SectionLabel>Security</SectionLabel>
          <Row2 icon={Fingerprint} label="Biometric login" right={<Toggle on={biometric} onClick={() => setBiometric((v) => !v)} />} />
          <Row2 icon={Lock} label="Change password" onClick={() => {}} />
        </div>

        <div style={{ marginTop: 22 }}>
          <SectionLabel>Privacy</SectionLabel>
          <Row2 icon={FileText} label="Export my data" onClick={() => toast("We'll email your data export shortly")} />
          <Row2 icon={Shield} label="Privacy policy" onClick={() => {}} />
        </div>

        <div style={{ marginTop: 22 }}>
          <SectionLabel>Support</SectionLabel>
          <Row2 icon={HelpCircle} label="Help & FAQs" onClick={() => nav("support")} />
        </div>

        <div style={{ marginTop: 22 }}>
          <Row2 icon={LogOut} label="Log out" onClick={() => nav("splash")} />
          <button style={{ width: "100%", textAlign: "left", padding: "13px 4px", background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 13, color: "#D64545", fontWeight: 500, ...fBody }}>Deactivate account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COACH — DASHBOARD
   ========================================================================= */
function ScreenCoachDashboard({ nav, coachBookings, setCoachBookings, verified, toast, offline }) {
  const pending = coachBookings.filter((b) => b.status === "pending");
  const upcoming = coachBookings.filter((b) => b.status === "confirmed");
  const completed = coachBookings.filter((b) => b.status === "completed");
  const earningsThisWeek = upcoming.reduce((s, b) => s + b.price, 0);
  const grossPaid = completed.reduce((s, b) => s + b.price, 0);
  const commission = Math.round(grossPaid * CONFIG.commissionRate);

  const respond = (id, status) => setCoachBookings((arr) => arr.map((b) => b.id === id ? { ...b, status } : b));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12.5, color: C.slate, ...fBody }}>Welcome back</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, ...fDisplay }}>Josh's dashboard</div>
          </div>
          <button onClick={() => nav("coach-profile-edit")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Avatar name="Josh Whitfield" size={40} />
          </button>
        </div>

        {offline && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.jet, color: C.white, padding: "9px 12px", borderRadius: 12, marginTop: 14, fontSize: 12, ...fBody }}>
            <WifiOff size={14} color={C.orange} /> Offline — showing your last synced data.
          </div>
        )}

        {!verified && (
          <div onClick={() => nav("verification")} style={{ display: "flex", alignItems: "center", gap: 10, background: C.warnTint, padding: "12px 14px", borderRadius: 14, marginTop: 14, cursor: "pointer" }}>
            <AlertCircle size={16} color={C.orange} />
            <span style={{ fontSize: 12.5, color: C.jet, fontWeight: 500, flex: 1, ...fBody }}>Verification pending — finish to unlock bookings.</span>
            <ChevronRight size={15} color={C.orange} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
          <div style={{ background: C.jet, borderRadius: 18, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#9CA0AC", ...fBody }}>This week's earnings</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.white, marginTop: 4, ...fDisplay }}>${earningsThisWeek}</div>
          </div>
          <div style={{ background: C.orangeTint, borderRadius: 18, padding: 16 }}>
            <div style={{ fontSize: 11, color: C.orange, fontWeight: 600, ...fBody }}>Pending requests</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.jet, marginTop: 4, ...fDisplay }}>{pending.length}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <StatMini label="Upcoming" value={upcoming.length} icon={Calendar} />
          <StatMini label="Rating" value="4.8" icon={Star} />
          <StatMini label="Next payout" value="Fri" icon={Banknote} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 10 }}>
          <SectionLabel>Pending requests</SectionLabel>
          <button onClick={() => nav("coach-bookings")} style={{ background: "none", border: "none", color: C.orange, fontSize: 12, fontWeight: 600, cursor: "pointer", ...fBody }}>See all</button>
        </div>
        {pending.length === 0 && <div style={{ fontSize: 12.5, color: C.slateLight, marginBottom: 6, ...fBody }}>No pending requests right now.</div>}
        {pending.map((b) => (
          <Card key={b.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Avatar name={b.clientName} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fDisplay }}>{b.clientName}</div>
                <div style={{ fontSize: 12, color: C.slate, ...fBody }}>{b.service} · {b.date}, {b.time}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.jet, ...fDisplay }}>${b.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn size="sm" full onClick={() => { respond(b.id, "confirmed"); toast("Booking accepted"); }}>Accept</Btn>
              <Btn size="sm" full variant="outline" onClick={() => { respond(b.id, "cancelled"); toast("Booking declined"); }}>Decline</Btn>
            </div>
          </Card>
        ))}

        <div style={{ marginTop: 18, marginBottom: 10 }}><SectionLabel>Upcoming sessions</SectionLabel></div>
        {upcoming.length === 0 ? <div style={{ fontSize: 12.5, color: C.slateLight, ...fBody }}>Nothing scheduled yet.</div> :
          upcoming.map((b) => (
            <Card key={b.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={b.clientName} size={38} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>{b.clientName}</div>
                  <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>{b.date} · {b.time}</div>
                </div>
              </div>
              <StatusPill status="confirmed" />
            </Card>
          ))}

        <div style={{ marginTop: 18, marginBottom: 10 }}><SectionLabel>Recent reviews</SectionLabel></div>
        {REVIEWS.slice(0, 2).map((r) => (
          <Card key={r.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>{r.name}</div>
              <StarRow value={r.rating} size={11} />
            </div>
            <p style={{ fontSize: 12.5, color: C.slate, marginTop: 4, lineHeight: 1.5, ...fBody }}>{r.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
function StatMini({ label, value, icon: Icon }) {
  return (
    <Card style={{ flex: 1, textAlign: "center", padding: "12px 6px" }}>
      <Icon size={15} color={C.orange} style={{ margin: "0 auto 6px" }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: C.jet, ...fDisplay }}>{value}</div>
      <div style={{ fontSize: 10.5, color: C.slate, ...fBody }}>{label}</div>
    </Card>
  );
}

/* =========================================================================
   COACH — CALENDAR & AVAILABILITY
   ========================================================================= */
function ScreenCoachCalendar({ nav, toast }) {
  const [synced, setSynced] = useState(true);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["6:00", "7:00", "9:00", "16:00", "17:00", "18:00"];
  const [active, setActive] = useState({ "Tue-6:00": true, "Tue-7:00": true, "Thu-6:00": true, "Sat-9:00": true });
  const toggle = (k) => setActive((a) => ({ ...a, [k]: !a[k] }));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 14, ...fDisplay }}>Availability</div>

        <Card style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar size={17} color={C.jet} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>Sync with device calendar</div>
              <div style={{ fontSize: 11, color: C.slate, ...fBody }}>{synced ? "Connected — Google Calendar" : "Not connected"}</div>
            </div>
          </div>
          <Toggle on={synced} onClick={() => { setSynced((v) => !v); toast(!synced ? "Calendar connected" : "Calendar disconnected"); }} />
        </Card>

        <SectionLabel>Recurring weekly availability</SectionLabel>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: `70px repeat(${days.length}, 40px)`, gap: 6, minWidth: 400 }}>
            <div />
            {days.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: C.slate, ...fBody }}>{d}</div>)}
            {slots.map((s) => (
              <React.Fragment key={s}>
                <div style={{ fontSize: 11, color: C.slate, display: "flex", alignItems: "center", ...fBody }}>{s}</div>
                {days.map((d) => {
                  const k = `${d}-${s}`;
                  const on = active[k];
                  return (
                    <button key={k} onClick={() => toggle(k)} style={{
                      width: 40, height: 30, borderRadius: 8, cursor: "pointer",
                      background: on ? C.orange : C.fog, border: "none",
                    }} />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <SectionLabel>One-off exceptions</SectionLabel>
        <Card style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>Sat, 2 Aug — blocked</div>
            <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>Reason: Personal leave</div>
          </div>
          <Trash2 size={16} color={C.slateLight} />
        </Card>
        <Btn variant="outline" size="sm" icon={Plus} full onClick={() => toast("Exception added")}>Add exception</Btn>
      </div>
    </div>
  );
}

/* =========================================================================
   COACH — BOOKINGS
   ========================================================================= */
function ScreenCoachBookings({ nav, coachBookings, setCoachBookings, toast }) {
  const [tab, setTab] = useState("pending");
  const respond = (id, status) => setCoachBookings((arr) => arr.map((b) => b.id === id ? { ...b, status } : b));
  const list = coachBookings.filter((b) => tab === "pending" ? b.status === "pending" : tab === "upcoming" ? b.status === "confirmed" : b.status === "completed");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 14, ...fDisplay }}>Bookings</div>
        <SegTabs value={tab} onChange={setTab} items={[{ value: "pending", label: "Pending" }, { value: "upcoming", label: "Upcoming" }, { value: "completed", label: "Completed" }]} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {list.length === 0 && <EmptyState icon={ClipboardList} title="Nothing here" body="Bookings in this stage will appear here." />}
        {list.map((b) => (
          <Card key={b.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Avatar name={b.clientName} size={40} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fDisplay }}>{b.clientName}</div>
                  <div style={{ fontSize: 12, color: C.slate, ...fBody }}>{b.service}</div>
                  <div style={{ fontSize: 11.5, color: C.slate, marginTop: 2, ...fBody }}>{b.date} · {b.time} · {b.mode}</div>
                </div>
              </div>
              <StatusPill status={b.status} />
            </div>
            {tab === "pending" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Btn size="sm" full onClick={() => { respond(b.id, "confirmed"); toast("Booking accepted"); }}>Accept</Btn>
                <Btn size="sm" full variant="outline" onClick={() => { respond(b.id, "cancelled"); toast("Booking declined"); }}>Decline</Btn>
              </div>
            )}
            {tab === "completed" && (
              <div style={{ marginTop: 8, fontSize: 12, color: C.success, fontWeight: 600, ...fBody }}>
                Payout released: ${Math.round(b.price * (1 - CONFIG.commissionRate))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   COACH — SERVICES & PROFILE EDIT
   ========================================================================= */
function ScreenCoachProfileEdit({ nav, toast }) {
  const coach = COACHES[1];
  const [instantBook, setInstantBook] = useState(coach.instantBook);
  const [policy, setPolicy] = useState("Moderate");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 16, ...fDisplay }}>My coaching profile</div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar name={coach.name} size={72} />
            <button style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: 99, background: C.orange, border: `2px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Camera size={12} color={C.white} />
            </button>
          </div>
        </div>

        <SectionLabel>Bio</SectionLabel>
        <textarea defaultValue={coach.bio} rows={4} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 13, fontSize: 13, resize: "none", outline: "none", marginBottom: 18, ...fBody }} />

        <SectionLabel>Sports coached</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {[coach.sport, ...coach.tags].map((t) => <Chip key={t} active>{t}</Chip>)}
          <Chip icon={Plus}>Add</Chip>
        </div>

        <SectionLabel>Reels & photos</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 12, background: `linear-gradient(160deg, ${C.jetSoft}, ${C.jet})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={13} color={C.white} fill={C.white} />
            </div>
          ))}
          <button onClick={() => toast("Opening camera — trim clip before posting")} style={{ aspectRatio: "1", borderRadius: 12, border: `1.5px dashed ${C.border}`, background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Camera size={16} color={C.slate} />
          </button>
        </div>
        <div style={{ fontSize: 11, color: C.slateLight, marginBottom: 18, ...fBody }}>Trim clips right after capture before adding them to your profile.</div>

        <SectionLabel>Services & rates</SectionLabel>
        {coach.packages.map((p) => (
          <Card key={p.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fBody }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>{p.type} · {p.duration} min · {p.mode}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.jet, ...fDisplay }}>${p.price}</span>
              <Edit3 size={15} color={C.slateLight} />
            </div>
          </Card>
        ))}
        <Btn variant="outline" size="sm" icon={Plus} full onClick={() => toast("New package draft created")}>Add package</Btn>

        <div style={{ marginTop: 20 }}>
          <SectionLabel>Booking type</SectionLabel>
          <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>Instant Book</div>
              <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>{instantBook ? "Requests are auto-confirmed" : "You'll review each request"}</div>
            </div>
            <Toggle on={instantBook} onClick={() => setInstantBook((v) => !v)} />
          </Card>
        </div>

        <div style={{ marginTop: 20 }}>
          <SectionLabel>Cancellation policy</SectionLabel>
          <div style={{ display: "flex", gap: 8 }}>
            {["Flexible", "Moderate", "Strict"].map((p) => <Chip key={p} active={policy === p} onClick={() => setPolicy(p)}>{p}</Chip>)}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <SectionLabel>Verification</SectionLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge tone="success" icon={ShieldCheck}>ID verified</Badge>
            <Badge tone="success" icon={ShieldCheck}>WWCC verified</Badge>
            <Badge tone="success" icon={BadgeCheck}>Quals checked</Badge>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Btn full onClick={() => toast("Profile changes saved")}>Save changes</Btn>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COACH — EARNINGS
   ========================================================================= */
function ScreenCoachEarnings({ nav, coachBookings }) {
  const completed = coachBookings.filter((b) => b.status === "completed");
  const gross = completed.reduce((s, b) => s + b.price, 0);
  const commission = Math.round(gross * CONFIG.commissionRate);
  const net = gross - commission;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0", flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 16, ...fDisplay }}>Earnings</div>

        <div style={{ background: C.jet, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: "#9CA0AC", ...fBody }}>Available for payout</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.white, marginTop: 4, ...fDisplay }}>${net}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Badge tone="dark" icon={Banknote}>Next payout Fri</Badge>
            <Badge tone="dark" icon={Percent}>{Math.round(CONFIG.commissionRate * 100)}% commission</Badge>
          </div>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <Row label="Gross earnings" value={`$${gross}`} />
          <Row label="Platform commission" value={`-$${commission}`} />
          <Row label="Net payout" value={`$${net}`} bold last />
        </Card>

        <SectionLabel>Payout method</SectionLabel>
        <Card style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Wallet size={17} color={C.jet} />
          <span style={{ fontSize: 13, color: C.jet, fontWeight: 500, ...fBody }}>Bank account •••• 2210</span>
          <ChevronRight size={15} color={C.slateLight} style={{ marginLeft: "auto" }} />
        </Card>

        <SectionLabel>Transaction history</SectionLabel>
        {coachBookings.filter((b) => b.status === "completed").map((b) => (
          <Card key={b.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>{b.service}</div>
              <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>{b.date} · {b.clientName}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.success, ...fDisplay }}>+${Math.round(b.price * (1 - CONFIG.commissionRate))}</span>
              <Download size={14} color={C.slateLight} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SUPPORT — FAQ & ADMIN CHAT
   ========================================================================= */
function ScreenSupport({ nav, role }) {
  const [tab, setTab] = useState("faq");
  const [openIdx, setOpenIdx] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [query, setQuery] = useState("");
  const faqs = FAQS[role === "coach" ? "coach" : "client"].filter((f) => f.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <TopBar title="Support" onBack={() => nav(role === "coach" ? "coach-dashboard" : "client-home")} />
        <SegTabs value={tab} onChange={setTab} items={[{ value: "faq", label: "FAQs" }, { value: "chat", label: "Contact support" }]} />
      </div>

      {tab === "faq" ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.fog, borderRadius: 13, padding: "11px 13px", marginBottom: 16 }}>
            <Search size={15} color={C.slateLight} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles"
              style={{ border: "none", outline: "none", background: "none", flex: 1, fontSize: 13, ...fBody }} />
          </div>
          <Badge tone="neutral">{role === "coach" ? "Coach help" : "Client help"}</Badge>
          <div style={{ marginTop: 12 }}>
            {faqs.map((f, i) => (
              <Card key={i} style={{ marginBottom: 10 }} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, flex: 1, paddingRight: 10, ...fBody }}>{f.q}</span>
                  <ChevronDown size={16} color={C.slateLight} style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
                </div>
                {openIdx === i && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 12.5, color: C.slate, lineHeight: 1.6, ...fBody }}>{f.a}</p>
                    <button onClick={(e) => { e.stopPropagation(); setTab("chat"); setChatStarted(true); }} style={{ background: "none", border: "none", color: C.orange, fontWeight: 600, fontSize: 12, marginTop: 8, cursor: "pointer", ...fBody }}>
                      Didn't solve it? Contact support →
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "0 20px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <Badge tone="neutral">{role === "coach" ? "Coach account" : "Client account"}</Badge>
              <Badge tone="neutral">Recent booking: Tue, 22 Jul</Badge>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 20px" }}>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "80%", background: C.fog, borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 13px", fontSize: 13, color: C.jet, lineHeight: 1.5, ...fBody }}>
                Hi Sarah 👋 I'm the CoachLink support assistant. I can see your account details and recent booking already — what can I help with?
              </div>
            </div>
            {chatStarted && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <div style={{ maxWidth: "80%", background: C.orange, color: C.white, borderRadius: 16, borderBottomRightRadius: 4, padding: "10px 13px", fontSize: 13, lineHeight: 1.5, ...fBody }}>
                  The FAQ didn't quite answer my question.
                </div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ maxWidth: "80%", background: C.fog, borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 13px", fontSize: 13, color: C.jet, lineHeight: 1.5, ...fBody }}>
                Got it — connecting you with a member of our team now. Average reply time is under 10 minutes.
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 20px 20px", display: "flex", gap: 8, borderTop: `1px solid ${C.border}` }}>
            <input placeholder="Describe your issue..." style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "9px 14px", fontSize: 13.5, outline: "none", ...fBody }} />
            <button style={{ width: 36, height: 36, borderRadius: 99, background: C.orange, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={15} color={C.white} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   ADMIN
   ========================================================================= */
function ScreenAdmin({ nav, toast }) {
  const [tab, setTab] = useState("overview");
  const [queue, setQueue] = useState([
    { id: "v1", name: "Ravi Patel", sport: "Football", type: "Identity + WWCC" },
    { id: "v2", name: "Nina Torres", sport: "Athletics", type: "Qualifications" },
  ]);
  const decide = (id, ok) => { setQueue((q) => q.filter((x) => x.id !== id)); toast(ok ? "Coach approved" : "Coach rejected"); };
  const disputes = [
    { id: "d1", booking: "#4821", issue: "No-show claim", parties: "Sarah Lin vs. Josh Whitfield" },
    { id: "d2", booking: "#4790", issue: "Refund request", parties: "Marcus Webb vs. Maya Okafor" },
  ];
  const flagged = [
    { id: "f1", type: "Review", reason: "Reported as spam", content: "\"Best coach!! visit my site...\"" },
    { id: "f2", type: "Reel", reason: "Reported: inappropriate", content: "Uploaded 2 days ago" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.jet, marginBottom: 14, ...fDisplay }}>Admin console</div>
        <SegTabs value={tab} onChange={setTab} items={[
          { value: "overview", label: "Overview" }, { value: "verify", label: "Verify" },
          { value: "disputes", label: "Disputes" }, { value: "mod", label: "Moderate" }, { value: "settings", label: "Settings" },
        ]} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
              <StatBig label="GMV (30d)" value="$48.2k" icon={TrendingUp} />
              <StatBig label="Bookings (30d)" value="612" icon={ClipboardList} />
              <StatBig label="Active coaches" value="184" icon={Users} />
              <StatBig label="Churn (30d)" value="3.1%" icon={PieChart} />
            </div>
          </>
        )}

        {tab === "verify" && (queue.length ? queue.map((v) => (
          <Card key={v.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Avatar name={v.name} size={40} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fDisplay }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.slate, ...fBody }}>{v.sport} · Submitted: {v.type}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn size="sm" full onClick={() => decide(v.id, true)}>Approve</Btn>
              <Btn size="sm" full variant="outline" onClick={() => decide(v.id, false)}>Reject</Btn>
            </div>
          </Card>
        )) : <EmptyState icon={ShieldCheck} title="Queue clear" body="No verification requests waiting." />)}

        {tab === "disputes" && disputes.map((d) => (
          <Card key={d.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.jet, ...fDisplay }}>Booking {d.booking}</div>
              <Badge tone="orange">Open</Badge>
            </div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 3, ...fBody }}>{d.issue} · {d.parties}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn size="sm" variant="secondary" full>Refund</Btn>
              <Btn size="sm" variant="outline" full>Dismiss</Btn>
            </div>
          </Card>
        ))}

        {tab === "mod" && flagged.map((f) => (
          <Card key={f.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Badge tone="neutral" icon={Flag}>{f.type}</Badge>
              <span style={{ fontSize: 11, color: C.slateLight, ...fBody }}>{f.reason}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.jet, marginTop: 8, ...fBody }}>{f.content}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn size="sm" full variant="outline">Remove</Btn>
              <Btn size="sm" full variant="secondary">Keep</Btn>
            </div>
          </Card>
        ))}

        {tab === "settings" && (
          <>
            <SectionLabel>Commission rate</SectionLabel>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.jet, ...fDisplay }}>{Math.round(CONFIG.commissionRate * 100)}%</div>
              <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>Applied to every completed booking</div>
            </Card>
            <SectionLabel>Featured listings</SectionLabel>
            <Card style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.jet, fontWeight: 500, ...fBody }}>Homepage featured slots</span>
              <Toggle on={true} onClick={() => {}} />
            </Card>
            <SectionLabel>Active promotions</SectionLabel>
            <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.jet, ...fBody }}>WELCOME10</div>
                <div style={{ fontSize: 11.5, color: C.slate, ...fBody }}>10% off first booking</div>
              </div>
              <Badge tone="success">Active</Badge>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
function StatBig({ label, value, icon: Icon }) {
  return (
    <Card>
      <Icon size={15} color={C.orange} />
      <div style={{ fontSize: 20, fontWeight: 700, color: C.jet, marginTop: 8, ...fDisplay }}>{value}</div>
      <div style={{ fontSize: 11, color: C.slate, ...fBody }}>{label}</div>
    </Card>
  );
}

/* =========================================================================
   APP SHELL
   ========================================================================= */
const CLIENT_TABS = [
  { value: "client-home", label: "Discover", icon: Home },
  { value: "client-dashboard", label: "Bookings", icon: Calendar },
  { value: "client-messages", label: "Messages", icon: MessageCircle },
  { value: "client-profile", label: "Account", icon: User },
];
const COACH_TABS = [
  { value: "coach-dashboard", label: "Dashboard", icon: Home },
  { value: "coach-calendar", label: "Calendar", icon: Calendar },
  { value: "coach-bookings", label: "Bookings", icon: ClipboardList },
  { value: "coach-messages", label: "Messages", icon: MessageCircle },
  { value: "coach-profile-edit", label: "Profile", icon: User },
];

function StatusBar({ dark }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px 6px", fontSize: 13, fontWeight: 600, color: dark ? C.white : C.jet, ...fBody }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ fontSize: 10 }}>●●●●</span>
        <span style={{ fontSize: 10 }}>Wi‑Fi</span>
        <span style={{ border: `1.3px solid ${dark ? C.white : C.jet}`, borderRadius: 3, width: 20, height: 10, position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", inset: 1.5, right: 3, background: dark ? C.white : C.jet, borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

export default function App() {
  useFonts();
  const [role, setRole] = useState("client");
  const [screen, setScreen] = useState("splash");
  const [params, setParams] = useState({});
  const [history, setHistory] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [favorites, setFavorites] = useState(["c1"]);
  const [biometric, setBiometric] = useState(true);
  const [verified, setVerified] = useState(false);
  const [offline, setOffline] = useState(false);
  const [hasCoachRole, setHasCoachRole] = useState(false);
  const [draft, setDraft] = useState(null);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [coachBookings, setCoachBookings] = useState(COACH_BOOKINGS);

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2200); };
  const nav = (s, p = {}) => { setHistory((h) => [...h, screen]); setScreen(s); setParams(p); };
  const goBack = () => { setHistory((h) => { const n = [...h]; const last = n.pop(); if (last) setScreen(last); return n; }); };
  const toggleFav = (id) => setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);
  const addBooking = (d) => setBookings((b) => [{ id: "b" + (b.length + 1), coachId: d.coach.id, coachName: d.coach.name, clientName: "Sarah Lin", service: d.pkg.name, date: d.day, time: d.time, mode: d.mode, status: d.coach.instantBook ? "confirmed" : "pending", price: d.total, reviewed: false }, ...b]);

  const isDarkScreen = screen === "splash";
  const tabsForRole = role === "coach" ? COACH_TABS : CLIENT_TABS;
  const showTabs = tabsForRole.some((t) => t.value === screen);

  const screenProps = { nav, params, toast, role, favorites, toggleFav, biometric, setBiometric, verified, offline, draft, setDraft, addBooking, bookings, coachBookings, setCoachBookings, setRole, addCoachRole: () => setHasCoachRole(true) };

  function renderScreen() {
    switch (screen) {
      case "splash": return <ScreenSplash nav={nav} />;
      case "role-select": return <ScreenRoleSelect nav={nav} setRole={setRole} />;
      case "auth": return <ScreenAuth {...screenProps} />;
      case "tnc": return <ScreenTnc {...screenProps} />;
      case "verification": return <ScreenVerification {...screenProps} />;

      case "client-home": return <ScreenClientHome {...screenProps} />;
      case "search-filters": return <ScreenSearchFilters {...screenProps} />;
      case "coach-profile": return <ScreenCoachProfile {...screenProps} />;
      case "booking-datetime": return <ScreenBookingDateTime {...screenProps} />;
      case "booking-review": return <ScreenBookingReview {...screenProps} />;
      case "payment": return <ScreenPayment {...screenProps} />;
      case "booking-confirmation": return <ScreenBookingConfirmation {...screenProps} />;
      case "client-dashboard": return <ScreenClientDashboard {...screenProps} />;
      case "leave-review": return <ScreenLeaveReview {...screenProps} />;
      case "client-messages": return <ScreenMessages {...screenProps} />;
      case "client-profile": return <ScreenClientProfile {...screenProps} />;

      case "coach-dashboard": return <ScreenCoachDashboard {...screenProps} />;
      case "coach-calendar": return <ScreenCoachCalendar {...screenProps} />;
      case "coach-bookings": return <ScreenCoachBookings {...screenProps} />;
      case "coach-profile-edit": return <ScreenCoachProfileEdit {...screenProps} />;
      case "coach-earnings": return <ScreenCoachEarnings {...screenProps} />;
      case "coach-messages": return <ScreenMessages {...screenProps} />;

      case "chat-thread": return <ScreenChatThread {...screenProps} />;
      case "support": return <ScreenSupport {...screenProps} />;
      case "admin": return <ScreenAdmin {...screenProps} />;
      default: return <ScreenSplash nav={nav} />;
    }
  }

  return (
    <div style={{ minHeight: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 12px 40px", background: `radial-gradient(circle at 50% 0%, #EEEFF3 0%, ${C.fog} 60%)`, ...fBody }}>
      <style>{KEYFRAMES}</style>

      {/* Prototype controls — outside the device frame */}
      <div style={{ width: 390, maxWidth: "100%", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={20} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.jet, ...fDisplay }}>CoachLink — interactive prototype</span>
        </div>
      </div>
      <div style={{ width: 390, maxWidth: "100%", background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 10, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: C.slateLight, fontWeight: 600, ...fBody }}>VIEW AS</span>
        {["client", "coach"].map((r) => (
          <button key={r} onClick={() => { setRole(r); setHistory([]); setScreen(r === "coach" ? "coach-dashboard" : "client-home"); }}
            style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${role === r ? C.orange : C.border}`, background: role === r ? C.orangeTint : C.white, color: role === r ? C.orange : C.jet, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", ...fBody }}>
            {r}
          </button>
        ))}
        <button onClick={() => nav("admin")} style={{ padding: "6px 12px", borderRadius: 999, border: `1px solid ${screen === "admin" ? C.orange : C.border}`, background: screen === "admin" ? C.orangeTint : C.white, color: screen === "admin" ? C.orange : C.jet, fontSize: 12, fontWeight: 600, cursor: "pointer", ...fBody }}>Admin</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setOffline((v) => !v)} title="Simulate offline"
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 999, border: `1px solid ${offline ? C.orange : C.border}`, background: offline ? C.orangeTint : C.white, color: offline ? C.orange : C.slate, fontSize: 11.5, fontWeight: 600, cursor: "pointer", ...fBody }}>
          <WifiOff size={12} /> Offline
        </button>
        <button onClick={() => { setScreen("splash"); setHistory([]); setBookings(INITIAL_BOOKINGS); setCoachBookings(COACH_BOOKINGS); setVerified(false); }}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.white, color: C.slate, fontSize: 11.5, fontWeight: 600, cursor: "pointer", ...fBody }}>
          <RefreshCcw size={12} /> Reset
        </button>
      </div>

      {/* Device frame */}
      <div style={{ width: 390, maxWidth: "100%", height: 844, maxHeight: "88vh", background: C.jet, borderRadius: 46, padding: 12, boxShadow: "0 30px 60px -20px rgba(22,24,29,.35)", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: C.jet, borderRadius: 14, zIndex: 100 }} />
        <div style={{ width: "100%", height: "100%", background: isDarkScreen ? C.jet : C.white, borderRadius: 34, overflow: "hidden", position: "relative" }}>
          <StatusBar dark={isDarkScreen} />
          <div style={{ height: "calc(100% - 34px)", position: "relative" }}>
            {renderScreen()}
            <Toast toast={toastMsg} />
          </div>
          {showTabs && <BottomTabs items={tabsForRole} value={screen} onChange={(v) => { setHistory([]); setScreen(v); }} />}
        </div>
      </div>

      <div style={{ width: 390, maxWidth: "100%", marginTop: 14, fontSize: 11.5, color: C.slateLight, textAlign: "center", lineHeight: 1.6, ...fBody }}>
        High-fidelity front-end prototype with mock data — booking, payments and verification flows are simulated for demonstration.
      </div>
    </div>
  );
}
