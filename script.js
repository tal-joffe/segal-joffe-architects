const categoryOrder = ["all", "public", "residential", "commercial", "planning", "international"];
let projects = [];
let content;
let currentCategory = "all";
let lang = location.pathname.startsWith("/en/") ? "en" : "he";
const assetUrl = (path) => `${lang === "en" ? "../" : ""}${path}`;
const $ = (s) => document.querySelector(s);
const grid = $("#projectGrid");
const filters = $("#filters");
const dialog = $("#projectDialog");
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const copy = (path) => path.split(".").reduce((value, key) => value?.[key], path.startsWith("site.") ? content : content.languages[lang]);
function loadJson(path, errorMessage){
  return fetch(path).then(response => {
    if(!response.ok)throw new Error(errorMessage);
    return response.json();
  });
}
function renderFilters(){
  const categories=copy("portfolio.categories");
  filters.innerHTML = categoryOrder.map(cat => `<button type="button" class="filter-btn ${cat===currentCategory?'active':''}" data-category="${cat}">${esc(categories[cat])}</button>`).join("");
  filters.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {currentCategory=btn.dataset.category;renderFilters();renderProjects();}));
}
function renderProjects(){
  const list = projects.filter(p => currentCategory === "all" || p.category === currentCategory);
  const countTemplate=copy(list.length===1?"interface.projectCountOne":"interface.projectCountMany");
  $("#projectCount").textContent=countTemplate.replace("{count}",list.length);
  const categories=copy("portfolio.categories");
  grid.innerHTML = list.map((p, i) => `<article class="project-card" tabindex="0" role="button" aria-label="${esc(copy("interface.openProject"))}: ${esc(p.title)}" data-id="${esc(p.id)}">
    <div class="project-media"><img loading="lazy" src="${esc(assetUrl(p.cover))}" alt="${esc(p.title)}"></div>
    <div class="project-info"><div><h3>${esc(p.title)}</h3><span class="project-open" aria-hidden="true">↗</span></div><span class="project-category">${esc(categories[p.category])}</span></div>
  </article>`).join("");
  grid.querySelectorAll(".project-card").forEach(card => {
    const open=()=>showProject(projects.find(p=>p.id===card.dataset.id));
    card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}
function showProject(p){
  if(!p)return;
  $("#dialogTitle").textContent=p.title;
  $("#dialogCategory").textContent=copy(`portfolio.categories.${p.category}`);
  $("#dialogSlide").textContent=`${copy("interface.portfolioSlide")} · ${String(p.firstSlide).padStart(2,'0')}`;
  const images=(p.images&&p.images.length?p.images:[p.cover]).slice(0,12);
  $("#dialogGallery").innerHTML=images.map((src,i)=>`<img src="${esc(assetUrl(src))}" alt="${esc(p.title)}${images.length>1?' — view '+(i+1):''}" loading="lazy">`).join("");
  if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open','');
}
function applyLanguage(){
  const languageContent=content.languages[lang];
  document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';
  document.querySelectorAll("[data-copy]").forEach(el=>{el.textContent=copy(el.dataset.copy);});
  document.querySelectorAll("[data-copy-attr]").forEach(el=>{el.setAttribute("aria-label",copy(el.dataset.copyAttr));});
  document.querySelectorAll("[data-contact]").forEach(el=>{el.textContent=content.contactDetails[el.dataset.contact];});
  document.title=languageContent.seo.title;
  $("#pageDescription").content=languageContent.seo.description;
  $("#ogTitle").content=languageContent.seo.title;
  $("#ogDescription").content=languageContent.seo.description;
  $("#ogLocale").content=languageContent.seo.ogLocale;
  $("#heroImage").alt=languageContent.hero.imageAlt;
  const aboutClients=$("#aboutClients");
  aboutClients.textContent=languageContent.about.clients||"";
  aboutClients.hidden=!aboutClients.textContent;
  const aboutClientsTitle=$("#aboutClientsTitle");
  aboutClientsTitle.textContent=languageContent.about.clientsTitle||"";
  aboutClientsTitle.hidden=aboutClients.hidden;
  $("#expertiseList").replaceChildren(...languageContent.about.expertise.map(item=>{
    const tag=document.createElement("span");
    tag.textContent=item;
    return tag;
  }));
  $("#practiceYears").textContent=`${content.site.foundedYear} — ${new Date().getFullYear()}`;
  $("#contactEmail").href=`mailto:${content.contactDetails.email}`;
  $("#contactMobile").textContent=content.contactDetails.mobile;
  $("#contactMobile").href=`tel:${content.contactDetails.mobileLink}`;
  $("#contactOffice").textContent=content.contactDetails.office;
  $("#contactOffice").href=`tel:${content.contactDetails.officeLink}`;
  $("#languageToggle").textContent=languageContent.interface.languageButton;
  $("#languageToggle").setAttribute("aria-label",languageContent.interface.switchLanguage);
  renderFilters();renderProjects();
}
$(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
$("#languageToggle").addEventListener("click",()=>{location.href=lang==="he"?"/en/":"/";});
$("#year").textContent=new Date().getFullYear();
Promise.all([
  loadJson(assetUrl("assets/content.json"),"Could not load site content"),
  loadJson(assetUrl("assets/projects.json"),"Could not load projects data")
]).then(([siteContent, projectData])=>{
  content=siteContent;
  projects=projectData;
  const hero=projects.find(p=>p.category==='public')||projects[0];
  if(hero){$("#heroImage").src=assetUrl(hero.cover);$("#heroImage").alt=content.languages[lang].hero.imageAlt;$("#heroCaption").textContent=hero.title;}
  applyLanguage();
}).catch(err=>{
  grid.innerHTML=`<p class="empty-state">${esc(err.message)}. Run this folder through a local web server (see README.md).</p>`;
  console.error("Could not initialize the portfolio",err);
});
