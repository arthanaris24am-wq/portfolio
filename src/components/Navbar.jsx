import { useState, useEffect } from 'react';
import { personalData } from '../data/content';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'PROFILES', href: '#profiles' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage (0 - 100%)
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
      setIsScrolled(currentScroll > 40);

      // Determine active section via viewport position
      const sections = ['hero', 'about', 'skills', 'projects', 'profiles', 'journey', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-3.5 shadow-2xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="group flex items-center gap-2 text-white font-display text-lg tracking-widest uppercase font-bold focus:outline-none"
            aria-label="Back to top"
          >
            <span>{personalData.shortName}</span>
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_#ff5a1f]" />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#101015]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-mono tracking-wider transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-white/10 rounded-full border border-white/10 -z-10 shadow-[0_0_12px_rgba(255,255,255,0.05)]" />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Button: Resume */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={personalData.resumeUrl}
              download="Arthanari_S_Resume.pdf"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#ff5a1f]/60 hover:bg-[#ff5a1f]/5 transition-all duration-300"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#ff5a1f]" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff5a1f] to-[#ff8c42] transition-all duration-100 ease-out shadow-[0_0_8px_#ff5a1f]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#050505]/95 backdrop-blur-xl md:hidden pt-28 px-8 flex flex-col justify-between pb-12 animate-in fade-in duration-200">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              Navigation
            </span>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-2xl font-display font-bold text-neutral-200 hover:text-[#ff5a1f] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono text-neutral-600">→</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href={personalData.resumeUrl}
              download="Arthanari_S_Resume.pdf"
              className="w-full text-center py-3 rounded-xl bg-[#ff5a1f] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-[0_0_20px_rgba(255,90,31,0.3)]"
            >
              Download Resume (PDF)
            </a>
            <span className="text-center text-xs font-mono text-neutral-500">
              {personalData.location}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

