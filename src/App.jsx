import { useState, useEffect, useRef } from "react";
import "./App.css";

const EXPERIENCE = [
  {
    company: "Techwens Software Pvt. Ltd.",
    role: "Frontend Developer",
    date: "Aug 2024 – Present",
    duration: "~1.5 yr",
    type: "Full-time",
    active: true,
    desc: "Working on the core product suite — a construction project management SaaS used by 200+ enterprise clients across India and the Middle East.",
    bullets: [
      "Built and maintained 15+ reusable React components used across 4 product modules, reducing dev time by ~30%.",
      "Revamped the dashboard UI with Recharts, enabling real-time data visualization for project cost & progress tracking.",
      "Collaborated with the design team to migrate legacy CSS to Tailwind CSS, cutting stylesheet size by 60%.",
      "Integrated REST APIs for user authentication, file uploads, and notifications using Axios and custom React hooks.",
    ],
    techs: ["React", "TypeScript", "Tailwind CSS", "Redux", "Recharts", "REST APIs", "Git"],
  },
  // {
  //   company: "Webify Studio",
  //   role: "Frontend Developer Intern",
  //   date: "Jan 2023 – Jul 2023",
  //   duration: "7 mos",
  //   type: "Internship",
  //   active: false,
  //   desc: "Joined as the first frontend intern at a boutique digital agency building marketing websites and landing pages for D2C brands.",
  //   bullets: [
  //     "Developed 8 responsive landing pages from Figma designs, achieving 95+ Lighthouse scores on mobile.",
  //     "Implemented scroll animations using Intersection Observer API, improving user engagement by 22%.",
  //     "Set up a shared component library with Storybook, adopted by the full dev team of 6.",
  //     "Fixed 40+ cross-browser compatibility bugs across Safari, Firefox, and Edge.",
  //   ],
  //   techs: ["React", "JavaScript", "SCSS", "Storybook", "Figma", "Webpack"],
  // },
];

const SKILLS = {
  "Core Stack": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  "Styling": ["Tailwind CSS", "Styled Components", "SCSS", "Framer Motion", "Figma"],
  "Tools & More": ["Git", "Vite", "REST APIs", "Redux", "Webpack", "Jest"],
};

const SKILL_BARS = [
  { name: "React / JSX", level: 85 },
  { name: "CSS / Tailwind", level: 90 },
  { name: "TypeScript", level: 72 },
  { name: "Git & Workflow", level: 80 },
];

const PROJECTS = [
  {
    name: "TaskFlow Dashboard",
    desc: "A productivity dashboard with drag-and-drop kanban boards, real-time updates, and dark mode support. Built with React and Redux.",
    tags: ["React", "Redux", "DnD", "SCSS"],
  },
  {
    name: "WeatherSphere",
    desc: "A beautiful weather app with animated weather conditions, geolocation, and 7-day forecasts using OpenWeather API.",
    tags: ["React", "REST API", "CSS Animations"],
  },
  {
    name: "DevBlog Platform",
    desc: "A personal blogging platform with markdown support, syntax highlighting, and an admin panel. Fully responsive.",
    tags: ["React", "Markdown", "TypeScript"],
  },
  {
    name: "E-Commerce UI Kit",
    desc: "A reusable component library with 30+ components built with TypeScript, documented with Storybook.",
    tags: ["TypeScript", "Storybook", "Tailwind"],
  },
];

const MARQUEE_ITEMS = [
  "React", "TypeScript", "CSS", "Tailwind", "Figma", "Git",
  "UI/UX", "Frontend Dev", "JavaScript", "Redux", "REST APIs",
  "React", "TypeScript", "CSS", "Tailwind", "Figma", "Git",
  "UI/UX", "Frontend Dev", "JavaScript", "Redux", "REST APIs",
];

