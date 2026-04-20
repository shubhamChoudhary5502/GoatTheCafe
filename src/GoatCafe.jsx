import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Phone, Mail, MapPin, Clock, Star,
  Instagram, MessageCircle, ChevronRight, ChevronLeft, ChevronUp, Leaf,
  Utensils, Heart, ZoomIn, CheckCircle, Award,
} from "lucide-react";

/* ─── TOKENS ─────────────────────────────────────────────────── */
const C = {
  bg:       "#1a1a1a",
  bgDeep:   "#111111",
  bgCard:   "#222222",
  cream:    "#f5f0e8",
  creamDim: "#c8c2b8",
  gold:     "#c9a84c",
  goldLight:"#e8c97a",
  goldDim:  "rgba(201,168,76,0.15)",
  goldGlow: "rgba(201,168,76,0.08)",
  white:    "#fafafa",
  muted:    "#7a7570",
  text:     "#b8b3aa",
  dark:     "#0f0f0f",
};

const WA        = "https://wa.me/917829908024";
const EMAIL     = "goatthecafe@gmail.com";
const MAPS_LINK = "https://maps.app.goo.gl/z1DPr2bMSy9HWbMV6";
const MAPS_EMBED= "https://maps.google.com/maps?q=12.313698104558943,76.61504114353578&z=17&output=embed";
const PHONE     = "+91 78299 08024";

/* ─── GLOBAL STYLES injected once ──────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #1a1a1a; -webkit-font-smoothing: antialiased; }
  @keyframes waPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
    60%      { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
  }
  @keyframes liveDot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.7); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes heroFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes rotateRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #1a1a1a; }
  ::-webkit-scrollbar-thumb { background: #c9a84c44; border-radius: 4px; }
`;

/* ─── UTILITY COMPONENTS ─────────────────────────────────────── */

/** Dashed placeholder box — intentional, premium look */
const Placeholder = ({ label, height = 260, style = {}, rounded = 14 }) => (
  <div style={{
    width: "100%",
    height,
    border: `1.5px dashed ${C.gold}44`,
    borderRadius: rounded,
    background: `linear-gradient(135deg, ${C.goldGlow} 0%, transparent 100%)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    overflow: "hidden",
    ...style,
  }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.gold}55`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontSize: 14 }}>🐐</span>
    </div>
    <span style={{ color: C.gold, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>
      {label}
    </span>
  </div>
);

/** Scroll-triggered fade-in-up */
const FadeUp = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(36px)", transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

/** Overline label */
const Overline = ({ text, light = true }) => (
  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: C.gold, marginBottom: 14, fontWeight: 600 }}>
    {text}
  </p>
);

/** Section heading */
const H2 = ({ children, light = true, size = "clamp(34px,5vw,58px)", style = {} }) => (
  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: size, fontWeight: 700, color: light ? C.cream : C.dark, lineHeight: 1.08, ...style }}>
    {children}
  </h2>
);

