document.addEventListener("DOMContentLoaded", () => {
  const chapters = [...document.querySelectorAll("section.chapter")];
  const langControl = document.getElementById("lang");
  const themeControl = document.getElementById("theme");
  const accentControl = document.getElementById("accent");
  const get = (k, fallback) => { try { return localStorage.getItem(k) || fallback; } catch(e) { return fallback; } };
  const put = (k, value) => { try { localStorage.setItem(k,value); } catch(e) {} };
  const choose = (v, allowed, fallback) => allowed.includes(v) ? v : fallback;
  function setLanguage(value) {
    const lang=choose(value,["hu","en"],"hu");
    document.documentElement.lang=lang;
    document.querySelectorAll(".hu,.en").forEach(el => { el.hidden=!el.classList.contains(lang); });
    langControl.value=lang;
    put("q-lang",lang);
  }
  function setTheme(value) {
    const theme=choose(value,["dark","light"],"dark");
    document.body.classList.toggle("light",theme==="light");
    themeControl.value=theme;put("q-theme",theme);
  }
  function setAccent(value) {
    const accent=choose(value,["blue","teal","violet"],"blue");
    document.body.classList.remove("accent-blue","accent-teal","accent-violet");
    document.body.classList.add("accent-"+accent);
    accentControl.value=accent;put("q-accent",accent);
  }
  function expand(chapter, open, scroll=false) {
    const preview=chapter.querySelector(".chapter-preview");
    const detail=chapter.querySelector(".chapter-details");
    const button=chapter.querySelector(".open-btn");
    if(!preview || !detail || !button) return;
    preview.hidden=open;
    detail.hidden=!open;
    button.setAttribute("aria-expanded",String(open));
    if(scroll) chapter.scrollIntoView({behavior:"smooth",block:"start"});
  }
  chapters.forEach(chapter => {
    expand(chapter,false);
    chapter.querySelector(".open-btn")?.addEventListener("click",()=>expand(chapter,true));
    chapter.querySelector(".close-btn")?.addEventListener("click",()=>expand(chapter,false,true));
  });
  document.getElementById("openAll")?.addEventListener("click",()=>chapters.forEach(c=>expand(c,true)));
  document.getElementById("closeAll")?.addEventListener("click",()=>chapters.forEach(c=>expand(c,false)));
  document.querySelectorAll('nav a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{
    const target=document.getElementById(a.getAttribute("href").slice(1));
    if(target?.classList.contains("chapter")) expand(target,true);
  }));
  langControl.addEventListener("change",()=>setLanguage(langControl.value));
  themeControl.addEventListener("change",()=>setTheme(themeControl.value));
  accentControl.addEventListener("change",()=>setAccent(accentControl.value));
  setTheme(get("q-theme","dark"));
  setAccent(get("q-accent","blue"));
  setLanguage(get("q-lang","hu"));
});
