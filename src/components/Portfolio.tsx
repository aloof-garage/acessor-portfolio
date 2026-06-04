"use client";

import { useState, useEffect } from "react";

const LOCALE = {
  RU: {
    title: "Привет, я - Acessor",
    bio: "Программист C#, C/C++, Java и тд. Реверсер (обратный разработчик) и взломщик ПО. Моддер игр, создатель чит-клиентов и низкоуровнего ПО. Хакер и специалист по ИБ. Дизайнер.",
    skills:
      "- Знание языков: Русский, Английский. Базовое понимание: Французский, Белорусский<br/><br/>                    - Подробные знания об устройстве ЭВМ, умение работать с Windows, Linux, Android и знание их особенностей<br/><br/>                    - Умение работать с ЯП C#, C/C++, Java. При необходимости с JS, Python и любыми другими<br/><br/>                    - Более 4-х лет разработки ПО<br/><br/>                    - Познания в реверсе (обратной разработке), криптографии и взломе ПО<br/><br/>                    - Умение качественно обрабатывать фото и видео материалы, разрабатывать дизайн и монтировать",
    about: "Обо мне",
    more: "Больше ресурсов",
    todo: "// TODO добавить статьи",
    projects: "Проекты",
    contacts: "Контакты",
  },
  EN: {
    title: "Hello, I'm Acessor",
    bio: "Software developer skilled in C#, C/C++, Java, and other programming languages. Reverse engineer and cracker, game modder and cheat creator, low-level coder. Hacker and cybersecurity specialist. Designer.",
    skills:
      "- Known languages: Russian, English. Basic understanding: French, Belarus.<br/><br/>                    - In-depth knowledge of computer architecture, ability to work with Windows, Linux, Android and familiarity with their specificities.<br/><br/>                    - Proficient in programming languages such as C#, C/C++, Java. Familiar with JS, Python, and other languages<br/><br/>                    - Over 4 years of software development experience.<br/><br/>                    - Knowledge of reverse engineering, cryptography, and software hacking.<br/><br/>                    - Skilled in photo and video editing, design.",
    about: "About me",
    more: "More resources",
    todo: "// TODO add articles",
    projects: "Projects",
    contacts: "Contacts",
  },
} as const;

type Lang = keyof typeof LOCALE;

interface Repo {
  html_url: string;
  name: string;
  description: string;
  stargazers_count: number;
  fork: boolean;
  topics: string[];
}

