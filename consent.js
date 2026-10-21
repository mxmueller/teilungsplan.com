/* Einwilligung (Cookie-Banner) und Google-Ads-Conversion-Tracking
   Der Google-Tag selbst steht im <head> jeder Seite (Consent Mode v2, Standard: abgelehnt).
   Hier wird nur die Einwilligung abgefragt, gespeichert und an Google übergeben. */
(() => {
  const LEAD = 'AW-18512644653/bWJBCNSMyJwdEK2UwvtE';
  const KEY = 'tp-consent';
  const MAX_AGE = 365 * 24 * 3600e3; // nach 12 Monaten erneut fragen

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return v && Date.now() - v.t < MAX_AGE ? v.c : null;
    } catch { return null; }
  };
  const save = c => { try { localStorage.setItem(KEY, JSON.stringify({ c, t: Date.now() })); } catch {} };

  const grant = () => gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
  const deny = () => {
    gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    // bereits gesetzte Google-Cookies entfernen
    document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^_gcl|^_gac|^_ga/.test(n)).forEach(n => {
      ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(d => {
        document.cookie = n + '=; Max-Age=0; path=/' + d;
      });
    });
  };

  // Conversion nur bei erfolgreicher Formularübermittlung. Ohne Einwilligung sendet Google
  // laut Consent Mode nur einen cookielosen, anonymisierten Treffer.
  window.tpLeadConversion = () => gtag('event', 'conversion', { send_to: LEAD });

  const css = `
  .cc{position:fixed;z-index:50;left:1rem;right:1rem;bottom:1rem;max-width:34rem;margin-left:auto;background:var(--white,#fff);color:var(--ink,#121417);border-radius:var(--r,4px);border-top:4px solid var(--ink,#121417);box-shadow:0 24px 60px -20px rgba(18,20,23,.45);padding:1.5rem;font-size:.95rem;line-height:1.5}
  .cc h2{font-size:1.2rem;letter-spacing:-.02em;line-height:1.2;margin:0 0 .5rem}
  .cc p{margin:0;color:var(--grey,#5d636b)}
  .cc a{color:var(--blue,#1f4fd1)}
  .cc .cc-btns{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:1.25rem}
  .cc .btn{justify-content:center;padding:.85rem 1rem}
  @media (prefers-reduced-motion:no-preference){.cc{animation:cc-in .4s cubic-bezier(.2,.7,.2,1)}@keyframes cc-in{from{opacity:0;transform:translateY(16px)}}}
  .cc-link{all:unset;cursor:pointer;color:#fff}
  .cc-link:hover{text-decoration:underline}
  .cc-link:focus-visible{outline:3px solid var(--blue,#1f4fd1);outline-offset:3px}`;

  let box = null;
  const close = () => { if (box) { box.remove(); box = null; } };
  const show = () => {
    if (box) return;
    box = document.createElement('div');
    box.className = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'cc-title');
    box.innerHTML = `<h2 id="cc-title">Datenschutz-Einstellungen</h2>
      <p>Wir messen über Google Ads, ob unsere Anzeigen zu Anfragen führen. Mit Ihrer Einwilligung setzt Google dafür Cookies und erhält genauere Nutzungsdaten, auch in den USA. Ohne Einwilligung werden keine Cookies gesetzt. Sie können Ihre Wahl jederzeit über „Cookie-Einstellungen“ unten auf der Seite ändern. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
      <div class="cc-btns"><button type="button" class="btn line" data-c="denied">Ablehnen</button><button type="button" class="btn" data-c="granted">Akzeptieren</button></div>`;
    box.addEventListener('click', e => {
      const c = e.target.closest('[data-c]')?.dataset.c;
      if (!c) return;
      save(c); c === 'granted' ? grant() : deny(); close();
    });
    document.body.appendChild(box);
  };

  const init = () => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    // Link „Cookie-Einstellungen“ in der Fußzeile
    const nav = document.querySelector('footer nav');
    if (nav) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cc-link'; b.textContent = 'Cookie-Einstellungen';
      b.addEventListener('click', show);
      nav.appendChild(b);
    }
    const c = read();
    // Auf Impressum und Datenschutz nicht automatisch einblenden, damit man sie ungestört lesen kann
    if (c === null && !document.documentElement.hasAttribute('data-no-banner')) show();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
