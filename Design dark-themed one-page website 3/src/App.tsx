import { useState, useCallback, useEffect, useRef } from "react";
import imgEspresso from "@/imports/pexels-slytonic-34862889.jpg";
import imgGlasses from "@/imports/pexels-the-anius-85579437-32811377.jpg";
import imgFood from "@/imports/pexels-alleksana-6399826.jpg";
import imgInterior from "@/imports/pexels-msuatgunerli-3252051.jpg";
import imgBar from "@/imports/pexels-nathanjhilton-30173526.jpg";
import videoCoffee from "@/imports/6166868-uhd_3840_2160_25fps.mp4";

const AMBER = "#C4822A";
const RUST  = "#7A2E22";
const PAPER = "#F2EDE4";
const DARK  = "#14100D";

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── Time-aware greeting ───────────────────────────────────────────────────────
function useTimeGreeting() {
  const get = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 12) return "Good morning. We're on coffee.";
    if (h >= 12 && h < 17) return "Good afternoon. We're on coffee.";
    if (h >= 17 && h < 24) return "Good evening. We're on wine.";
    return "We open at 7. See you soon.";
  };
  const [greeting, setGreeting] = useState(get);
  useEffect(() => {
    const id = setInterval(() => setGreeting(get()), 60_000);
    return () => clearInterval(id);
  }, []);
  return greeting;
}

// ── Sticky Nav ────────────────────────────────────────────────────────────────
function StickyNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className={`sticky-nav ${visible ? "visible" : ""}`}
      style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", backgroundColor: "rgba(20,16,13,0.85)", borderBottom: "1px solid rgba(242,237,228,0.07)" }}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: AMBER }} />
          <span className="font-display font-extrabold uppercase text-xs tracking-[0.18em]" style={{ color: PAPER, opacity: 0.75 }}>Undertone</span>
        </div>
        <div className="flex gap-6">
          {[["Coffee", "#menu"], ["Wine", "#wine"], ["Story", "#story"], ["Visit", "#visit"]].map(([label, href]) => (
            <a key={label} href={href} className="text-xs uppercase tracking-widest transition-opacity hover:opacity-80" style={{ color: PAPER, opacity: 0.45, fontFamily: "Work Sans, sans-serif" }}>{label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const text = "COFFEE · WINE · SMALL PLATES · 214 HARTLEY ST · PORTLAND OR · OPEN DAILY 7AM – 1AM · ";
  const rep = text.repeat(8);
  return (
    <div className="overflow-hidden py-3" style={{ backgroundColor: "#100d0a", borderTop: `1px solid rgba(242,237,228,0.07)`, borderBottom: `1px solid rgba(242,237,228,0.07)` }}>
      <div className="marquee-track">
        <span className="font-display font-bold text-xs tracking-[0.2em]" style={{ color: AMBER, opacity: 0.7 }}>{rep}{rep}</span>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
type HeroGlow = "none" | "coffee" | "wine";

function Hero() {
  const [glow, setGlow] = useState<HeroGlow>("none");
  const greeting = useTimeGreeting();

  const onCoffee = useCallback(() => setGlow("coffee"), []);
  const onWine   = useCallback(() => setGlow("wine"), []);
  const onLeave  = useCallback(() => setGlow("none"), []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Wordmark */}
      <div className="absolute top-8 left-6 md:left-12 flex items-center gap-3 z-10">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: AMBER }} />
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: PAPER, opacity: 0.6 }}>Undertone</span>
      </div>
      <div className="absolute top-8 right-6 md:right-12 z-10">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: PAPER, opacity: 0.4, fontFamily: "Work Sans, sans-serif" }}>Open Seven Days · from 7am</span>
      </div>

      <div className="flex flex-col md:flex-row items-center w-full min-h-screen">
        {/* Text */}
        <div
          className="relative flex-1 flex flex-col justify-center px-6 md:pl-12 md:pr-6 pt-24 pb-12 md:py-0 z-10"
          style={{
            transition: "background 0.7s ease",
            background:
              glow === "coffee" ? `radial-gradient(ellipse 90% 60% at 30% 45%, rgba(196,130,42,0.13) 0%, transparent 70%)`
              : glow === "wine"  ? `radial-gradient(ellipse 90% 60% at 30% 55%, rgba(122,46,34,0.24) 0%, transparent 70%)`
              : "none",
          }}
        >
          <a href="#menu" className="hero-word block" onMouseEnter={onCoffee} onMouseLeave={onLeave} onTouchStart={onCoffee} onTouchEnd={onLeave} aria-label="Go to coffee menu">COFFEE</a>
          <a href="#wine" className="hero-word block" onMouseEnter={onWine}   onMouseLeave={onLeave} onTouchStart={onWine}   onTouchEnd={onLeave} aria-label="Go to wine menu" style={{ color: glow === "wine" ? AMBER : undefined }}>WINE</a>
          <p className="mt-10 text-sm md:text-base font-medium tracking-[0.14em] uppercase" style={{ color: PAPER, opacity: 0.5, fontFamily: "Work Sans, sans-serif" }}>{greeting}</p>
        </div>

        {/* Video */}
        <div
          className="relative shrink-0 w-full md:w-[38vw] overflow-hidden"
          style={{
            height: "clamp(320px, 70vh, 820px)",
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.95) 60%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.95) 60%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <video src={videoCoffee} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, ${DARK} 0%, transparent 35%)` }} />
        </div>
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 z-10" style={{ opacity: 0.3 }}>
        <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${PAPER}, transparent)` }} />
      </div>
    </section>
  );
}