const STATIC_PROJECTS: Repo[] = [
  { html_url: "https://github.com/ac3ss0r/obfusheader.h", name: "obfusheader.h", description: "Obfusheader.h is a portable header file for C++14 compile-time obfuscation.", stargazers_count: 1007, fork: false, topics: ["cpp"] },
  { html_url: "https://github.com/ac3ss0r/DroidFrida", name: "DroidFrida", description: "Portable frida injector for rooted android devices.", stargazers_count: 210, fork: false, topics: ["android"] },
  { html_url: "https://github.com/ac3ss0r/ZMemory", name: "ZMemory", description: "a C++ library / template for patching process memory on unix systems (including android).", stargazers_count: 57, fork: false, topics: ["cpp"] },
  { html_url: "https://github.com/ac3ss0r/frida-il2cpp-agent", name: "frida-il2cpp-agent", description: "Example of frida il2cpp bridge library usage", stargazers_count: 56, fork: false, topics: ["frida"] },
  { html_url: "https://github.com/ac3ss0r/Il2Cpp-Exploitation-POC", name: "Il2Cpp-Exploitation-POC", description: "Il2Cpp android unity game exploitation by patching assembly in runtime proof-of-concept.", stargazers_count: 50, fork: false, topics: ["cpp"] },
  { html_url: "https://github.com/ac3ss0r/cvm.h", name: "cvm.h", description: "CVM is a header-only turing-complete virtual machine engine made in pure C.", stargazers_count: 36, fork: false, topics: ["c"] },
  { html_url: "https://github.com/ac3ss0r/MCEEAuthBypass", name: "MCEEAuthBypass", description: "Minecraft education edition auth bypass for Windows 7/8/9 using pointerscanning.", stargazers_count: 29, fork: false, topics: ["windows"] },
  { html_url: "https://github.com/ac3ss0r/c2shell", name: "c2shell", description: "A C/C++ framework designed to simplify shellcode creation on any compilers and platforms using C. Supports Windows & Linux, and practically any existing architecture.", stargazers_count: 23, fork: false, topics: ["c"] },
  { html_url: "https://github.com/ac3ss0r/CryptoDeobfuscator", name: "CryptoDeobfuscator", description: "A basic semi-static deobfuscator for CryptoObfuscator 2020 enterprise. Resolves hidden calls & decrypts constants.", stargazers_count: 10, fork: false, topics: ["dotnet"] },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "EN";
  const lang = (navigator as Navigator & { userLanguage?: string }).language || (navigator as Navigator & { userLanguage?: string }).userLanguage || "";
  return /ru/i.test(lang) ? "RU" : "EN";
}

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("EN");
  const [titleText, setTitleText] = useState("Hello, I'm Acessor");
  const [repos, setRepos] = useState<Repo[]>(STATIC_PROJECTS);
  const [isTyping, setIsTyping] = useState(false);

  // Set lang from browser on mount
  useEffect(() => {
    const detected = getBrowserLang();
    setLang(detected);
  }, []);

  // Type title whenever lang changes
  useEffect(() => {
    const text = LOCALE[lang].title;
    document.title = text;

    let cancelled = false;
    setIsTyping(true);

    (async () => {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        if (i < text.length) {
          setTitleText(text.substring(0, i) + "|");
          await sleep(100);
          if (cancelled) return;
          setTitleText(text.substring(0, i));
        } else {
          setTitleText(text);
        }
        await sleep(100);
      }
      setIsTyping(false);
    })();

    return () => { cancelled = true; };
  }, [lang]);

  // Fetch repos from GitHub (with localStorage cache)
  useEffect(() => {
    const STORAGE_KEY = "STORAGE";
    const TIME_KEY = "LAST_UPDATE";
    const CACHE_MS = 1000 * 60 * 25;

    async function fetchRepositories(): Promise<Repo[] | null> {
      try {
        const resp = await fetch("https://api.github.com/users/ac3ss0r/repos");
        const repos: Repo[] = await resp.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repos));
        localStorage.setItem(TIME_KEY, Date.now().toString());
        return repos;
      } catch {
        return null;
      }
    }

    function displayRepositories(repos: Repo[] | null) {
      if (!repos) return;
      const sorted = repos
        .filter((r) => !r.fork && r.description && r.description.length > 0 && r.topics && r.topics.length > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
      if (sorted.length > 0) setRepos(sorted);
    }

    async function updateRepositories() {
      const lastFetch = localStorage.getItem(TIME_KEY);
      const now = Date.now();
      if (!lastFetch || now - parseInt(lastFetch) >= CACHE_MS) {
        const reps = await fetchRepositories();
        displayRepositories(reps);
      } else {
        try {
          const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
          displayRepositories(cached);
        } catch {
          // keep static fallback
        }
      }
    }

    updateRepositories();
  }, []);

  function handleLangClick() {
    const langs = Object.keys(LOCALE) as Lang[];
    const next = langs[(langs.indexOf(lang) + 1) % langs.length];
    setLang(next);
    try {
      const beep = new Audio("/beep.mp3");
      beep.play().catch(() => {});
    } catch {}
  }

  const t = LOCALE[lang];

  return (
    <>
      <div className="retro_screen_glowing"></div>
      <div className="retro_console_effect"></div>
      <div className="retro_screen_border"></div>

      <div className="screen_content">
        <text className="console_corner" id="langs" onClick={handleLangClick} style={{ cursor: "pointer" }}>
          [<text
            id="RU"
            className="lang"
            style={{ color: lang === "RU" ? "rgb(0, 238, 32)" : "inherit" }}
          >RU</text> / <text
            id="EN"
            className="lang"
            style={{ color: lang === "EN" ? "rgb(0, 238, 32)" : "inherit" }}
          >EN</text>]
        </text>
        <br />
        <div className="console_content">
          <h1 id="title">{titleText}</h1>
          <br />
          <h3 id="bio" dangerouslySetInnerHTML={{ __html: t.bio }} />
          <br />
          <div className="border"></div>
          <br />
          <div className="section_block">
            <div className="side_block">
              <h3 id="about">{t.about}</h3>
              <br />
              <h5 id="skills" dangerouslySetInnerHTML={{ __html: t.skills }} />
            </div>
            <div className="side_block">
              <h3 id="contacts">{t.contacts}</h3>
              <a href="https://github.com/ac3ss0r">
                <div className="about_entry">
                  <h3>GitHub</h3>
                </div>
              </a>
              <a href="https://t.me/ac3ss0r">
                <div className="about_entry">
                  <h3>Telegram</h3>
                </div>
              </a>
              <a href="https://discord.gg/bBPs6PGWkK">
                <div className="about_entry">
                  <h3>Discord</h3>
                </div>
              </a>
            </div>
          </div>
          <br />
          <div className="border"></div>
          <br />

          <div id="projects_container" className="section_block">
            <h3 id="projects">{t.projects}</h3>
            {repos.map((repo) => (
              <a key={repo.name} href={repo.html_url}>
                <div className="about_entry">
                  <h3>{repo.name} {repo.stargazers_count}★</h3>
                  <h5>{repo.description}</h5>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}