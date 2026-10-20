document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const chapters = [...document.querySelectorAll("section.chapter")];
  const langSelect = $("lang"), themeSelect = $("theme"), accentSelect = $("accent");
  const valid = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let lang = valid(read("qfield-lang", "hu"), ["hu", "en"], "hu");
  let theme = valid(read("qfield-theme", "dark"), ["dark", "light"], "dark");
  let accent = valid(read("qfield-accent", "blue"), ["blue", "teal", "violet"], "blue");

  function setLanguage(next) {
    lang = valid(next, ["hu", "en"], "hu");
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    document.querySelectorAll(".hu, .en").forEach(el => {
      el.hidden = !el.classList.contains(lang);
    });
    document.querySelectorAll("[data-hu][data-en]").forEach(el => {
      el.textContent = el.dataset[lang];
    });
    // A címek magyar szövege külön szövegcsomópont: angol nézetben a CSS elrejti.
    if (langSelect) langSelect.value = lang;
    save("qfield-lang", lang);
  }

  function setTheme(next) {
    theme = valid(next, ["dark", "light"], "dark");
    document.body.classList.toggle("light", theme === "light");
    if (themeSelect) themeSelect.value = theme;
    save("qfield-theme", theme);
  }
  function setAccent(next) {
    accent = valid(next, ["blue", "teal", "violet"], "blue");
    document.body.classList.remove("accent-blue", "accent-teal", "accent-violet");
    document.body.classList.add("accent-" + accent);
    if (accentSelect) accentSelect.value = accent;
    save("qfield-accent", accent);
  }

  function expand(chapter, open, scrollToSummary = false) {
    const summary = chapter.querySelector(".chapter-preview");
    const details = chapter.querySelector(".chapter-details");
    const button = chapter.querySelector(".open-btn");
    if (!summary || !details || !button) return;
    summary.hidden = open;
    details.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (scrollToSummary) {
      chapter.scrollIntoView({ behavior: "smooth", block: "start" });
      button.focus({ preventScroll: true });
    }
  }

  chapters.forEach(chapter => {
    expand(chapter, false);
    chapter.querySelector(".open-btn")?.addEventListener("click", () => expand(chapter, true));
    chapter.querySelector(".close-btn")?.addEventListener("click", () => expand(chapter, false, true));
  });
  $("openAll")?.addEventListener("click", () => chapters.forEach(ch => expand(ch, true)));
  $("closeAll")?.addEventListener("click", () => chapters.forEach(ch => expand(ch, false)));
  langSelect?.addEventListener("change", () => setLanguage(langSelect.value));
  themeSelect?.addEventListener("change", () => setTheme(themeSelect.value));
  accentSelect?.addEventListener("change", () => setAccent(accentSelect.value));

  // A fejezetmenü a megfelelő szakaszhoz ugrik, és megnyitja annak teljes leírását.
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target?.classList.contains("chapter")) expand(target, true);
    });
  });
  setTheme(theme);
  setAccent(accent);
  setLanguage(lang);
});