// ── Menu item ─────────────────────────────────────────────────────────────────
interface MenuItemProps { name: string; note: string; price: string; }

function MenuItem({ name, note, price }: MenuItemProps) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-4" style={{ borderBottom: "1px solid rgba(242,237,228,0.08)" }}>
      <div className="flex-1 min-w-0">
        <span className="font-display font-semibold uppercase text-sm tracking-wide block" style={{ color: PAPER }}>{name}</span>
        <span className="text-xs mt-0.5 block" style={{ color: PAPER, opacity: 0.44 }}>{note}</span>
      </div>
      <span className="font-display text-sm font-semibold shrink-0" style={{ color: AMBER }}>{price}</span>
    </div>
  );
}

// ── Coffee Section ────────────────────────────────────────────────────────────
function CoffeeSection() {
  const ref = useReveal();
  const items: MenuItemProps[] = [
    { name: "Cortado",         note: "Sweet, tight, just enough milk to round the shot",        price: "$5"    },
    { name: "Filter of the Day", note: "Single origin, brewed to order, changes weekly",        price: "$4"    },
    { name: "Shakerato",       note: "Double espresso, ice, a whisper of cane syrup",           price: "$6"    },
    { name: "Cold Brew",       note: "18-hour steep, dark cherry, low acid, no drama",          price: "$5"    },
    { name: "Flat White",      note: "Smaller than a latte, more concentrated — the right call", price: "$5.50" },
    { name: "Lungo",           note: "Extended pull, lighter body, good for a slow morning",     price: "$4.50" },
    { name: "Iced Latte",      note: "House blend over ice, whole milk, nothing added",          price: "$6"    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="menu"
      className="section-rule reveal relative overflow-hidden py-24 px-6 md:px-12"
    >
      {/* Atmospheric espresso photo backing */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <img
          src={imgEspresso}
          alt=""
          className="absolute right-0 top-0 h-full w-[55%] object-cover"
          style={{ opacity: 0.055, filter: "blur(32px) saturate(1.6)", transform: "scale(1.08)", transformOrigin: "right center" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${DARK} 30%, transparent 70%, ${DARK} 100%)` }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto">
        <div className="mb-12">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: RUST }}>On the Bar</span>
          <h2 className="font-serif font-normal mt-3 leading-none" style={{ color: PAPER, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Coffee</h2>
          <p className="mt-4 text-sm leading-relaxed max-w-sm" style={{ color: PAPER, opacity: 0.45, fontFamily: "Work Sans, sans-serif" }}>
            We use a Slayer espresso machine and rotate single-origin filters weekly. Everything is brewed to order, nothing sits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 max-w-3xl">
          <div>{items.slice(0, 4).map(item => <MenuItem key={item.name} {...item} />)}</div>
          <div>{items.slice(4).map(item => <MenuItem key={item.name} {...item} />)}</div>
        </div>

        {/* Current origin callout */}
        <div
          className="mt-14 inline-flex items-start gap-5 px-6 py-5 rounded-sm"
          style={{ backgroundColor: "rgba(196,130,42,0.07)", border: `1px solid rgba(196,130,42,0.18)` }}
        >
          <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: AMBER, opacity: 0.6 }} />
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: AMBER }}>Current Filter Origin</p>
            <p className="text-sm" style={{ color: PAPER, opacity: 0.72, fontFamily: "Work Sans, sans-serif" }}>
              Yirgacheffe, Ethiopia — Worka Cooperative. Washed process. Jasmine, bergamot, and a clean stone-fruit finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Wine + Plates Section ─────────────────────────────────────────────────────
function WineSection() {
  const ref = useReveal();
  const wine: MenuItemProps[] = [
    { name: "Pét-Nat Rosé, Domaine Mosse",      note: "Loire Valley — wild strawberry, bread crust, alive in the glass", price: "$16" },
    { name: "Skin-Contact Pinot Gris, Radikon",  note: "Friuli — amber, dried apricot, tea tannins, goes with everything", price: "$19" },
    { name: "Gamay, Château Cambon",              note: "Beaujolais — cool, crunchy, red fruit, the kind you order twice", price: "$14" },
    { name: "Vermentino, Argiolas",              note: "Sardinia — saline, white peach, bone dry, for the table",          price: "$15" },
    { name: "Grüner Veltliner, Gut Oggau",       note: "Burgenland — peppery, green herb, dry and electric",               price: "$17" },
    { name: "Côt, Domaine de la Garrelière",     note: "Loire — deep violet, graphite, dark plum, serious",                price: "$18" },
    { name: "Rare Wine by Glass",                note: "Ask the bar — changes nightly, limited pours",                     price: "Market" },
  ];
  const plates: MenuItemProps[] = [
    { name: "Whipped Ricotta Toast",    note: "Sourdough, honey, Aleppo, flaky salt",                    price: "$9"  },
    { name: "Charcuterie Board",        note: "Three cuts, one cheese, cornichons, grainy mustard",       price: "$22" },
    { name: "Olives & Marcona Almonds", note: "Warm, herbed, good with anything in the glass",           price: "$8"  },
    { name: "Anchovy Butter on Rye",    note: "Salted, sharp, not for the faint-hearted",                price: "$10" },
    { name: "Burrata, Roasted Tomato",  note: "Calabrian chili oil, grilled bread, sea salt",            price: "$16" },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="wine"
      className="section-rule reveal relative overflow-hidden py-24 px-6 md:px-12"
    >
      {/* Atmospheric wine glass photo backing */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <img
          src={imgGlasses}
          alt=""
          className="absolute left-0 top-0 h-full w-[50%] object-cover"
          style={{ opacity: 0.06, filter: "blur(28px) saturate(1.4)", transform: "scale(1.06)", transformOrigin: "left center" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${DARK} 30%, transparent 70%, ${DARK} 100%)` }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto">
        <div className="mb-12">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: RUST }}>After Dark</span>
          <h2 className="font-serif font-normal mt-3 leading-none" style={{ color: PAPER, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Wine &amp; Plates</h2>
          <p className="mt-4 text-sm leading-relaxed max-w-sm" style={{ color: PAPER, opacity: 0.45, fontFamily: "Work Sans, sans-serif" }}>
            Natural and low-intervention producers only. The list is short on purpose — everything here is something we'd actually drink on a Tuesday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          <div>
            <h3 className="font-display font-bold uppercase text-xs tracking-[0.22em] mb-4" style={{ color: AMBER }}>By the Glass</h3>
            {wine.map(item => <MenuItem key={item.name} {...item} />)}
          </div>
          <div>
            <h3 className="font-display font-bold uppercase text-xs tracking-[0.22em] mb-4" style={{ color: AMBER }}>Small Plates</h3>
            {plates.map(item => <MenuItem key={item.name} {...item} />)}

            {/* Wine note */}
            <div
              className="mt-10 px-5 py-4 rounded-sm"
              style={{ backgroundColor: "rgba(122,46,34,0.12)", border: "1px solid rgba(122,46,34,0.25)" }}
            >
              <p className="text-xs leading-relaxed" style={{ color: PAPER, opacity: 0.6, fontFamily: "Work Sans, sans-serif" }}>
                Bottles available for the table. Ask your server — we keep a short rotating list of grower Champagnes and aged reds not on the by-the-glass menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Story ─────────────────────────────────────────────────────────────────────
function StorySection() {
  const ref = useReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="story" className="section-rule reveal py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="font-serif font-normal leading-none" style={{ color: PAPER, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Both, All Day</h2>
        </div>
        <div className="space-y-5" style={{ color: PAPER, opacity: 0.72 }}>
          <p className="text-base leading-relaxed" style={{ fontFamily: "Work Sans, sans-serif" }}>
            This place started as a frustration. Most coffee bars close at three in the afternoon, and most wine bars don't open until six. That's a three-hour gap where you're either drinking bad beer somewhere or going home. We didn't want either.
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: "Work Sans, sans-serif" }}>
            Undertone opened in 2021 in a former piano repair shop on Hartley Street. The floors are original. The espresso machine is a Slayer. The wine list is natural — not because it's trendy, but because we actually like what's happening with those producers.
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: "Work Sans, sans-serif" }}>
            We're open from seven in the morning until one at night. The vibe doesn't shift dramatically at sundown — same room, same music, same bartenders. Just different liquids in the glass.
          </p>
          <p className="text-sm font-medium uppercase tracking-widest pt-2" style={{ color: AMBER, fontFamily: "Work Sans, sans-serif" }}>— Mara & Theo, founders</p>
        </div>
      </div>

      {/* Pull-quote */}
      <blockquote
        className="my-16 md:my-20"
        style={{ borderLeft: `2px solid ${AMBER}`, paddingLeft: "clamp(1.5rem, 3vw, 3rem)" }}
      >
        <p
          className="font-serif font-normal leading-tight"
          style={{ color: PAPER, fontSize: "clamp(1.75rem, 4.5vw, 5rem)", opacity: 0.9 }}
        >
          Same room. Same music.<br />Just different liquids in the glass.
        </p>
      </blockquote>

      {/* Photo strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="overflow-hidden rounded-sm" style={{ height: 240, backgroundColor: "#2a1a12", border: "none", boxShadow: "rgba(0,0,0,0.25) 0px 4px 4px 0px, rgba(0,0,0,0.25) 0px 4px 4px 0px inset" }}>
          <img src={imgEspresso} alt="Espresso machine pulling a shot" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="overflow-hidden rounded-sm" style={{ height: 240, backgroundColor: "#2a1a12", borderWidth: 0 }}>
          <img src={imgGlasses} alt="Wine glasses on the bar in warm amber light" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="overflow-hidden rounded-sm" style={{ height: 240, backgroundColor: "#2a1a12" }}>
          <img src={imgFood} alt="Anchovy toast with olives on a wooden board" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="overflow-hidden rounded-sm" style={{ height: 240, backgroundColor: "#2a1a12" }}>
          <img src={imgInterior} alt="Warm bar interior, pendant lights, marble table with glassware" className="w-full h-full object-cover opacity-80" />
        </div>
      </div>
    </section>
  );
}

// ── Visit ─────────────────────────────────────────────────────────────────────
function VisitSection() {
  const ref = useReveal();
  const hours = [
    { day: "Monday – Friday", time: "7:00 am – 1:00 am" },
    { day: "Saturday",        time: "8:00 am – 2:00 am" },
    { day: "Sunday",          time: "9:00 am – 11:00 pm" },
  ];

  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="visit" className="section-rule reveal py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="mb-16">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: RUST }}>Find Us</span>
        <h2 className="font-serif font-normal mt-3 leading-none" style={{ color: PAPER, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Visit</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: AMBER }}>Address</h4>
            <address className="not-italic text-base leading-loose" style={{ color: PAPER, opacity: 0.72 }}>
              214 Hartley Street<br />Ground Floor<br />Portland, OR 97209
            </address>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: PAPER, opacity: 0.38 }}>Street parking on Hartley and adjacent lot on Mercer. TriMet stop three blocks north.</p>
          </div>
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: AMBER }}>Hours</h4>
            <div className="space-y-2">
              {hours.map(({ day, time }) => (
                <div key={day} className="flex justify-between items-baseline gap-4">
                  <span className="text-sm" style={{ color: PAPER, opacity: 0.52 }}>{day}</span>
                  <span className="text-sm font-medium" style={{ color: PAPER, opacity: 0.85 }}>{time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: RUST, opacity: 0.9 }}>Kitchen closes two hours before bar close.</p>
          </div>
        </div>
        <div className="relative rounded-sm overflow-hidden" style={{ height: 360, backgroundColor: "#1e1310", border: "1px solid rgba(242,237,228,0.08)" }}>
          <img src={imgBar} alt="Bar interior, wooden beams, wine glasses, bartender at work" className="w-full h-full object-cover" style={{ opacity: 0.32 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AMBER }} />
              <div className="absolute w-8 h-8 rounded-full animate-ping" style={{ backgroundColor: AMBER, opacity: 0.18, animationDuration: "2.5s" }} />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 rounded-sm" style={{ backgroundColor: "rgba(20,16,13,0.88)", border: "1px solid rgba(242,237,228,0.12)" }}>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wide" style={{ color: AMBER }}>Undertone</p>
              <p className="text-xs mt-0.5" style={{ color: PAPER, opacity: 0.6 }}>214 Hartley Street, Portland OR</p>
            </div>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium uppercase tracking-widest px-3 py-1.5 rounded-sm transition-opacity hover:opacity-80" style={{ color: DARK, backgroundColor: AMBER, fontFamily: "Work Sans, sans-serif" }}>
              Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="contact" className="section-rule reveal py-20 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: RUST }}>Get In Touch</span>
          <h2 className="font-serif font-normal mt-3 leading-none" style={{ color: PAPER, fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>Say Hello</h2>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: PAPER, opacity: 0.52, fontFamily: "Work Sans, sans-serif" }}>
            For private events, press, or anything else — we're a small team so expect a reply within a day or two.
          </p>
          <div className="mt-8 space-y-3">
            <a href="mailto:hello@undertone.bar" className="block text-sm font-medium transition-opacity hover:opacity-100" style={{ color: AMBER, opacity: 0.9 }}>hello@undertone.bar</a>
            <a href="tel:+15034210089" className="block text-sm font-medium transition-opacity hover:opacity-100" style={{ color: PAPER, opacity: 0.42 }}>(503) 421-0089</a>
            <div className="flex items-center gap-4 pt-2" style={{ color: PAPER, opacity: 0.32 }}>
              <a href="#" className="text-xs uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ fontFamily: "Work Sans, sans-serif" }}>Instagram</a>
              <span>·</span>
              <a href="#" className="text-xs uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ fontFamily: "Work Sans, sans-serif" }}>Newsletter</a>
            </div>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: PAPER, opacity: 0.42 }}>Name</label>
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 text-sm bg-transparent rounded-sm outline-none" style={{ border: "1px solid rgba(242,237,228,0.14)", color: PAPER, fontFamily: "Work Sans, sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: PAPER, opacity: 0.42 }}>Email</label>
              <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 text-sm bg-transparent rounded-sm outline-none" style={{ border: "1px solid rgba(242,237,228,0.14)", color: PAPER, fontFamily: "Work Sans, sans-serif" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: PAPER, opacity: 0.42 }}>Message</label>
            <textarea rows={4} placeholder="Private event for 30, press inquiry, saying hi..." className="w-full px-4 py-3 text-sm bg-transparent rounded-sm outline-none resize-none" style={{ border: "1px solid rgba(242,237,228,0.14)", color: PAPER, fontFamily: "Work Sans, sans-serif" }} />
          </div>
          <button type="submit" className="w-full py-4 text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-85" style={{ backgroundColor: AMBER, color: DARK, fontFamily: "Work Sans, sans-serif", borderRadius: "2px" }}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-6 md:px-12" style={{ borderTop: "1px solid rgba(242,237,228,0.08)" }}>
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: AMBER }} />
          <span className="font-display font-extrabold uppercase text-sm tracking-[0.15em]" style={{ color: PAPER, opacity: 0.42 }}>Undertone</span>
        </div>
        <p className="text-xs" style={{ color: PAPER, opacity: 0.22, fontFamily: "Work Sans, sans-serif" }}>
          214 Hartley Street, Portland OR — Coffee by day. Natural wine by night.
        </p>
        <nav className="flex gap-6">
          {[["Menu", "#menu"], ["Wine", "#wine"], ["Story", "#story"], ["Visit", "#visit"]].map(([label, href]) => (
            <a key={label} href={href} className="text-xs uppercase tracking-widest transition-opacity hover:opacity-70" style={{ color: PAPER, opacity: 0.32, fontFamily: "Work Sans, sans-serif" }}>{label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ backgroundColor: DARK, minHeight: "100vh" }}>
      <StickyNav />
      <Hero />
      <MarqueeStrip />
      <CoffeeSection />
      <WineSection />
      <StorySection />
      <VisitSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