function useTypingEffect(words, speed = 100, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [barsVisible, setBarsVisible] = useState(false);
  const skillRef = useRef(null);
  const ringRef = useRef({ x: -100, y: -100 });

  const typed = useTypingEffect(["Frontend Developer", "UI Craftsperson", "React Enthusiast", "Code & Design"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const dx = e.clientX - ringRef.current.x;
      const dy = e.clientY - ringRef.current.y;
      ringRef.current = {
        x: ringRef.current.x + dx * 0.1,
        y: ringRef.current.y + dy * 0.1,
      };
      setRingPos({ ...ringRef.current });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Smooth ring follow
  useEffect(() => {
    let raf;
    const tick = () => {
      setRingPos(prev => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return prev;
        return { x: prev.x + dx * 0.12, y: prev.y + dy * 0.12 };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cursorPos]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarsVisible(true); },
      { threshold: 0.3 }
    );
    if (skillRef.current) obs.observe(skillRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Custom cursors */}
      <div className="cursor" style={{ left: cursorPos.x - 6, top: cursorPos.y - 6 }} />
      <div className="cursor-ring" style={{ left: ringPos.x - 18, top: ringPos.y - 18 }} />

      <div className="noise">
        {/* NAV */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">GS<span style={{ color: "#6b6760" }}>.</span></div>
          <ul className="nav-links">
            {["About", "Skills", "Experience", "Projects", "Contact"].map(l => (
              <li key={l}>
                <a className="nav-link" href={`#${l.toLowerCase()}`}>{l}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-grid-line" />

          <div className="hero-left">
            <div className="hero-eyebrow fade-up">Portfolio · 2026</div>
            <h1 className="hero-name fade-up delay-1">
              <span className="glitch" data-text="GOBINDA">GOBINDA</span><br />
              <span className="accent">SAHA</span>
            </h1>
            <p className="hero-title fade-up delay-2">
              Building delightful, performant web experiences with{" "}
              <strong style={{ color: "#e8e4d9" }}>
                {typed}
                <span style={{ animation: "blink 1s step-end infinite", color: "#c6f135" }}>|</span>
              </strong>
            </p>
            <a href="#projects" className="hero-cta fade-up delay-3">
              View My Work <span>→</span>
            </a>
          </div>

          <div className="hero-right">
            <div className="hero-badge fade-up delay-2">
              <div className="hero-badge-inner">
                Open to<br />Work
              </div>
              <div className="hero-badge-ring" />
            </div>
            <div style={{ display: "flex", gap: "40px" }}>
              <div className="hero-stat fade-up delay-3">
                <div className="hero-stat-num">1<span className="accent">.5</span></div>
                <div className="hero-stat-label">Years Exp.</div>
              </div>
              <div className="hero-stat fade-up delay-4">
                <div className="hero-stat-num">12<span className="accent">+</span></div>
                <div className="hero-stat-label">Projects</div>
              </div>
              <div className="hero-stat fade-up delay-5">
                <div className="hero-stat-num">8<span className="accent">+</span></div>
                <div className="hero-stat-label">Technologies</div>
              </div>
            </div>
          </div>

          <div className="hero-scroll">
            <div className="hero-scroll-line" />
            <span>scroll</span>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {MARQUEE_ITEMS.map((item, i) => (
              <span className="marquee-item" key={i}>
                <span className="marquee-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="section-label" data-num="01">About Me</div>
          <h2 className="section-title">
            Crafting pixels<br />
            <span style={{ color: "var(--muted)", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>
              with purpose
            </span>
          </h2>
          <div className="about-grid">
            <div>
              <p className="about-text">
                Hey! I'm <strong>Gobinda</strong>, a frontend developer based in Kolkata 🇮🇳
                with <strong>1.5 years</strong> of hands-on experience building responsive,
                accessible, and performant web applications.
              </p>
              <p className="about-text" style={{ marginTop: 20 }}>
                I specialize in <strong>React</strong> and the modern JavaScript ecosystem.
                I care deeply about <strong>UI/UX details</strong> — the subtle animations,
                the pixel-perfect layouts, the interactions that feel just right.
              </p>
              <p className="about-text" style={{ marginTop: 20 }}>
                When I'm not coding, I'm probably on Dribbble getting inspired,
                or trying to perfect my pour-over coffee technique.
              </p>
            </div>
            <div className="about-cards">
              {[
                ["Location", "Kolkata, India"],
                ["Experience", "1.5 Years"],
                ["Availability", "Immediate"],
                ["Work Mode", "Remote / Hybrid / Office"],
                ["Education", "B.Tech CSE · 2023"],
              ].map(([label, value]) => (
                <div className="about-card" key={label}>
                  <span className="about-card-label">{label}</span>
                  <span className="about-card-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="section skills-section" id="skills" ref={skillRef}>
          <div className="section-label" data-num="02">Skills</div>
          <h2 className="section-title">My Toolkit</h2>

          <div className="skills-grid">
            {Object.entries(SKILLS).map(([group, tags]) => (
              <div className="skill-group" key={group}>
                <div className="skill-group-title">{group}</div>
                <div>{tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, maxWidth: 480 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent)", marginBottom: 24 }}>
              Proficiency
            </div>
            {SKILL_BARS.map(({ name, level }) => (
              <div className="skill-bar-row" key={name}>
                <div className="skill-bar-label">
                  <span>{name}</span>
                  <span style={{ color: "var(--accent)" }}>{level}%</span>
                </div>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{ width: barsVisible ? `${level}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section exp-section" id="experience">
          <div className="section-label" data-num="03">Experience</div>
          <h2 className="section-title">
            Where I've<br />
            <span style={{ color: "var(--accent)", fontFamily: "Bebas Neue, sans-serif", letterSpacing: 2 }}>
              Worked
            </span>
          </h2>

          <div className="exp-timeline">
            {EXPERIENCE.map((exp) => (
              <div className={`exp-item ${exp.active ? "active" : ""}`} key={exp.company}>
                <div className="exp-meta">
                  <div className="exp-date">{exp.date}</div>
                  <div className="exp-company">{exp.company}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{exp.duration}</div>
                  <div className="exp-type">{exp.type}</div>
                  {exp.active && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "var(--accent)", display: "inline-block",
                        animation: "pulse 2s ease-in-out infinite"
                      }} />
                      <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)" }}>
                        Current
                      </span>
                    </div>
                  )}
                </div>
                <div className="exp-body">
                  <div className="exp-role">{exp.role}</div>
                  <p className="exp-desc">{exp.desc}</p>
                  <ul className="exp-bullets">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div className="exp-techs">
                    {exp.techs.map(t => <span className="exp-tech" key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section" id="projects">
          <div className="section-label" data-num="04">Projects</div>
          <h2 className="section-title">
            Selected<br />
            <span style={{ color: "var(--accent)", fontFamily: "Bebas Neue, sans-serif", letterSpacing: 2 }}>
              Work
            </span>
          </h2>

          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <a className="project-card" href="#" key={p.name}>
                <div className="project-num">0{i + 1}</div>
                <div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-tags">
                    {p.tags.map(t => <span className="project-tag" key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="project-arrow">↗</div>
              </a>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="section-label" data-num="05">Contact</div>
          <div style={{ maxWidth: 700 }}>
            <div className="contact-big">
              LET'S<br />
              <span className="outline">BUILD</span><br />
              TOGETHER
            </div>
            <p style={{ marginTop: 32, fontSize: 14, color: "var(--muted)", lineHeight: 1.8, maxWidth: 420 }}>
              I'm currently open to new opportunities — whether that's a full-time role,
              a freelance project, or just a good conversation about frontend.
            </p>
            <div className="contact-links">
              <a className="contact-link primary" href="mailto:gobindasahaofficial@gmail.com">
                ✉ gobindasahaofficial@gmail.com
              </a>
              <a className="contact-link" href="#">
                LinkedIn ↗
              </a>
              <a className="contact-link" href="#">
                GitHub ↗
              </a>
              <a className="contact-link" href="#">
                Resume ↗
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-copy">© 2026 Gobinda Saha · All rights reserved</div>
          <div className="footer-made">
            Designed & built with <span>♥</span> in Bangalore
          </div>
        </footer>
      </div>
    </>
  );
}