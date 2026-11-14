document.documentElement.classList.add("js");

/* ============ À REMPLIR PAR VOUS ============ */
const CONFIG = {
  email:     "krkonlineenglishcenter@gmail.com",   // ex. "krkservices@gmail.com"  (laisser vide = non affiché)
  whatsapp:  "2290165857916",   // indicatif + numéro, sans + ni espaces, ex. "2290165857916"
  linkedin:  "",   // adresse complète de votre profil, ex. "https://www.linkedin.com/in/votre-nom"
  formspree: "mwloelnw",   // identifiant Formspree du formulaire, ex. "abcdwxyz" (la fin du lien https://formspree.io/f/...)
  centreUrl: "https://krkonlineenglishcenter.github.io/"    // adresse du site du centre, ex. "https://votrenom.github.io"
};

/* ============ Langue : FR / EN ============ */
const TEXTES = {
  fr: {
    title: "KRK.SERVICES – Designer de sites web",
    ok:  "Merci ! Votre demande est envoyée. Je vous réponds rapidement.",
    err: "L'envoi n'a pas marché. Écrivez-moi directement par email ou WhatsApp.",
    wait: "Envoi en cours…"
  },
  en: {
    title: "KRK.SERVICES – Website Designer",
    ok:  "Thank you! Your request has been sent. I will reply shortly.",
    err: "Sending failed. Please write to me directly by email or WhatsApp.",
    wait: "Sending…"
  }
};

function choisirLangue() {
  const param = new URLSearchParams(location.search).get("lang");   // ex. ?lang=en
  if (param === "fr" || param === "en") return param;
  try {
    const gardee = localStorage.getItem("krk-lang");
    if (gardee === "fr" || gardee === "en") return gardee;
  } catch (e) {}
  return (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
}

let langue = choisirLangue();

function appliquerLangue(l) {
  langue = l;
  document.documentElement.lang = l;
  document.title = TEXTES[l].title;
  document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
  try { localStorage.setItem("krk-lang", l); } catch (e) {}
}
document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => appliquerLangue(b.dataset.lang)));
appliquerLangue(langue);

/* ============ Coordonnées ============ */
function afficher(id, href, texte) {
  const li = document.getElementById(id);
  if (!li || !texte) return;
  const a = li.querySelector("a");
  a.href = href; a.textContent = texte; li.hidden = false;
}
afficher("c-email", "mailto:" + CONFIG.email, CONFIG.email);
if (CONFIG.whatsapp) afficher("c-wa", "https://wa.me/" + CONFIG.whatsapp, "+" + CONFIG.whatsapp);
if (CONFIG.linkedin) afficher("c-in", CONFIG.linkedin, "LinkedIn");

const lienCentre = document.getElementById("centre-link");
if (lienCentre && CONFIG.centreUrl) { lienCentre.href = CONFIG.centreUrl; lienCentre.hidden = false; }

document.getElementById("year").textContent = new Date().getFullYear();

/* ============ Apparition douce ============ */
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
} else {
  items.forEach(i => i.classList.add("in"));
}

/* ============ Formulaire de contact (Formspree) ============ */
const form = document.getElementById("contact-form");
const msg = document.getElementById("form-message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!CONFIG.formspree) { msg.textContent = TEXTES[langue].err; return; }
  msg.textContent = TEXTES[langue].wait;
  try {
    const rep = await fetch("https://formspree.io/f/" + CONFIG.formspree, {
      method: "POST", body: new FormData(form), headers: { Accept: "application/json" }
    });
    if (rep.ok) { form.reset(); msg.textContent = TEXTES[langue].ok; }
    else { msg.textContent = TEXTES[langue].err; }
  } catch (err) { msg.textContent = TEXTES[langue].err; }
});