/** Full-width section wrapper */
const Section = ({ id, bg = C.bg, pad = "96px 0", children, style = {} }) => (
  <section id={id} style={{ background: bg, padding: pad, position: "relative", overflow: "hidden", ...style }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
      {children}
    </div>
  </section>
);

/** Decorative gold line */
const GoldLine = ({ style = {} }) => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}66, transparent)`, margin: "0 auto", ...style }} />
);

/** Star row */
const Stars = ({ n = 5, size = 12 }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {Array.from({ length: n }).map((_, i) => <Star key={i} size={size} fill="#FBBC04" style={{ color: "#FBBC04" }} />)}
  </span>
);

/* ─── NAVBAR ──────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  const links = ["menu","events","catering","gallery","contact"];
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? "rgba(17,17,17,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(160%)" : "none",
        borderBottom: scrolled ? `1px solid ${C.gold}22` : "none",
        transition: "all 0.35s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <img src="/cafe-imgs/goat-logo.png" alt="G.O.A.T The Café" style={{ height: 52, display: "block", borderRadius: 6 }} />
          </button>
          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav">
            {links.map(l => (
              <button key={l} onClick={() => go(l)} style={{ background: "none", border: "none", color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s", padding: "4px 0" }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = C.text}>
                {l}
              </button>
            ))}
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "#fff", padding: "10px 22px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}>
              Order on WhatsApp
            </a>
          </div>
          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: C.cream, cursor: "pointer", display: "none" }} className="hamburger">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {/* Mobile menu */}
        {open && (
          <div style={{ background: "rgba(15,15,15,0.98)", borderTop: `1px solid ${C.gold}22`, padding: "20px 28px 28px" }}>
            {links.map(l => (
              <button key={l} onClick={() => go(l)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", padding: "14px 0", borderBottom: `1px solid #ffffff0a`, cursor: "pointer" }}>
                {l}
              </button>
            ))}
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 20, background: "#25D366", color: "#fff", padding: "14px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
              Order on WhatsApp
            </a>
          </div>
        )}
      </nav>
      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
        @media (min-width: 769px) { .hamburger { display: none !important; } }
      `}</style>
    </>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ background: C.bgDeep, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 28px 80px" }}>
      {/* Decorative rings */}
      {[600, 480, 360].map((s, i) => (
        <div key={s} style={{ position: "absolute", top: "50%", right: "-15%", width: s, height: s, borderRadius: "50%", border: `1px solid ${C.gold}${["0d","0a","07"][i]}`, transform: "translateY(-50%)", pointerEvents: "none", animation: i === 0 ? "rotateRing 40s linear infinite" : "none" }} />
      ))}
      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.6, pointerEvents: "none" }} />
      {/* Gold glow blob */}
      <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.gold}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <FadeUp>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.gold}44`, borderRadius: 100, padding: "8px 18px", marginBottom: 36, background: C.goldGlow }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", animation: "liveDot 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.gold, letterSpacing: 2.5, textTransform: "uppercase" }}>
              Now Open · JSS University · 100% Veg
            </span>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
          <div>
            <FadeUp delay={0.08}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(50px, 7.5vw, 96px)", fontWeight: 700, color: C.cream, lineHeight: 1.0, marginBottom: 28 }}>
                Greatest<br />
                <em style={{ color: C.gold, fontStyle: "italic" }}>Of All</em><br />
                Taste.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: C.text, lineHeight: 1.75, maxWidth: 440, marginBottom: 40 }}>
                Crafted with Quality. Served with Care. JSS University's most-loved 100% vegetarian café — where every bite is made from real ingredients and honest cooking.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: C.gold, color: C.dark, border: "none", padding: "16px 32px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.target.style.background = C.goldLight; e.target.style.transform = "scale(1.03)"; }}
                  onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "scale(1)"; }}>
                  Explore Menu
                </button>
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  style={{ background: "transparent", color: C.cream, border: `1.5px solid ${C.cream}44`, padding: "16px 32px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }}
                  onMouseLeave={e => { e.target.style.borderColor = `${C.cream}44`; e.target.style.color = C.cream; }}>
                  Book a Table
                </a>
              </div>
            </FadeUp>
            {/* Stats strip */}
            <FadeUp delay={0.3}>
              <div style={{ display: "flex", gap: 32, marginTop: 52, paddingTop: 32, borderTop: `1px solid ${C.gold}1a` }}>
                {[["10K+","Students Served"],["4.8★","Google Rating"],["100%","Fresh Daily"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.gold, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, letterSpacing: 1, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Hero image */}
          <FadeUp delay={0.12} style={{ animation: "heroFloat 6s ease-in-out infinite" }}>
            <div style={{ position: "relative" }}>
              <img src="/cafe-imgs/cafe-indoor.jpeg" alt="G.O.A.T The Café" style={{ width:"100%", height:480, objectFit:"cover", borderRadius:20, display:"block", border:`1.5px solid ${C.gold}33` }} />
              {/* Floating pill */}
              <div style={{ position: "absolute", bottom: -18, left: -18, background: C.gold, color: C.dark, padding: "12px 22px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, boxShadow: `0 8px 32px ${C.gold}44` }}>
                🌿 Greatest Of All Taste
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
      <style>{`@media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

/* ─── VISION & MISSION ───────────────────────────────────────── */
function VisionMission() {
  return (
    <Section bg={C.bgCard}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="vm-grid">
        <FadeUp>
          <div>
            <Overline text="Our Ethos" />
            <div style={{ marginBottom: 40 }}>
              <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 24, marginBottom: 36 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12, fontWeight: 600 }}>Vision</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 30px)", color: C.cream, lineHeight: 1.45, fontStyle: "italic" }}>
                  "To make G.O.A.T Café a trusted destination for great taste and honest food — where people gather, celebrate, and enjoy dishes made with genuine care."
                </p>
              </div>
              <div style={{ borderLeft: `3px solid ${C.gold}30`, paddingLeft: 24 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12, fontWeight: 600 }}>Mission</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, lineHeight: 1.8 }}>
                  We strive to build a café experience that combines exceptional taste, responsible cooking, and a welcoming space for memorable moments — because at G.O.A.T, taste is crafted with integrity, and every meal is made to be both flavorful and wholesome.
                </p>
              </div>
            </div>
            <GoldLine style={{ width: "60%" }} />
            <div style={{ display: "flex", gap: 36, marginTop: 32 }}>
              {[["10K+","Customers"],["4.8","Stars"],["3+","Years"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: C.gold }}>{n}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <img src="/cafe-imgs/cafe-outdoor2.jpeg" alt="G.O.A.T Café outdoor seating" style={{ width:"100%", height:440, objectFit:"cover", borderRadius:20, display:"block", border:`1.5px solid ${C.gold}22` }} />
        </FadeUp>
      </div>
      <style>{`@media(max-width:820px){.vm-grid{grid-template-columns:1fr!important;}}`}</style>
    </Section>
  );
}

/* ─── OFFERS ─────────────────────────────────────────────────── */
const OFFERS = [
  { emoji:"🎓", title:"Student Combo Deals",    desc:"Show your JSS ID and unlock specially priced combos on meals and beverages every single day.", img:"/cafe-imgs/Student Combo Deals.jpg" },
  { emoji:"☕", title:"Happy Hours 4–6 PM",     desc:"Wind down the day right. Special pricing on all beverages and snacks — Mon through Sat.", img:"/cafe-imgs/Happy Hours 4–6 PM.jpg" },
  { emoji:"🍳", title:"Weekend Brunches",       desc:"Extended menu, relaxed vibes, and freshly plated specials every Saturday and Sunday.", img:"/cafe-imgs/Weekend Brunches.jpg" },
  { emoji:"⭐", title:"Loyalty Rewards",         desc:"Earn points with every order. Your 10th coffee is on us — and it only gets better from there.", img:"/cafe-imgs/Loyalty Rewards.jpg" },
  { emoji:"👥", title:"Group Discounts",        desc:"Bring 5 or more friends and enjoy 15% off your total. Great food tastes better together.", img:"/cafe-imgs/Group Discounts.jpg" },
  { emoji:"🌿", title:"Seasonal Specials",      desc:"Limited-edition menu items that celebrate every season, festival, and reason to celebrate.", img:"/cafe-imgs/Seasonal Specials.jpg" },
];

function Offers() {
  return (
    <Section bg={C.bg}>
      <FadeUp>
        <Overline text="What We Bring" />
        <H2>Deals That Hit<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Different.</em></H2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, maxWidth: 480, lineHeight: 1.75, marginTop: 16, marginBottom: 52 }}>
          Because great food should come with great value. Here's what we have cooking for you.
        </p>
      </FadeUp>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 22 }}>
        {OFFERS.map((o, i) => (
          <FadeUp key={o.title} delay={i * 0.07}>
            <div style={{ background: C.goldGlow, border: `1px solid ${C.gold}22`, borderRadius: 18, padding: 28, transition: "all 0.3s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${C.gold}55`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${C.gold}22`; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 30, marginBottom: 16 }}>{o.emoji}</div>
              <img src={o.img} alt={o.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 20, display: "block" }} onError={e => { e.target.style.display = "none"; }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.cream, marginBottom: 10 }}>{o.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.72, marginBottom: 20 }}>{o.desc}</p>
              <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", border: `1px solid ${C.gold}`, color: C.gold, padding: "8px 20px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.background = C.gold; e.target.style.color = C.dark; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = C.gold; }}>
                View Deal
              </a>
            </div>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}

/* ─── EVENTS ─────────────────────────────────────────────────── */
const EVENTS = [
  { emoji:"🎂", title:"Birthday Parties",          tag:"Make your day legendary",       desc:"Custom setups, reserved tables, and a moment you'll never forget — crafted just for you.", img:"/cafe-imgs/Birthday Parties.avif" },
  { emoji:"👨‍👩‍👧", title:"Family Get-Togethers",     tag:"Where family bonds over food",  desc:"A warm, welcoming space for the whole family. Real food, real moments, real memories.", img:"/cafe-imgs/Family Get-Togethers.jpg" },
  { emoji:"🌸", title:"Kitty Parties",              tag:"Brunch, gossip, repeat",        desc:"Exclusive table arrangements with curated multi-course menus for your most trusted squad.", img:"/cafe-imgs/Kitty Parties.avif" },
  { emoji:"🎓", title:"Farewell Parties",           tag:"End it in style",               desc:"Give your final year the send-off it deserves. Memories over meals, always.", img:"/cafe-imgs/Farewell Parties.avif" },
  { emoji:"💼", title:"Corporate Meetups",          tag:"Where ideas are brewed",        desc:"Professional ambiance, punctual catering, and setups that impress every stakeholder.", img:"/cafe-imgs/Corporate Meetups.jpg" },
  { emoji:"🎉", title:"Fresher's Parties",          tag:"Welcome to the campus life",    desc:"Make your very first days at JSS truly unforgettable. The best chapter starts here.", img:"/cafe-imgs/Fresher's Parties.avif" },
  { emoji:"🤝", title:"BBB Meetings",               tag:"Business over chai",            desc:"The perfect setting for BNI, business breakfasts, and networking over good food.", img:"/cafe-imgs/BBB Meetings.jpg" },
  { emoji:"🫶", title:"Private Celebrations",       tag:"Love, plated beautifully",      desc:"Intimate setups with personalised menus — crafted to make every occasion unforgettable.", img:"/cafe-imgs/Private Celebrations.avif" },
  { emoji:"🎪", title:"Small Events & Gatherings",  tag:"Any reason to celebrate",       desc:"From casual get-togethers to themed evenings — we make every occasion feel special.", img:"/cafe-imgs/Small Events & Gatherings.jpg" },
];

function Events() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 330, behavior: "smooth" });
  };
  const btnStyle = {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: 46, height: 46, borderRadius: "50%",
    border: `1.5px solid ${C.gold}99`,
    background: "rgba(26,26,26,0.95)",
    color: C.gold, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 50,
    transition: "all 0.25s ease",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5), 0 0 0 6px rgba(26,26,26,0.6)",
  };
  return (
    <section id="events" style={{ background: C.bgCard, padding: "96px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="Celebrate With Us" />
          <H2>Every Occasion,<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Elevated.</em></H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, maxWidth: 480, lineHeight: 1.75, marginTop: 16, marginBottom: 52 }}>
            From spontaneous celebrations to once-in-a-lifetime milestones — G.O.A.T has the perfect setting.
          </p>
        </FadeUp>
      </div>
      {/* Scroll track with arrows */}
      <div style={{ position: "relative", padding: "0 70px" }}>
        <button style={{ ...btnStyle, left: 12 }}
          onClick={() => scroll(-1)}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(201,168,76,0.9)";
            e.currentTarget.style.color = "#1a1a1a";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(26,26,26,0.95)";
            e.currentTarget.style.color = "#c9a84c";
          }}>
          <ChevronLeft size={20} />
        </button>

        <div style={{
          position: "relative",
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)"
        }}>
          <div ref={scrollRef} style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            padding: "10px 4px 24px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}>
            {EVENTS.map((ev, i) => (
              <FadeUp key={ev.title} delay={i * 0.07} style={{ flex: "0 0 310px", scrollSnapAlign: "start" }}>
                <div style={{ background: C.goldGlow, border: `1px solid ${C.gold}22`, borderRadius: 20, overflow: "hidden", transition: "all 0.3s", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${C.gold}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${C.gold}22`; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <img src={ev.img} alt={ev.title} style={{ width: "100%", height: 190, objectFit: "cover", display: "block", borderBottom: `1px solid ${C.gold}18` }}
                    onError={e => { e.target.style.display = "none"; }} />
                  <div style={{ padding: "22px 24px 28px" }}>
                    <div style={{ fontSize: 26, marginBottom: 12 }}>{ev.emoji}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.cream, marginBottom: 6 }}>{ev.title}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{ev.tag}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.72, marginBottom: 22 }}>{ev.desc}</p>
                    <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      Book Now <ChevronRight size={15} />
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <button style={{ ...btnStyle, right: 12 }}
          onClick={() => scroll(1)}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(201,168,76,0.9)";
            e.currentTarget.style.color = "#1a1a1a";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(26,26,26,0.95)";
            e.currentTarget.style.color = "#c9a84c";
          }}>
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

/* ─── CATERING ───────────────────────────────────────────────── */
const PLANS = [
  { name:"Basic",   tagline:"Perfect for small gatherings", price:"From ₹299/head", popular:false,
    img:"/cafe-imgs/BasicPlan.png",
    features:["Serves 10–30 guests","Snacks & beverages","2 food counters","Basic setup & décor","WhatsApp coordination"] },
  { name:"Premium", tagline:"The most popular choice",      price:"From ₹599/head", popular:true,
    img:"/cafe-imgs/PremiumPlan.png",
    features:["Serves 30–100 guests","Full meals + desserts","4 food counters","Branded setup & décor","Dedicated catering manager","Live station options"] },
  { name:"Grand",   tagline:"The full G.O.A.T experience",  price:"From ₹999/head", popular:false,
    img:"/cafe-imgs/GrandPlan.png",
    features:["Serves 100+ guests","Multi-course meals","Premium live stations","Custom theme décor","Full event coordination","Photo-ready plating","Post-event cleanup"] },
];

function Catering() {
  return (
    <section id="catering" style={{ background: "#0d0d0d", padding: "96px 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle gold top accent */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 320, height: 1, background: `linear-gradient(90deg,transparent,${C.gold}88,transparent)` }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="We Come To You" />
          <H2>Full-Scale Catering.<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Zero Compromise.</em></H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, maxWidth: 520, lineHeight: 1.75, marginTop: 16, marginBottom: 56 }}>
            G.O.A.T brings the café to your event — from intimate gatherings to grand celebrations. Every detail, handled.
          </p>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24 }}>
          {PLANS.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1}>
              <div style={{ background: p.popular ? `${C.gold}0d` : "rgba(255,255,255,0.02)", border: `1.5px solid ${p.popular ? C.gold : C.gold + "25"}`, borderRadius: 20, padding: 32, position: "relative", transition: "transform 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.gold, color: C.dark, padding: "4px 22px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                <img
                  src={p.img}
                  alt={`${p.name} catering plan`}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginBottom: 24,
                    display: "block",
                    border: "1px solid #c9a84c22"
                  }}
                  onError={e => { e.target.style.display = "none"; }}
                />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: p.popular ? C.gold : C.cream, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.tagline}</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.gold, marginBottom: 24 }}>{p.price}</p>
                <div style={{ borderTop: `1px solid ${C.gold}18`, paddingTop: 20, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                      <CheckCircle size={13} style={{ color: C.gold, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", background: p.popular ? C.gold : "transparent", color: p.popular ? C.dark : C.gold, border: `1.5px solid ${C.gold}`, padding: "14px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center", letterSpacing: 0.5, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = C.goldLight; e.target.style.color = C.dark; }}
                  onMouseLeave={e => { e.target.style.background = p.popular ? C.gold : "transparent"; e.target.style.color = p.popular ? C.dark : C.gold; }}>
                  Enquire on WhatsApp
                </a>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MENU ───────────────────────────────────────────────────── */
const IMG = {
  coffee:       "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=220&fit=crop",
  coffeeSp:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=220&fit=crop",
  coffeeSpice:  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=220&fit=crop",
  tea:          "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=220&fit=crop",
  teaHerb:      "https://images.unsplash.com/photo-1597481499666-3afb36c2a6f7?w=400&h=220&fit=crop",
  teaGreen:     "https://images.unsplash.com/photo-1564890369478-c89ca3d9b98e?w=400&h=220&fit=crop",
  badamMilk:    "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=220&fit=crop",
  hotDrink:     "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=220&fit=crop",
  lemonJuice:   "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=400&h=220&fit=crop",
  juice:        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=220&fit=crop",
  watermelon:   "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=220&fit=crop",
  mango:        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=220&fit=crop",
  pomegranate:  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=220&fit=crop",
  avocado:      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=220&fit=crop",
  shake:        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=220&fit=crop",
  chocoShake:   "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=220&fit=crop",
  strawShake:   "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=220&fit=crop",
  oreoShake:    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=220&fit=crop",
  buttermilk:   "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=220&fit=crop",
  limeSoda:     "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=220&fit=crop",
  mojito:       "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=220&fit=crop",
  blueMojito:   "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=220&fit=crop",
  iceCream:     "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=220&fit=crop",
  pizza:        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=220&fit=crop",
  pizzaCap:     "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=220&fit=crop",
  pizzaCorn:    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=220&fit=crop",
  pizzaPaneer:  "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=220&fit=crop",
  roll:         "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=220&fit=crop",
  avocRoll:     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=220&fit=crop",
  toast:        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=220&fit=crop",
  garlicBread:  "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&h=220&fit=crop",
  sandwich:     "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=220&fit=crop",
  chocoSandwich:"https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&h=220&fit=crop",
  cornSandwich: "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=400&h=220&fit=crop",
  pastaRed:     "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=220&fit=crop",
  pastaWhite:   "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=220&fit=crop",
  fries:        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=220&fit=crop",
  loadedFries:  "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=220&fit=crop",
  nachos:       "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=220&fit=crop",
  maggie:       "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=220&fit=crop",
  bajji:        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=220&fit=crop",
  panipuri:     "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=220&fit=crop",
  vadapav:      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=220&fit=crop",
  rice:         "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=220&fit=crop",
  riceS:        "https://images.unsplash.com/photo-1536304993881-ff86d42818e8?w=400&h=220&fit=crop",
  platter:      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=220&fit=crop",
  coldCoffee:   "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=220&fit=crop",
};

const MENU_ITEMS = [
  /* ── BEAN BELT — COFFEE ── */
  { name:"Regular Coffee",              price:"₹20",  desc:"Classic drip coffee brewed fresh every hour. Clean, bold, and honest.",                       veg:true, cat:"Coffee",     soon:false, img:"/cafe-imgs/regular_coffee.webp" },
  { name:"Cinnamon Coffee",             price:"₹25",  desc:"Warm coffee infused with real cinnamon. Cosy, spiced, and deeply comforting.",                 veg:true, cat:"Coffee",     soon:false, img:"/cafe-imgs/Cinnamon Coffee.webp" },
  { name:"Elaichi Coffee",              price:"₹25",  desc:"Hot coffee kissed with green cardamom. Fragrant, aromatic, and unmistakably Indian.",          veg:true, cat:"Coffee",     soon:false, img:"/cafe-imgs/Elachi coffee.webp" },
  { name:"Ginger Coffee",               price:"₹25",  desc:"Bold coffee with a fresh ginger kick. The ultimate wake-up call on campus.",                   veg:true, cat:"Coffee",     soon:false, img:"/cafe-imgs/ginger coffee.webp" },
  { name:"Interesting Coffee (Special)",price:"₹25",  desc:"Our G.O.A.T signature blend — a mystery recipe that's earned a cult following on campus.",     veg:true, cat:"Coffee",     soon:false, img:"/cafe-imgs/regular_coffee.webp" },
  /* ── TEA TOTALER ── */
  { name:"Regular Tea",                 price:"₹15",  desc:"Simple, honest, perfectly brewed. Because sometimes simple is everything.",                    veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Mysore Masala Tea.webp" },
  { name:"Ashwagandha Tea",             price:"₹20",  desc:"Adaptogenic ashwagandha brewed warm. Stress less, sip more.",                                 veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/ashwagandha tea.webp" },
  { name:"Lemongrass / Tulsi Mint Tea", price:"₹20",  desc:"Lemongrass and holy basil with fresh mint. Nature's most refreshing combo.",                  veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/lemongrass tulsi tea.webp" },
  { name:"Mysore Masala Tea",           price:"₹20",  desc:"The iconic Mysuru-style masala chai — bold, milky, spiced to perfection.",                    veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Mysore Masala Tea.webp" },
  { name:"Peppermint Tea",              price:"₹20",  desc:"Cool, crisp peppermint steeped light. The perfect post-meal refresher.",                      veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Peppermint Tea.jpg" },
  { name:"Ginger / Cardamom Tea",       price:"₹20",  desc:"Double-spiced adrak-elaichi chai. Warming, bold, and deeply satisfying.",                     veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Ginger  Cardamom Tea.webp" },
  { name:"Green / Gulab Tea",           price:"₹25",  desc:"Light green tea or delicate rose-infused brew — both beautiful in every sip.",                veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Green  Gulab Tea.webp" },
  { name:"Lemon Tea",                   price:"₹25",  desc:"Black tea with a bright squeeze of lemon. Simple, zingy, and uplifting.",                     veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Lemon Tea.webp" },
  { name:"Blue / Hibiscus Tea",         price:"₹30",  desc:"Butterfly pea flower or hibiscus tea — strikingly coloured, caffeine-free, and gorgeous.",   veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Blue hibiscus tea.webp" },
  /* ── HOT BEVERAGES ── */
  { name:"Badam Milk",                  price:"₹20",  desc:"Warm full-cream milk with almond powder, saffron, and cardamom.",                             veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Badam Milk.webp" },
  { name:"Boost",                       price:"₹20",  desc:"Hot Boost malt drink — the energy and taste you grew up with.",                               veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Boost & Horlicks.jpg" },
  { name:"Horlicks",                    price:"₹20",  desc:"Classic warm Horlicks malt. Nostalgic, nourishing, and comforting.",                          veg:true, cat:"Tea & Hot",  soon:false, img:"/cafe-imgs/Boost & Horlicks.jpg" },
  /* ── FRESH JUICE ── */
  { name:"Lemon Juice",                 price:"₹30",  desc:"Freshly squeezed lemon juice with a pinch of black salt. Tangy and clean.",                   veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Lemon Juice.webp" },
  { name:"Mosambi",                     price:"₹39",  desc:"Freshly squeezed sweet lime — light, tangy, and packed with vitamins.",                       veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Orange.jpg" },
  { name:"Watermelon",                  price:"₹39",  desc:"Pure chilled watermelon blended fresh — no sugar, no water added.",                           veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Watermelon Juice.webp" },
  { name:"Pineapple",                   price:"₹49",  desc:"Ripe pineapple blended fresh. Tropical, zingy, and perfectly thirst-quenching.",              veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Pineapple.jpg" },
  { name:"Muskmelon",                   price:"₹49",  desc:"Fresh muskmelon blended smooth — sweet, light, and beautifully aromatic.",                    veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Muskmelon.webp" },
  { name:"Orange (Seasonal)",           price:"₹49",  desc:"Freshly prepared seasonal orange drink — vibrant, tangy, and vitamin-packed.",                veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Orange.jpg" },
  { name:"Apple",                       price:"₹69",  desc:"Freshly pressed apple juice — crisp, sweet, and naturally refreshing.",                       veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Apple.jpg" },
  { name:"Pomegranate",                 price:"₹69",  desc:"Rich, ruby-red pomegranate pressed fresh. Antioxidant-packed and stunning.",                  veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Pomegranate.jpg" },
  { name:"Butterfruit (Seasonal)",      price:"₹69",  desc:"Creamy avocado-based seasonal drink — rich, smooth, and full of goodness.",                   veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Butterfruit (Seasonal).jpg" },
  { name:"Mango (Seasonal)",            price:"₹69",  desc:"Seasonal fresh mango drink — thick, sweet, and impossibly good.",                             veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Mango (Seasonal).jpg" },
  { name:"Chickoo (Seasonal)",          price:"₹69",  desc:"Seasonal sapota drink — malty, earthy, and a true desi classic.",                             veg:true, cat:"Juice",      soon:false, img:"/cafe-imgs/Chickoo (Seasonal).jpg" },
  /* ── MILKSHAKES ── */
  { name:"Banana Shake",                price:"₹59",  desc:"Thick banana milkshake blended smooth with fresh bananas and chilled milk.",                  veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Banana Shake.jpg" },
  { name:"Vanilla Shake",               price:"₹59",  desc:"Classic vanilla milkshake — smooth, creamy, and endlessly satisfying.",                       veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Vanilla Shake.jpg" },
  { name:"Chocolate Shake",             price:"₹59",  desc:"Rich chocolate milkshake. Dense, dark, and dangerously good.",                                veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Chocolate Shake.avif" },
  { name:"Strawberry Shake",            price:"₹59",  desc:"Thick strawberry milkshake blended with real fruit and creamy ice cream.",                    veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Strawberry Shake.jpg" },
  { name:"Butterscotch Shake",          price:"₹69",  desc:"Creamy butterscotch shake with praline bits. The campus crowd's all-time favourite.",         veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Butterscotch .jpg" },
  { name:"Pista Shake",                 price:"₹69",  desc:"Pistachio milkshake blended rich and thick. Nutty, royal, and indulgent.",                    veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Pista.png" },
  { name:"Chickoo Shake",               price:"₹69",  desc:"Seasonal sapota blended into a thick, malty milkshake. A true desi classic.",                 veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Chickoo Shake.jpg" },
  { name:"Kitkat Oreo Shake",           price:"₹79",  desc:"KitKat and Oreo blended into one insane milkshake. Pure dessert in a glass.",                 veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Kitkat Oreo Shake.avif" },
  { name:"Blackcurrant Shake",          price:"₹79",  desc:"Bold blackcurrant milkshake — tart, sweet, and beautifully purple.",                          veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Blackcurrent Shake.png" },
  { name:"Avocado Shake",               price:"₹79",  desc:"Creamy avocado milkshake — rich, smooth, and uniquely delicious.",                            veg:true, cat:"Milkshakes", soon:false, img:"/cafe-imgs/Avacado shake.jpg" },
  /* ── BRAIN CHILLERS ── */
  { name:"Buttermilk (Masala)",         price:"₹20",  desc:"Spiced chaas with hand-ground masala. Cool, refreshing, and perfectly digestive.",            veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Buttermilk (Masala).jpg" },
  { name:"Lime Soda",                   price:"₹30",  desc:"Fresh lime squeezed over chilled soda. Crisp, fizzy, and instantly refreshing.",              veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Lime Soda.jpg" },
  { name:"Lime Soda (Masala)",          price:"₹39",  desc:"Spiced masala lime soda with a tangy, peppery kick. Our most underrated drink.",              veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Lime Soda (Masala).webp" },
  { name:"Lime Chilli Soda",            price:"₹49",  desc:"Lime soda with a green chilli kick. Brave enough? It's absolutely worth it.",                 veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Lime Chilli Soda.jpg" },
  { name:"Lime Mint Mojito",            price:"₹49",  desc:"Fresh lime, crushed mint, and soda — the classic refresher done right.",                      veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Lime Mint Mojito.avif" },
  { name:"Cold Badam Milk",             price:"₹49",  desc:"Chilled almond milk with saffron and cardamom. Rich, cold, and luxurious.",                   veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Cold Badam Milk.jpg" },
  { name:"Watermelon Mojito",           price:"₹59",  desc:"Watermelon, mint, lime, and effervescent soda. Summer in every sip.",                         veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Watermelon Mojito.jpg" },
  { name:"Spicy Mango Mojito",          price:"₹59",  desc:"Ripe mango with a spicy kick, mint, lime, and soda. Bold and beautiful.",                     veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Spicy Mango Mojito.jpg" },
  { name:"Chilli Guava Mojito",         price:"₹59",  desc:"Tangy guava with chilli, mint, and bubbles. An adventure in every sip.",                      veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Chilli Guava Mojito.jpg" },
  { name:"Blue Curacao Mojito",         price:"₹59",  desc:"Vibrant blue citrus mojito with mint and soda. Our most Instagrammed drink.",                 veg:true, cat:"Chillers",   soon:false, img:"/cafe-imgs/Blue Curacao Mojito.webp" },
  /* ── ICE CREAM SCOOPS ── */
  { name:"Vanilla Scoop (Single)",      price:"₹30",  desc:"Single scoop of smooth vanilla ice cream. Real ice cream, not frozen dessert — always.",     veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Vanilla Scoop (Single).jpg" },
  { name:"Chocolate Scoop (Single)",    price:"₹30",  desc:"Single scoop of rich chocolate ice cream. Dark, indulgent, and perfectly scooped.",           veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Chocolate Scoop (Single).jpg" },
  { name:"Strawberry Scoop (Single)",   price:"₹30",  desc:"Single scoop of fresh strawberry ice cream. Fruity, sweet, and beautiful.",                   veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Strawberry Scoop (Single).jpg" },
  { name:"Butterscotch Scoop (Single)", price:"₹30",  desc:"Single scoop of creamy butterscotch. Sweet, golden, and totally irresistible.",               veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Butterscotch Scoop (Single).jpeg" },
  { name:"Vanilla Scoop (Double)",      price:"₹50",  desc:"Double scoop of smooth vanilla ice cream. Because one is never enough.",                      veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Vanilla Scoop (Single).jpg" },
  { name:"Chocolate Scoop (Double)",    price:"₹50",  desc:"Double scoop of rich chocolate ice cream. Twice the joy, same price of love.",                veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Chocolate Scoop (Single).jpg" },
  { name:"Strawberry Scoop (Double)",   price:"₹50",  desc:"Double scoop of fresh strawberry ice cream. The right way to end any meal.",                  veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Strawberry Scoop (Single).jpg" },
  { name:"Butterscotch Scoop (Double)", price:"₹50",  desc:"Double scoop of butterscotch bliss. Ask for customisation with fruits, nuts, or desserts.",   veg:true, cat:"Ice Cream",  soon:false, img:"/cafe-imgs/Butterscotch Scoop (Single).jpeg" },
  /* ── PIZZA ── */
  { name:"Classic Pizza",               price:"₹69",  desc:"Simple, saucy, cheesy pizza on a thin crust. Sometimes classic is king.",                     veg:true, cat:"Pizza",      soon:false, img:"/cafe-imgs/Classic Pizza.jpg" },
  { name:"Capsicum Onion Pizza",        price:"₹79",  desc:"Loaded with fresh capsicum and caramelised onion on a rich tomato base.",                      veg:true, cat:"Pizza",      soon:false, img:"/cafe-imgs/Capsicum Onion Pizza.webp" },
  { name:"Mix Veg Pizza",               price:"₹79",  desc:"A medley of fresh veggies on a cheesy, saucy pizza base. Colourful and delicious.",           veg:true, cat:"Pizza",      soon:false, img:"/cafe-imgs/Mix Veg Pizza.jpg" },
  { name:"Golden Corn Pizza",           price:"₹89",  desc:"Sweet golden corn with mozzarella and herbs. Our smoothest, creamiest pizza.",                veg:true, cat:"Pizza",      soon:false, img:"/cafe-imgs/Golder corn pizza.webp" },
  { name:"Paneer Pizza",                price:"₹99",  desc:"Spiced paneer cubes on a rich tomato base with mozzarella. The premium desi pick.",           veg:true, cat:"Pizza",      soon:false, img:"/cafe-imgs/Paneer Pizza.avif" },
  /* ── ROLLS ── */
  { name:"Veg Roll",                    price:"₹44",  desc:"Spiced potato and veggie filling wrapped in a soft toasted paratha.",                         veg:true, cat:"Rolls",      soon:false, img:"/cafe-imgs/Veg roll.jpg" },
  { name:"Corn Roll",                   price:"₹54",  desc:"Sweet and spiced corn filling in a crispy toasted roll. A campus favourite.",                 veg:true, cat:"Rolls",      soon:false, img:"/cafe-imgs/Corn Roll.webp" },
  { name:"Paneer Roll",                 price:"₹64",  desc:"Smoky paneer tikka, mint chutney, and pickled onions in a flaky toasted roll.",               veg:true, cat:"Rolls",      soon:false, img:"/cafe-imgs/Paneer Roll.avif" },
  { name:"Avocado Roll",                price:"₹64",  desc:"Creamy avocado with veggies and herbs wrapped in a warm toasted roll.",                       veg:true, cat:"Rolls",      soon:false, img:"/cafe-imgs/Avocado Roll.jpg" },
  { name:"Rich Veggie Roll (Special)",  price:"₹79",  desc:"The G.O.A.T Special — a loaded veggie roll with the works. Our most indulgent wrap.",         veg:true, cat:"Rolls",      soon:false, img:"/cafe-imgs/Rich Veggie Roll (Special) .jpg" },
  /* ── BREAD CORNER ── */
  { name:"Butter Bread Toast",          price:"₹39",  desc:"Thick-sliced bread toasted golden with a generous spread of real butter.",                    veg:true, cat:"Bread",      soon:false, img:"/cafe-imgs/Bread Butter Toast.jpg" },
  { name:"Jam Toast",                   price:"₹39",  desc:"Crispy toasted bread with a sweet fruit jam. Simple breakfast joy.",                          veg:true, cat:"Bread",      soon:false, img:"/cafe-imgs/Jam Toast.jpg" },
  { name:"Honey Butter Toast",          price:"₹49",  desc:"Toasted bread drizzled with honey and butter. Sweet, crispy, and perfect.",                   veg:true, cat:"Bread",      soon:false, img:"/cafe-imgs/Honey Butter Toast.webp" },
  { name:"Banana Bread Toast",          price:"₹59",  desc:"Thick banana bread toasted and served warm. A rich, sweet treat.",                            veg:true, cat:"Bread",      soon:false, img:"/cafe-imgs/Banana Bread Toast.jpg" },
  { name:"Garlic Bread Toast",          price:"₹99",  desc:"Crispy toasted bread with garlic butter and herbs. Pairs with everything on our menu.",       veg:true, cat:"Bread",      soon:false, img:"/cafe-imgs/Garlic Bread.jpg" },
  /* ── SANDWICHES ── */
  { name:"Choco Sandwich",              price:"₹39",  desc:"Sweet chocolate spread sandwich — your inner child called, they want this immediately.",       veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Choco Sandwich.jpg" },
  { name:"Mixed Veg Sandwich",          price:"₹49",  desc:"Classic sandwich loaded with fresh veggies, mint chutney, and butter on toasted bread.",      veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Mixed Veg Sandwich.webp" },
  { name:"Corn Cheese Sandwich",        price:"₹59",  desc:"Sweet corn and melted cheese on toasted bread. Simple, gooey, and very very good.",           veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Corn Cheese Sandwich.jpg" },
  { name:"Paneer Sandwich",             price:"₹69",  desc:"Spiced paneer filling with mint chutney and onions on golden-toasted bread.",                 veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Paneer Sandwich.avif" },
  { name:"Avocado Sandwich",            price:"₹69",  desc:"Smashed avocado, herbs, and veggies on toasted bread. Fresh, creamy, and premium.",           veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Avocado Sandwich.jpg" },
  { name:"Peri Peri Paneer Sandwich",   price:"₹79",  desc:"Spiced paneer with fiery peri peri sauce on toasted bread. Bold, hot, and unforgettable.",   veg:true, cat:"Sandwiches", soon:false, img:"/cafe-imgs/Peri peri sandwich.webp" },
  /* ── PASTA ── */
  { name:"Red Sauce Pasta",             price:"₹69",  desc:"Al dente pasta in a rich herbed tomato marinara sauce. Italian comfort, campus-priced.",      veg:true, cat:"Pasta",      soon:false, img:"/cafe-imgs/Pasta Stick.jpg" },
  { name:"Alfredo Pasta",               price:"₹74",  desc:"Creamy white sauce pasta with garlic, herbs, and a parmesan finish.",                         veg:true, cat:"Pasta",      soon:false, img:"/cafe-imgs/Pasta Stick.jpg" },
  /* ── FRIES ── */
  { name:"French Fries (Salt)",         price:"₹49",  desc:"Crispy golden fries seasoned with sea salt. The timeless classic done perfectly.",             veg:true, cat:"Fries",      soon:false, img:"/cafe-imgs/French Fries (Chatpata).jpg" },
  { name:"French Fries (Peri Peri)",    price:"₹54",  desc:"Golden fries tossed in fiery peri peri spice blend. Addictively hot.",                        veg:true, cat:"Fries",      soon:false, img:"/cafe-imgs/French Fries (Peri Peri).jpg" },
  { name:"French Fries (Chatpata)",     price:"₹54",  desc:"Classic fries with our house chatpata masala. Tangy, spicy, impossible to stop eating.",     veg:true, cat:"Fries",      soon:false, img:"/cafe-imgs/French Fries (Chatpata).jpg" },
  { name:"Loaded Fries",                price:"₹79",  desc:"Fries piled with veggies, jalapeños, cheese sauce, and sour cream. The ultimate indulgence.", veg:true, cat:"Fries",      soon:false, img:"/cafe-imgs/Loaded Fries.webp" },
  /* ── NACHOS ── */
  { name:"Sweet Corn Nachos",           price:"₹59",  desc:"Crunchy nachos loaded with sweet corn, salsa, and cheese. Snack time, upgraded.",             veg:true, cat:"Nachos",     soon:false, img:"/cafe-imgs/Sweet Corn Nachos.webp" },
  { name:"Mix Veg Creamy Nachos",       price:"₹69",  desc:"Nachos piled with mixed veggies, creamy cheese sauce, and jalapeños.",                        veg:true, cat:"Nachos",     soon:false, img:"/cafe-imgs/Mix Veg Creamy Nachos.jpg" },
  { name:"Loaded Nachos",               price:"₹79",  desc:"The works — fully loaded nachos with all the toppings. Share if you dare.",                   veg:true, cat:"Nachos",     soon:false, img:"/cafe-imgs/Loaded Nachos.webp" },
  /* ── MAGGIE ── */
  { name:"Plain Maggie",                price:"₹39",  desc:"Classic Maggi noodles cooked perfectly. Nostalgia in every forkful.",                         veg:true, cat:"Maggie",     soon:false, img:"/cafe-imgs/Plain Maggie.jpg" },
  { name:"Onion Maggie",                price:"₹39",  desc:"Maggi tossed with caramelised onions and seasoning. Simple comfort food elevated.",            veg:true, cat:"Maggie",     soon:false, img:"/cafe-imgs/Onion Maggie.webp" },
  { name:"Masala Maggie",               price:"₹49",  desc:"Maggi cooked in our special house masala. Spicier, bolder, and deeply satisfying.",            veg:true, cat:"Maggie",     soon:false, img:"/cafe-imgs/Masala Maggie.webp" },
  { name:"Veggie Maggie",               price:"₹49",  desc:"Maggi loaded with fresh veggies. Because noodles with colour just taste better.",              veg:true, cat:"Maggie",     soon:false, img:"/cafe-imgs/Veggie Maggie.jpg" },
  { name:"Cheese Maggie",               price:"₹59",  desc:"Maggi drowned in melted cheese. The most indulgent way to eat your favourite noodles.",       veg:true, cat:"Maggie",     soon:false, img:"/cafe-imgs/Cheese Maggie.webp" },
  /* ── TINY TREATS ── */
  { name:"Aloo Bajji (4 pcs)",          price:"₹25",  desc:"Hot potato fritters straight from the fryer. Simple, satisfying, impossible to share.",        veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Aloo Bajji.jpg" },
  { name:"Onion Bajji (4 pcs)",         price:"₹25",  desc:"Crispy onion pakodas with green chilli and coriander. The monsoon snack, all year round.",    veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Onion Bajji.jpg" },
  { name:"Balekai Bajji (4 pcs)",       price:"₹30",  desc:"Crispy raw banana fritters with a golden, spiced batter. A South Indian tea-time classic.",   veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Balekai Bajji.jpg" },
  { name:"Heerekai Bajji (4 pcs)",      price:"₹30",  desc:"Ridge gourd bajji — a Karnataka staple done right. Crispy outside, soft inside.",              veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Heerekai Bajji.jpg" },
  { name:"Capsicum Bajji (4 pcs)",      price:"₹30",  desc:"Stuffed capsicum bajji — mildly spiced and perfectly golden. A crowd pleaser every time.",    veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Capsicum Bajji.webp" },
  { name:"Chilli Bajji (4 pcs)",        price:"₹30",  desc:"Whole green chilli dipped in thick batter and fried to a golden crisp. For the brave ones.",  veg:true, cat:"Tiny Treats",soon:false, img:"/cafe-imgs/Chilli Bajji.avif" },
  /* ── MOUTHFUL ── */
  { name:"Panipuri",                    price:"₹40",  desc:"Crispy hollow puris with spiced potato and tangy tamarind water. Pure street joy.",            veg:true, cat:"Mouthful",   soon:false, img:"/cafe-imgs/Panipuri.jpg" },
  { name:"Aloo Sukka Puri",             price:"₹40",  desc:"Dry spiced potato stuffed in crispy puris. South Indian street food at its finest.",           veg:true, cat:"Mouthful",   soon:false, img:"/cafe-imgs/Aloo Sukka Puri.jpg" },
  { name:"Dahipuri",                    price:"₹45",  desc:"Crispy puris filled with potato, curd, and chutneys. Cool, tangy, and heavenly.",              veg:true, cat:"Mouthful",   soon:false, img:"/cafe-imgs/Dahipuri.webp" },
  { name:"Masalapuri",                  price:"₹45",  desc:"Crispy puris topped with spiced peas, chutneys, and sev. A Bangalore classic.",               veg:true, cat:"Mouthful",   soon:false, img:"/cafe-imgs/Masalapuri.jpg" },
  { name:"Bhel Puri",                   price:"₹50",  desc:"Puffed rice, sev, veggies, and tangy chutney tossed together. The iconic Mumbai street bite.", veg:true, cat:"Mouthful",   soon:false, img:"/cafe-imgs/Bhel Puri.jpg" },
  /* ── SMALL MEAL — VADAPAV ── */
  { name:"Crispy Vadapav",              price:"₹39",  desc:"Our crispy-battered twist on the classic Mumbai vadapav. Extra crunch, same soul.",            veg:true, cat:"Vadapav",    soon:false, img:"/cafe-imgs/Crispy Vadapav.jpg" },
  { name:"Cheese Vadapav",              price:"₹49",  desc:"Classic vadapav topped with a generous layer of melted cheese. Irresistibly gooey.",           veg:true, cat:"Vadapav",    soon:false, img:"/cafe-imgs/cheesse vada pav.webp" },
  { name:"Tandoori Vadapav",            price:"₹49",  desc:"Tandoori-spiced vada in a pav with smoky chutney. Bold flavours, beautiful combination.",      veg:true, cat:"Vadapav",    soon:false, img:"/cafe-imgs/Tandoori Vadapav.jpg" },
  { name:"Jumbo Cheese Vadapav",        price:"₹69",  desc:"Our biggest, cheesiest vadapav. Loaded, indulgent, absolutely worth every rupee.",             veg:true, cat:"Vadapav",    soon:false, img:"/cafe-imgs/Jumbo Cheese Vadapav.jpeg" },
  /* ── RICE DELIGHTS ── */
  { name:"Veg Fried Rice",              price:"₹59",  desc:"Wok-tossed fried rice with fresh veggies, soy, and aromatic seasoning.",                       veg:true, cat:"Rice",       soon:false, img:"/cafe-imgs/Veg Fried Rice.jpg" },
  { name:"Schezwan Fried Rice",         price:"₹69",  desc:"Spicy Schezwan-tossed fried rice with veggies and bold Chinese flavours.",                     veg:true, cat:"Rice",       soon:false, img:"/cafe-imgs/Schezwan Fried Rice.jpg" },
  { name:"Chilli Garlic Fried Rice",    price:"₹69",  desc:"Fried rice with roasted garlic and green chilli. Simple, bold, and dangerously good.",         veg:true, cat:"Rice",       soon:false, img:"/cafe-imgs/Chilli Garlic Fried Rice.jpg" },
  { name:"Paneer Fried Rice",           price:"₹79",  desc:"Wok-fried rice with tender paneer cubes and aromatic seasoning. Our premium pick.",            veg:true, cat:"Rice",       soon:false, img:"/cafe-imgs/Paneer Fried Rice.jpg" },
  /* ── G.O.A.T SIGNATURE ── */
  { name:"Interesting Coffee",          price:"₹25",  desc:"Our secret signature coffee blend — the one that started it all. You'll keep coming back.",    veg:true, cat:"Signature",  soon:false, img:"/cafe-imgs/regular_coffee.webp" },
  { name:"Chat Basket",                 price:"₹49",  desc:"A crispy basket filled with tangy, spiced chaat. Our most creative street-food mashup.",       veg:true, cat:"Signature",  soon:false, img:"/cafe-imgs/Chat Basket.avif" },
  { name:"Cold Coffee",                 price:"₹69",  desc:"Rich, frothy cold coffee blended smooth with chilled milk. Campus's #1 afternoon drink.",       veg:true, cat:"Signature",  soon:false, img:"/cafe-imgs/Cold Badam Milk.jpg" },
  { name:"Pasta Stick",                 price:"₹79",  desc:"Crispy pasta sticks with our signature dipping sauce. A creative G.O.A.T original.",           veg:true, cat:"Signature",  soon:false, img:"/cafe-imgs/Pasta Stick.jpg" },
  { name:"Biscoff Desert",              price:"₹89",  desc:"Luxurious Biscoff-based dessert — creamy, caramelised, and absolutely divine.",                 veg:true, cat:"Signature",  soon:false, img:"/cafe-imgs/Biscoff Desert.jpg" },
  { name:"GOAT Platter",                price:"₹149", desc:"Bun Pizza + Tortilla Cup + Chat Baskets + Choco Lava Cake + Garlic Bread + Beverage. The full experience.",veg:true,cat:"Signature",soon:false,img:"/cafe-imgs/GOAT Platter.jpg" },
];
const TABS = ["All","Coffee","Tea & Hot","Juice","Milkshakes","Chillers","Ice Cream","Pizza","Rolls","Bread","Sandwiches","Pasta","Fries","Nachos","Maggie","Tiny Treats","Mouthful","Vadapav","Rice","Signature"];

function MenuSection() {
  const [active, setActive] = useState("All");
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { setShowAll(false); }, [active]);
  const items = active === "All" ? MENU_ITEMS : MENU_ITEMS.filter(m => m.cat === active);
  const isAllTab = active === "All";
  const visibleItems = (isAllTab && !showAll) ? items.slice(0, 12) : items;
  return (
    <section id="menu" style={{ background: C.bg, padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="The Spread" />
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <H2>Crafted to<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Perfection.</em></H2>
            <div style={{ background:"#16a34a", color:"#fff", padding:"6px 16px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1.5, display:"flex", alignItems:"center", gap:6, alignSelf:"flex-end", marginBottom:8 }}>
              🌿 100% VEGETARIAN
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, maxWidth: 480, lineHeight: 1.75, marginTop: 16, marginBottom: 40 }}>
            Every item made fresh. Every flavour considered. No tasting powder. No palm oil. No artificial colorants. Ever.
          </p>
        </FadeUp>
        {/* Tabs */}
        <FadeUp delay={0.08}>
          <style>{`@keyframes signaturePulse { 0%, 100% { box-shadow: 0 0 14px rgba(201,168,76,0.25); } 50% { box-shadow: 0 0 22px rgba(201,168,76,0.5); } }`}</style>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
            {TABS.map(t => {
              const isActive = active === t;
              const isSignature = t === "Signature";
              const sigInactive = isSignature && !isActive;
              return (
                <button key={t} onClick={() => setActive(t)}
                  style={{
                    background: isActive
                      ? C.gold
                      : sigInactive
                        ? "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.08))"
                        : "transparent",
                    color: isActive ? C.dark : sigInactive ? "#c9a84c" : C.text,
                    border: sigInactive
                      ? "1.5px solid rgba(201,168,76,0.6)"
                      : `1px solid ${isActive ? C.gold : C.gold + "33"}`,
                    padding: "9px 22px",
                    borderRadius: 100,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : isSignature ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    letterSpacing: 0.5,
                    display: isSignature ? "inline-flex" : undefined,
                    alignItems: isSignature ? "center" : undefined,
                    gap: isSignature ? 6 : undefined,
                    boxShadow: sigInactive ? "0 0 14px rgba(201,168,76,0.25)" : undefined,
                    animation: sigInactive ? "signaturePulse 2.5s ease-in-out infinite" : undefined,
                  }}>
                  {isSignature && <Star size={13} fill={isActive ? C.dark : "#c9a84c"} color={isActive ? C.dark : "#c9a84c"} />}
                  {t}
                </button>
              );
            })}
          </div>
        </FadeUp>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 20 }}>
          {visibleItems.map((item, i) => (
            <FadeUp key={item.name + i} delay={i * 0.04}>
              <div style={{ background: item.soon ? "rgba(255,255,255,0.01)" : item.cat === "Signature" ? `rgba(201,168,76,0.12)` : C.goldGlow, border: `1px solid ${item.soon ? C.gold+"0d" : item.cat === "Signature" ? C.gold+"66" : C.gold+"18"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s", opacity: item.soon ? 0.65 : 1 }}
                onMouseEnter={e => { if (!item.soon) { e.currentTarget.style.border=`1px solid ${C.gold}44`; e.currentTarget.style.transform="translateY(-3px)"; }}}
                onMouseLeave={e => { if (!item.soon) { e.currentTarget.style.border=`1px solid ${C.gold}18`; e.currentTarget.style.transform="translateY(0)"; }}}>
                <div style={{ position:"relative" }}>
                  {item.img ? (
                    <img src={item.img} alt={item.name} style={{ width:"100%", height:150, objectFit:"cover", display:"block", borderBottom:`1px solid ${C.gold}14` }} onError={e => { e.target.style.display="none"; }} />
                  ) : (
                    <Placeholder label="Dish Image" height={150} rounded={0} style={{ borderRadius:0, border:"none", borderBottom:`1px solid ${C.gold}14` }} />
                  )}
                  {item.soon && (
                    <div style={{ position:"absolute", top:10, right:10, background:C.gold, color:C.dark, padding:"4px 12px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:1 }}>
                      Coming Soon
                    </div>
                  )}
                  {item.cat === "Signature" && !item.soon && (
                    <div style={{ position:"absolute", top:10, left:10, background:"linear-gradient(135deg,#c9a84c,#e8c97a)", color:C.dark, padding:"5px 12px", borderRadius:100, fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:800, letterSpacing:1, display:"flex", alignItems:"center", gap:4, boxShadow:`0 2px 12px ${C.gold}55` }}>
                      ⭐ SIGNATURE
                    </div>
                  )}
                </div>
                <div style={{ padding:"16px 18px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      {!item.soon && <div style={{ width:9, height:9, borderRadius:"50%", background:item.veg?"#22c55e":"#ef4444", flexShrink:0 }} />}
                      <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:C.cream, margin:0 }}>{item.name}</h4>
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:C.gold, flexShrink:0 }}>{item.price}</span>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted, lineHeight:1.68, marginBottom:14 }}>{item.desc}</p>
                  {item.soon ? (
                    <div style={{ textAlign:"center", padding:"8px 0", fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.muted, letterSpacing:1 }}>🔜 Stay tuned</div>
                  ) : (
                    <a href={WA} target="_blank" rel="noopener noreferrer"
                      style={{ display:"block", textAlign:"center", background:"transparent", color:C.gold, border:`1px solid ${C.gold}33`, padding:"8px 0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, textDecoration:"none", letterSpacing:0.5, transition:"all 0.2s" }}
                      onMouseEnter={e=>{ e.target.style.background=C.gold; e.target.style.color=C.dark; }}
                      onMouseLeave={e=>{ e.target.style.background="transparent"; e.target.style.color=C.gold; }}>
                      Order on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        {isAllTab && items.length > 12 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: "rgba(201,168,76,0.12)",
                border: "1.5px solid #c9a84c",
                color: "#c9a84c",
                padding: "14px 36px",
                borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#c9a84c";
                e.currentTarget.style.color = "#1a1a1a";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(201,168,76,0.12)";
                e.currentTarget.style.color = "#c9a84c";
              }}
            >
              {showAll ? "Show Less" : `Show More Items (${items.length - 12} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────── */
function About() {
  return (
    <Section bg={C.bgCard}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="about-grid">
        <FadeUp>
          <Overline text="Our Story" />
          <H2>Real Food.<br />Real Flavors.<br /><em style={{ color: C.gold, fontStyle: "italic" }}>No Shortcuts.</em></H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: C.text, lineHeight: 1.8, marginTop: 20, marginBottom: 18 }}>
            At G.O.A.T Café, we believe that great taste should come from real ingredients, honest cooking, and uncompromised quality. Every dish we serve is thoughtfully prepared to deliver rich flavour, freshness, and a dining experience you can trust.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 18 }}>
            Our approach is simple — great food should be both delicious and clean. That's why founder <strong style={{ color: C.cream }}>Rakshitha</strong> is committed to cooking with care and maintaining high standards in every plate that leaves the kitchen.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 44, padding: "14px 18px", borderLeft: `3px solid ${C.gold}55`, background: C.goldGlow, borderRadius: "0 10px 10px 0" }}>
            🛢️ We replace cooking oil every week to ensure every bite reflects the freshness our customers deserve.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { icon: <Leaf size={18} />,     label: "No Tasting\nPowders" },
              { icon: <Utensils size={18} />, label: "No Artificial\nColorants" },
              { icon: <Heart size={18} />,    label: "No Palm Oil\nUsed" },
              { icon: <CheckCircle size={18} />, label: "No Unnecessary\nChemicals" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ background: C.goldGlow, border: `1px solid ${C.gold}22`, borderRadius: 14, padding: "20px 14px", textAlign: "center" }}>
                <div style={{ color: C.gold, display: "flex", justifyContent: "center", marginBottom: 10 }}>{icon}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.cream, lineHeight: 1.55, whiteSpace: "pre-line" }}>{label}</p>
              </div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <img src="/cafe-imgs/cafe-indoor.jpeg" alt="G.O.A.T Café interior" style={{ width:"100%", height:500, objectFit:"cover", borderRadius:20, display:"block", border:`1.5px solid ${C.gold}22` }} />
        </FadeUp>
      </div>
      <style>{`@media(max-width:820px){.about-grid{grid-template-columns:1fr!important;}}`}</style>
    </Section>
  );
}

/* ─── QUALITY STRIP ─────────────────────────────────────────── */
function QualityStrip() {
  return (
    <section style={{ background: "#0a0a0a", borderTop:`1px solid ${C.gold}18`, borderBottom:`1px solid ${C.gold}18`, padding:"36px 28px", overflow:"hidden" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeUp>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20 }}>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${C.gold}44)` }}/>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.gold, letterSpacing:4, textTransform:"uppercase", whiteSpace:"nowrap" }}>In a world full of shortcuts, we chose a different path</p>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${C.gold}44,transparent)` }}/>
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { icon:"🚫", label:"No Tasting Powders" },
              { icon:"🎨", label:"No Artificial Colorants" },
              { icon:"🛢️", label:"No Palm Oil" },
              { icon:"⚗️", label:"No Unnecessary Chemicals" },
              { icon:"🔄", label:"Oil Replaced Weekly" },
              { icon:"🍃", label:"100% Vegetarian" },
              { icon:"👩‍🍳", label:"Made Fresh Daily" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:8, background:C.goldGlow, border:`1px solid ${C.gold}22`, borderRadius:100, padding:"9px 18px" }}>
                <span style={{ fontSize:14 }}>{icon}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.cream, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── GALLERY ────────────────────────────────────────────────── */
function Gallery() {
  const [hov, setHov] = useState(null);
  // Masonry-like mix: tall = span 2 rows
  const items = [
    { id:1, tall:true,  src:"/cafe-imgs/cafe-indoor.jpeg",   label:"Indoor Ambiance" },
    { id:2,             src:"/cafe-imgs/cafe-exterior.jpeg",  label:"Cafe Front" },
    { id:3,             src:"/cafe-imgs/cafe-outdoor1.jpeg",  label:"Outdoor Seating" },
    { id:4,             src:"/cafe-imgs/cafe-outdoor2.jpeg",  label:"Open Air Dining" },
    { id:5, tall:true,  src:"/cafe-imgs/cafe-front.jpeg",    label:"The Entrance" },
    { id:6,             src:"/cafe-imgs/cafe-indoor.jpeg",   label:"Gallery 6" },
    { id:7,             src:"/cafe-imgs/Crispy Vadapav.jpg",                             label:"Gallery 7" },
    { id:8,             src:null,                             label:"Gallery 8" },
    { id:9,             src:"/cafe-imgs/Dahipuri.webp",                             label:"Gallery 9" },
  ];
  return (
    <section id="gallery" style={{ background: C.bg, padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="Vibes Only" />
          <H2>A Peek Inside<br /><em style={{ color: C.gold, fontStyle: "italic" }}>The G.O.A.T</em></H2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridAutoRows: 200, gap: 12, marginTop: 48 }} className="gallery-grid">
          {items.map(item => (
            <div key={item.id}
              style={{ position: "relative", gridRow: item.tall ? "span 2" : "span 1", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: `1.5px solid ${hov === item.id ? C.gold+"88" : C.gold+"22"}`, transition: "border-color 0.25s, transform 0.25s", transform: hov === item.id ? "scale(1.01)" : "scale(1)" }}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}>
              {item.id === 1 ? (
                <video
                  src="/cafe-imgs/gallery-1.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "inherit"
                  }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : item.id === 5 ? (
                <video
                  src="/cafe-imgs/gallery-5.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "inherit"
                  }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : item.id === 8 ? (
                <video
                  src="/cafe-imgs/gallery-8.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "inherit"
                  }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : item.src ? (
                <img src={item.src} alt={item.label} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", background:C.goldGlow, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:3, color:C.gold, opacity:0.55, textTransform:"uppercase" }}>{item.label}</span>
                </div>
              )}
              {hov === item.id && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(2px)" }}>
                  <ZoomIn size={26} style={{ color:C.cream }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <FadeUp delay={0.15}>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <a href="https://www.instagram.com/thegoatcafe_official?igsh=emZteTA5MWQ3cnRx" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff", padding: "14px 30px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: 0.5, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.target.style.opacity="0.85"}
              onMouseLeave={e => e.target.style.opacity="1"}>
              <Instagram size={17} /> See More on Instagram
            </a>
          </div>
        </FadeUp>
      </div>
      <style>{`@media(max-width:640px){.gallery-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </section>
  );
}

/* ─── REVIEWS ────────────────────────────────────────────────── */
const REVIEWS = [
  { name:"Arjun S.",        role:"BTech CSE · 3rd Year",   text:"The cold coffee is an absolute lifesaver before morning lectures. Best on campus, hands down!",                              rating:5 },
  { name:"Priya R.",        role:"MBA Student",             text:"Ordered catering for our department event — every single guest complimented the food. Greatest Of All Taste — living up to the name!",        rating:5 },
  { name:"Dr. Meenakshi K.",role:"Faculty, JSS S&TU",       text:"I've had campus food across three universities. G.O.A.T stands above them all. Quality is remarkably consistent.",            rating:5 },
  { name:"Rohith M.",       role:"BTech ECE · Final Year",  text:"Celebrated my birthday here last week. The setup was beautiful and the cake was absolutely chef's kiss.",                    rating:5 },
  { name:"Shalini B.",      role:"MTech Student",           text:"Happy hours make this place unmissable. ₹30 chai with a warm veg puff is the best deal in all of Mysuru.",                  rating:5 },
  { name:"Kiran P.",        role:"Research Scholar",        text:"Finally a campus café that feels premium without breaking a student's wallet. Rakshitha has truly nailed it.",               rating:5 },
];

function Reviews() {
  return (
    <Section bg={C.bgCard}>
      <FadeUp>
        <Overline text="What They're Saying" />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
          <H2>Rated 🐐 by<br />Real People.</H2>
          <div style={{ background: C.goldGlow, border: `1px solid ${C.gold}33`, borderRadius: 100, padding: "10px 22px", display: "flex", alignItems: "center", gap: 10, alignSelf: "flex-end" }}>
            <Stars n={5} size={13} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gold, fontWeight: 600 }}>4.8 on Google · 500+ Reviews</span>
          </div>
        </div>
      </FadeUp>
      {/* Auto-scroll ticker */}
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 20, animation: "ticker 36s linear infinite", width: "max-content" }}>
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <div key={i} style={{ width: 300, background: C.goldGlow, border: `1px solid ${C.gold}18`, borderRadius: 18, padding: 24, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.gold}18`, border: `1.5px dashed ${C.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: C.gold }}>{r.name[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.cream, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>{r.role}</p>
                </div>
                {/* Google G icon */}
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <Stars n={r.rating} size={12} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.text, lineHeight: 1.72, marginTop: 12, fontStyle: "italic" }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── FEEDBACK ───────────────────────────────────────────────── */
function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  const iStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #d8d0c4",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", marginBottom: 12,
    background: "#fffef8", color: "#1a1a1a", boxSizing: "border-box",
  };

  return (
    <section style={{ background: C.cream, padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="Talk To Us" />
          <H2 light={false}>Your Opinion is<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Our Recipe.</em></H2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#555", maxWidth: 480, lineHeight: 1.75, marginTop: 16, marginBottom: 52 }}>
            We take every piece of feedback seriously. It's how we keep getting better every day.
          </p>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 48 }}>
          {/* Email form */}
          <FadeUp>
            <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.dark, marginBottom: 24 }}>Leave a Review</h3>
              {done ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🙏</div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, marginBottom: 8 }}>Thank You!</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 14 }}>Your feedback helps us be better every day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", marginBottom: 8, letterSpacing: 0.5 }}>Your Rating</p>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={28} fill={(hover || rating) >= n ? "#FBBC04" : "none"} style={{ color: "#FBBC04", cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} />
                      ))}
                    </div>
                  </div>
                  <input type="text"    placeholder="Your Name"         value={form.name}    onChange={e => setForm({...form, name: e.target.value})}    style={iStyle} />
                  <input type="email"   placeholder="Email Address"     value={form.email}   onChange={e => setForm({...form, email: e.target.value})}   style={iStyle} />
                  <textarea placeholder="Tell us about your experience..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4}
                    style={{ ...iStyle, resize: "none", marginBottom: 20 }} />
                  <button type="submit" style={{ width: "100%", background: C.gold, color: C.dark, border: "none", padding: 14, borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.target.style.background = C.goldLight}
                    onMouseLeave={e => e.target.style.background = C.gold}>
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
          {/* WhatsApp option */}
          <FadeUp delay={0.12}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 8 }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.dark, marginBottom: 14 }}>Prefer to Chat?</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.78 }}>
                  Drop us a voice note, a photo, or just a message on WhatsApp. Rakshitha personally reads every message and responds within minutes.
                </p>
              </div>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#25D366", color: "#fff", padding: "18px 28px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", alignSelf: "flex-start", transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity="0.85"} onMouseLeave={e => e.target.style.opacity="1"}>
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "transparent", color: C.dark, border: `2px solid ${C.dark}`, padding: "18px 28px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none", alignSelf: "flex-start", transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity="0.7"} onMouseLeave={e => e.target.style.opacity="1"}>
                <Mail size={20} /> Send an Email
              </a>
              <div style={{ padding: 24, background: `${C.gold}12`, border: `1px solid ${C.gold}30`, borderRadius: 16 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#333", lineHeight: 1.8, margin: 0 }}>
                  📞 <strong>{PHONE}</strong><br />
                  ✉️ <strong>{EMAIL}</strong><br />
                  <span style={{ color: "#888", fontSize: 12 }}>Owner: Rakshitha · Response time: &lt;10 mins</span>
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT + MAP ──────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ background: C.bgDeep, padding: "96px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <FadeUp>
          <Overline text="Find Us" />
          <H2>Come Hungry.<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Leave Happy.</em></H2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, marginTop: 52, alignItems: "start" }} className="contact-grid">
          <FadeUp>
            <div>
              {[
                { icon:<MapPin size={17}/>,  label:"Address", val:"G.O.A.T The Café\nJSS Science and Technology University\nCanteen, Mysuru, Karnataka 570006" },
                { icon:<Phone size={17}/>,   label:"Phone",   val:PHONE },
                { icon:<Mail size={17}/>,    label:"Email",   val:EMAIL },
                { icon:<Clock size={17}/>,   label:"Hours",   val:"Mon–Sat: 8:00 AM – 9:00 PM\nSun: 10:00 AM – 8:00 PM" },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                  <div style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}>{icon}</div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: C.cream, lineHeight: 1.65, whiteSpace: "pre-line" }}>{val}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 36, flexWrap: "wrap" }}>
                {[
                  { href:"https://instagram.com", icon:<Instagram size={16}/>, label:"Instagram" },
                  { href:WA,                       icon:<MessageCircle size={16}/>, label:"WhatsApp" },
                  { href:MAPS_LINK,                icon:<MapPin size={16}/>, label:"Google Maps" },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 7, background: C.goldGlow, border: `1px solid ${C.gold}33`, color: C.gold, padding: "10px 18px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.target.style.background = `${C.gold}20`; }}
                    onMouseLeave={e => { e.target.style.background = C.goldGlow; }}>
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>
          {/* Live Google Maps embed */}
          <FadeUp delay={0.15}>
            <div style={{ borderRadius: 18, overflow: "hidden", border: `1.5px solid ${C.gold}33`, boxShadow: `0 0 40px ${C.gold}10` }}>
              <iframe
                src={MAPS_EMBED}
                title="G.O.A.T The Café — JSS University"
                width="100%" height="400" style={{ border: 0, display: "block" }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, background: C.goldGlow, border: `1px solid ${C.gold}33`, color: C.gold, padding: "12px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
              <MapPin size={15} /> Open in Google Maps
            </a>
          </FadeUp>
        </div>
        {/* Map banner placeholder */}
        <FadeUp delay={0.2}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, borderRadius: 16, overflow: "hidden", marginTop: 48 }}>
            {["cafe-front.jpeg", "cafe-indoor.jpeg", "cafe-outdoor1.jpeg", "cafe-outdoor2.jpeg"].map((f, i) => (
              <img
                key={i}
                src={`/cafe-imgs/${f}`}
                alt={`Café view ${i+1}`}
                style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ))}
          </div>
        </FadeUp>
      </div>
      <style>{`@media(max-width:820px){.contact-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ background: "#080808", padding: "64px 28px 32px", borderTop: `1px solid ${C.gold}15` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }} className="footer-grid">
          <div>
            <img src="/cafe-imgs/goat-logo.png" alt="G.O.A.T The Café" style={{ height: 44, display: "block", borderRadius: 6 }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: C.muted, fontStyle: "italic", lineHeight: 1.7, maxWidth: 260 }}>
              "Crafted with Quality. Served with Care."
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted, marginTop: 14 }}>{PHONE}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted }}>{EMAIL}</p>
          </div>
          {[
            { heading:"Navigate",  links:[["Menu","menu"],["Events","events"],["Catering","catering"],["Gallery","gallery"],["Contact","contact"]] },
            { heading:"Connect",   links:[["Instagram","https://www.instagram.com/thegoatcafe_official"],["WhatsApp",WA],["Google Maps",MAPS_LINK],["Email",`mailto:${EMAIL}`]] },
            { heading:"Visit",     links:[["JSS S&TU Canteen",""],["Mysuru, Karnataka",""],["570006",""]] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 22 }}>{heading}</h4>
              {links.map(([label, href]) => (
                href.startsWith("http") || href.startsWith("mailto") ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>{label}</a>
                ) : href ? (
                  <button key={label} onClick={() => scrollTo(href)} style={{ display: "block", background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, textDecoration: "none", marginBottom: 12, cursor: "pointer", padding: 0, transition: "color 0.2s", textAlign: "left" }}
                    onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>{label}</button>
                ) : (
                  <p key={label} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, marginBottom: 10 }}>{label}</p>
                )
              ))}
            </div>
          ))}
        </div>
        <GoldLine />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted }}>
            Made with ❤️ by SHUBHAM 9508372431· © {new Date().getFullYear()} G.O.A.T The Café · Greatest Of All Taste
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.muted, fontStyle:"italic" }}>
            The conversation doesn't end here… Let's continue it over a great cup of coffee and delicious food. ☕ See you at G.O.A.T Café.
          </p>
        </div>
      </div>
      <style>{`@media(max-width:820px){.footer-grid{grid-template-columns:1fr 1fr!important;} }`}</style>
    </footer>
  );
}

/* ─── SCROLL TO TOP ──────────────────────────────────────────── */
function ScrollToTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
        width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${C.gold}80`,
        background: "rgba(201,168,76,0.15)", color: C.gold, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: vis ? 1 : 0, pointerEvents: vis ? "auto" : "none",
        transition: "opacity 0.3s ease, background 0.2s", zIndex: 9998,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.3)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(201,168,76,0.15)"}>
      <ChevronUp size={22} />
    </button>
  );
}

/* ─── WHATSAPP FLOAT ─────────────────────────────────────────── */
function WAFloat() {
  return (
    <a href={WA} target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 28, right: 28, width: 58, height: 58, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, textDecoration: "none", animation: "waPulse 2.5s ease-out infinite", boxShadow: "0 4px 20px rgba(37,211,102,0.45)" }}>
      <MessageCircle size={26} style={{ color: "#fff" }} />
    </a>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function GoatCafe() {
  useEffect(() => {
    // Inject Google Fonts
    if (!document.getElementById("goat-fonts")) {
      const link = document.createElement("link");
      link.id = "goat-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
    // Inject global CSS
    if (!document.getElementById("goat-global")) {
      const style = document.createElement("style");
      style.id = "goat-global";
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <VisionMission />
      <Offers />
      <Events />
      <Catering />
      <MenuSection />
      <About />
      <QualityStrip />
      <Gallery />
      <Reviews />
      <Feedback />
      <Contact />
      <Footer />
      <WAFloat />
      <ScrollToTop />
    </div>
  );
}
