const categoryOrder = ["all", "public", "residential", "commercial", "planning", "international"];
const categoryLabels = {
  en: {all:"All projects", public:"Public buildings", residential:"Residential", commercial:"Commercial, offices & industry", planning:"Urban planning", international:"International"},
  he: {all:"כל הפרויקטים", public:"מבני ציבור", residential:"מגורים", commercial:"משרדים, מסחר ותעשייה", planning:"תכנון עירוני", international:"פרויקטים בחו״ל"}
};
const translations = {
  en: {
    navWork:"Projects",navAbout:"About",navContact:"Contact",eyebrow:"ARCHITECTURE · TOWN PLANNING · EST. 1990",
    heroTitle:"Thoughtful places.<br>Lasting impact.",heroIntro:"Selected work by Mark Segal & Dov Joffe, Architects & Town Planners.",explore:"Explore selected projects",selectedWork:"SELECTED WORK",
    portfolioEyebrow:"THE PORTFOLIO",workTitle:"Selected projects",workDesc:"A selection spanning public life, homes, commerce and city-making.",sourceNote:"Project imagery and titles adapted from the firm's portfolio presentation.",
    aboutEyebrow:"THE PRACTICE",aboutTitle:"Architecture and planning, across scales.",
    aboutText:"Founded in 1990, Mark Segal & Dov Joffe Architects & Town Planners designs public buildings, schools, cultural and sports facilities, senior-living environments, residential buildings and neighborhoods, commercial and industrial projects, and urban-planning programs. The firm also supports projects abroad, particularly in Romania.",
    expertise1:"Public buildings",expertise2:"Residential",expertise3:"Commercial & industry",expertise4:"Urban planning",expertise5:"International projects",
    contactEyebrow:"START A CONVERSATION",contactTitle:"Let's talk about<br>your next project.",phone:"Phone",office:"Office",address:"Address",footerNote:"Architects & Town Planners",backTop:"Back to top ↑",projectCount:(n)=>`${n} projects`},
  he: {
    navWork:"פרויקטים",navAbout:"אודות",navContact:"יצירת קשר",eyebrow:"אדריכלות · תכנון ערים · נוסד ב-1990",
    heroTitle:"מתכננים מקומות.<br>משפיעים לאורך זמן.",heroIntro:"מבחר פרויקטים של מרק סגל ודב יפה, אדריכלים ומתכנני ערים.",explore:"לצפייה בפרויקטים",selectedWork:"פרויקטים נבחרים",
    portfolioEyebrow:"הפורטפוליו",workTitle:"פרויקטים נבחרים",workDesc:"מבחר פרויקטים במבני ציבור, מגורים, מסחר ותכנון עירוני.",sourceNote:"התמונות ושמות הפרויקטים עובדו מתוך מצגת הפורטפוליו של המשרד.",
    aboutEyebrow:"המשרד",aboutTitle:"אדריכלות ותכנון, במגוון קני מידה.",
    aboutText:"משרד ״מרק סגל – דב יפה, אדריכלים ומתכנני ערים״ נוסד בשנת 1990. המשרד עוסק בתכנון מבני ציבור, מוסדות חינוך ותרבות, מתקני ספורט, מבנים לגיל הזהב, שכונות ובנייני מגורים, פרויקטים של התחדשות עירונית, משרדים, מסחר ותעשייה, תכנון ערים וקידום תב״עות. פעילות המשרד כוללת גם תכנון וליווי פרויקטים בחו״ל, בעיקר ברומניה.",
    expertise1:"מבני ציבור",expertise2:"מגורים",expertise3:"מסחר ותעשייה",expertise4:"תכנון עירוני",expertise5:"פרויקטים בחו״ל",
    contactEyebrow:"נשמח לשוחח",contactTitle:"נדבר על<br>הפרויקט הבא שלכם.",phone:"טלפון נייד",office:"משרד",address:"כתובת",footerNote:"אדריכלים ומתכנני ערים",backTop:"חזרה לראש העמוד ↑",projectCount:(n)=>`${n} פרויקטים`}
};
let projects = [];
let currentCategory = "all";
let lang = "en";
const $ = (s) => document.querySelector(s);
const grid = $("#projectGrid");
const filters = $("#filters");
const dialog = $("#projectDialog");
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderFilters(){
  filters.innerHTML = categoryOrder.map(cat => `<button type="button" class="filter-btn ${cat===currentCategory?'active':''}" data-category="${cat}">${esc(categoryLabels[lang][cat])}</button>`).join("");
  filters.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {currentCategory=btn.dataset.category;renderFilters();renderProjects();}));
}
function renderProjects(){
  const list = projects.filter(p => currentCategory === "all" || p.category === currentCategory);
  $("#projectCount").textContent = translations[lang].projectCount(list.length);
  grid.innerHTML = list.map((p, i) => `<article class="project-card" tabindex="0" role="button" aria-label="Open ${esc(p.title)}" data-id="${p.id}">
    <div class="project-media"><img loading="lazy" src="${esc(p.cover)}" alt="${esc(p.title)}"><span class="project-number">${String(i+1).padStart(2,'0')}</span></div>
    <div class="project-info"><div><h3>${esc(p.title)}</h3><span class="project-open" aria-hidden="true">↗</span></div><span class="project-category">${esc(categoryLabels[lang][p.category])}</span></div>
  </article>`).join("");
  grid.querySelectorAll(".project-card").forEach(card => {
    const open=()=>showProject(projects.find(p=>p.id===card.dataset.id));
    card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}
function showProject(p){
  if(!p)return;
  $("#dialogTitle").textContent=p.title;
  $("#dialogCategory").textContent=categoryLabels[lang][p.category];
  $("#dialogSlide").textContent=`PORTFOLIO · ${String(p.firstSlide).padStart(2,'0')}`;
  const images=(p.images&&p.images.length?p.images:[p.cover]).slice(0,12);
  $("#dialogGallery").innerHTML=images.map((src,i)=>`<img src="${esc(src)}" alt="${esc(p.title)}${images.length>1?' — view '+(i+1):''}" loading="lazy">`).join("");
  if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open','');
}
function applyLanguage(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;const v=translations[lang][key];if(typeof v==='string')el.innerHTML=v;});
  $("#aboutText").textContent=translations[lang].aboutText;
  $("#languageToggle").textContent=lang==='en'?'עב':'EN';
  $("#languageToggle").setAttribute('aria-label',lang==='en'?'Switch to Hebrew':'Switch to English');
  renderFilters();renderProjects();
}
$(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
$("#languageToggle").addEventListener("click",()=>{lang=lang==='en'?'he':'en';applyLanguage();});
$("#year").textContent=new Date().getFullYear();
fetch('assets/projects.json').then(r=>{if(!r.ok)throw new Error('Could not load projects data');return r.json();}).then(data=>{
  projects=data;
  const hero=projects.find(p=>p.category==='public')||projects[0];
  if(hero){$("#heroImage").src=hero.cover;$("#heroImage").alt=hero.title;$("#heroCaption").textContent=hero.title;}
  applyLanguage();
}).catch(err=>{grid.innerHTML='<p class="empty-state">Project data could not load. Run this folder through a local web server (see README.md).</p>';console.error(err);});
