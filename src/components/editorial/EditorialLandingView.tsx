import React, { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import challengeAiBanner from '../../assets/images/challenge_ai_hackathon_1794834766037.jpg';
import challengeDsaBanner from '../../assets/images/challenge_dsa_leetcode_1794834765183.jpg';
import challengeWebBanner from '../../assets/images/challenge_web_fullstack_1794834767049.jpg';
import challengeHardwareBanner from '../../assets/images/challenge_hardware_iot_1794834766069.jpg';
import challengeUiUxBanner from '../../assets/images/challenge_uiux_sprint_1794834766731.jpg';

interface EditorialLandingViewProps {
  onEnterAuth: (mode: 'login' | 'register') => void;
}

const HERO_LINES = ['campus', 'builders.'];

const MARQUEE_ITEMS = [
  {
    title: 'AI & RAG Buildathon',
    meta: 'ML / PYTHON',
    image: challengeAiBanner,
    radiusClass: 'rounded-tl-[100px]'
  },
  {
    title: 'NexusKV Distributed Store',
    meta: 'SYSTEMS / GO',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=1120&fit=crop&q=80',
    radiusClass: 'rounded-tr-[100px] rounded-bl-[40px]'
  },
  {
    title: '30-Day DSA Sprint',
    meta: 'ALGORITHMS',
    image: challengeDsaBanner,
    radiusClass: 'rounded-[40px]'
  },
  {
    title: 'SmartCampus IoT Grid',
    meta: 'HARDWARE / MQTT',
    image: challengeHardwareBanner,
    radiusClass: 'rounded-tl-[100px]'
  },
  {
    title: 'Full-Stack Web Sprint',
    meta: 'REACT / NODE',
    image: challengeWebBanner,
    radiusClass: 'rounded-tr-[100px] rounded-bl-[40px]'
  },
  {
    title: 'Campus Design Systems',
    meta: 'UI / PRODUCT',
    image: challengeUiUxBanner,
    radiusClass: 'rounded-[40px]'
  }
];

const SHOWCASE_PROJECTS = [
  {
    id: 'proj-nexus',
    title: 'NexusKV Distributed Engine',
    category: 'Systems & Cloud',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop&q=80'
  },
  {
    id: 'proj-ai',
    title: 'Medi-Caps AI & RAG Buildathon',
    category: 'Machine Learning',
    year: '2026',
    image: challengeAiBanner
  },
  {
    id: 'proj-iot',
    title: 'SmartCampus Mobility Telemetry',
    category: 'Hardware & IoT',
    year: '2025',
    image: challengeHardwareBanner
  },
  {
    id: 'proj-dsa',
    title: '30-Day LeetCode & DSA Sprint',
    category: 'Competitive Coding',
    year: '2026',
    image: challengeDsaBanner
  },
  {
    id: 'proj-web',
    title: 'Open Source Campus Platform',
    category: 'Full-Stack Web',
    year: '2026',
    image: challengeWebBanner
  },
  {
    id: 'proj-ui',
    title: 'Student Interface Design Lab',
    category: 'Product Design',
    year: '2025',
    image: challengeUiUxBanner
  }
];

export const EditorialLandingView: React.FC<EditorialLandingViewProps> = ({ onEnterAuth }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let runningCharIndex = 0;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] antialiased selection:bg-[#000000] selection:text-[#FFFFFF]">
      {/* =====================================================================
          1. FIXED NAVIGATION HEADER (mix-blend-mode: difference)
          ===================================================================== */}
      <header
        style={{ mixBlendMode: 'difference' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 lg:px-24 lg:py-6 flex items-center justify-between text-[#FFFFFF]"
      >
        <a
          href="#hero"
          onClick={e => {
            e.preventDefault();
            scrollTo('hero');
          }}
          className="text-[24px] font-bold tracking-tighter lowercase leading-none focus:outline-none"
        >
          mc.
        </a>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onEnterAuth('login')}
            className="hidden sm:inline-block font-mono text-[14px] uppercase tracking-[0.1em] hover:opacity-70 transition-opacity duration-500 ease-editorial cursor-pointer"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/25 hover:border-white transition-all duration-500 ease-editorial cursor-pointer"
          >
            <Plus
              style={{
                transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="w-5 h-5"
            />
          </button>
        </div>
      </header>

      {/* =====================================================================
          EDITORIAL FULLSCREEN NAVIGATION DRAWER
          ===================================================================== */}
      <div
        aria-hidden={!menuOpen}
        style={{
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), visibility 600ms',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden'
        }}
        className="fixed inset-0 z-40 bg-[#0A0A0A] text-[#FFFFFF] flex flex-col justify-between px-6 py-28 lg:px-24"
      >
        <nav className="max-w-4xl space-y-4">
          <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#737373] mb-6">
            Campus Index
          </div>
          {[
            { label: 'Showcase Marquee', action: () => scrollTo('marquee') },
            { label: 'Manifesto', action: () => scrollTo('statement') },
            { label: 'Selected Student Work', action: () => scrollTo('projects') },
            { label: 'Student Sign In (@medicaps.ac.in)', action: () => { setMenuOpen(false); onEnterAuth('login'); } },
            { label: 'Register College Mail', action: () => { setMenuOpen(false); onEnterAuth('register'); } }
          ].map(item => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="block text-left text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.08] text-[#FFFFFF] hover:text-[#737373] transition-colors duration-500 ease-editorial cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[14px] uppercase tracking-[0.1em] text-[#737373]">
          <span>MediConnect — Medi-Caps University, Indore</span>
          <span>Verified Student Network 2026</span>
        </div>
      </div>

      {/* =====================================================================
          2. HERO SECTION (min-h: 80vh, center-aligned, 12vw staggered letters)
          ===================================================================== */}
      <section
        id="hero"
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 lg:px-24 pt-32 pb-16"
      >
        <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252] mb-8">
          Medi-Caps University · Verified Student Archive
        </div>

        <h1
          aria-label="campus builders."
          className="text-[12vw] font-bold tracking-[-0.05em] leading-[0.9] text-[#000000] select-none"
        >
          {HERO_LINES.map((word, lineIdx) => (
            <span key={word} className="block overflow-hidden py-[0.04em]">
              {word.split('').map(char => {
                const idx = runningCharIndex++;
                return (
                  <span
                    key={`${lineIdx}-${idx}`}
                    style={{ animationDelay: `${idx * 35}ms` }}
                    className="animate-letter-reveal"
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p className="text-[18px] sm:text-[24px] text-[#525252] mt-8 max-w-2xl mx-auto tracking-[-0.02em] leading-[1.4]">
          Verified engineering portfolios, formulaic campus rankings, and cross-branch student collaboration.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onEnterAuth('login')}
            className="px-8 py-4 rounded-full bg-[#000000] text-[#FFFFFF] hover:bg-[#262626] font-mono text-[14px] uppercase tracking-[0.1em] transition-all duration-500 ease-editorial cursor-pointer"
          >
            Enter Campus Portal
          </button>
          <button
            type="button"
            onClick={() => onEnterAuth('register')}
            className="px-8 py-4 rounded-full border border-black/10 bg-[#FFFFFF] text-[#000000] hover:border-black transition-all duration-500 ease-editorial font-mono text-[14px] uppercase tracking-[0.1em] cursor-pointer"
          >
            Register Mail ID
          </button>
        </div>
      </section>

      {/* =====================================================================
          3. INFINITE PROJECT MARQUEE (5/7 vertical cards, asymmetrical radii)
          ===================================================================== */}
      <section id="marquee" className="w-full overflow-hidden py-12 border-t border-black/10">
        <div className="editorial-marquee-wrap">
          <div className="animate-editorial-marquee gap-6 px-3">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                onClick={() => onEnterAuth('login')}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEnterAuth('login');
                  }
                }}
                className={`group relative w-[240px] sm:w-[290px] lg:w-[320px] aspect-[5/7] shrink-0 overflow-hidden border border-black/10 bg-[#F5F5F5] cursor-pointer ${item.radiusClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-editorial"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-editorial pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/75 via-black/30 to-transparent text-[#FFFFFF]">
                  <div className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/80">
                    {item.meta}
                  </div>
                  <div className="text-[18px] font-bold tracking-[-0.02em] mt-1">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. CENTERED INTRODUCTORY STATEMENT
          ===================================================================== */}
      <section id="statement" className="px-6 lg:px-24 py-24 sm:py-32 border-t border-black/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252]">
            01 · Platform Discipline
          </div>
          <h2 className="text-[32px] sm:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] text-[#000000]">
            Built strictly for college students to turn real code, internships, and certificates into verifiable standing.
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#525252] max-w-2xl mx-auto leading-[1.5] tracking-[-0.02em]">
            Exclusively accessible via @medicaps.ac.in accounts. Over 100 student profiles, 11 active hackathons, and a 100-point ranking formula open to every branch.
          </p>
        </div>
      </section>

      {/* =====================================================================
          5. TWO-COLUMN PROJECT GRID (4:3, 10% overlay, arrow-up-right, mono row)
          ===================================================================== */}
      <section id="projects" className="px-6 lg:px-24 pb-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-12 border-b border-black/10">
            <div>
              <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252]">
                02 · Selected Campus Work
              </div>
              <h2 className="text-[32px] sm:text-[42px] font-bold tracking-[-0.04em] leading-[1.0] text-[#000000] mt-2">
                Featured Projects &amp; Sprints
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onEnterAuth('login')}
              className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#000000] hover:text-[#525252] transition-colors duration-500 ease-editorial self-start sm:self-auto cursor-pointer"
            >
              Open Full Directory &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {SHOWCASE_PROJECTS.map(project => (
              <article
                key={project.id}
                onClick={() => onEnterAuth('login')}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEnterAuth('login');
                  }
                }}
                className="group cursor-pointer focus:outline-none"
              >
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-black/10 bg-[#F5F5F5]">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-editorial"
                  />

                  {/* Hover overlay: black at 10% opacity */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-editorial" />

                  {/* Top-right ArrowUpRight appearing on hover */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFFFFF] border border-black/10 flex items-center justify-center text-[#000000] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-editorial">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom metadata row separated by 1px #000000/10 border-top */}
                <div className="border-t border-black/10 pt-4 mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="text-[24px] font-bold tracking-[-0.03em] text-[#000000]">
                    {project.title}
                  </h3>
                  <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252] shrink-0">
                    {project.category} · {project.year}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FOOTER (#0A0A0A dark, #FFFFFF text, 4-column desktop grid)
          ===================================================================== */}
      <footer className="bg-[#0A0A0A] text-[#FFFFFF] px-6 lg:px-24 pt-20 pb-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Columns 1–2: Large brand name and short bio */}
            <div className="md:col-span-2 space-y-4">
              <div className="text-[36px] sm:text-[48px] font-bold tracking-[-0.05em] leading-[0.9] lowercase">
                mediconnect
              </div>
              <p className="text-[16px] text-[#A3A3A3] max-w-md leading-[1.5] tracking-[-0.02em]">
                An editorial student showcase, project archive, and transparent campus leaderboard built exclusively for Medi-Caps University engineers.
              </p>
            </div>

            {/* Column 3: Socials */}
            <div className="space-y-4">
              <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#737373]">
                Socials
              </div>
              <ul className="space-y-2.5 text-[16px]">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#A3A3A3] transition-colors duration-500 ease-editorial"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#A3A3A3] transition-colors duration-500 ease-editorial"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onEnterAuth('login')}
                    className="hover:text-[#A3A3A3] transition-colors duration-500 ease-editorial cursor-pointer"
                  >
                    Campus Community
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-4">
              <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#737373]">
                Contact
              </div>
              <ul className="space-y-2.5 text-[16px]">
                <li>
                  <button
                    type="button"
                    onClick={() => onEnterAuth('login')}
                    className="hover:text-[#A3A3A3] transition-colors duration-500 ease-editorial cursor-pointer text-left"
                  >
                    Student Sign In
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onEnterAuth('register')}
                    className="hover:text-[#A3A3A3] transition-colors duration-500 ease-editorial cursor-pointer text-left"
                  >
                    Register @medicaps.ac.in
                  </button>
                </li>
                <li className="text-[#A3A3A3]">Indore, Madhya Pradesh</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar: Thin border-top white/10 with copyright and credits in 14px */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[14px] text-[#A3A3A3]">
            <div>© 2026 MediConnect. All rights reserved.</div>
            <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#737373]">
              Medi-Caps University Campus Network
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
