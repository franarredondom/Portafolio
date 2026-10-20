(() => {
  'use strict';
  const config = window.PORTFOLIO_ANALYTICS || {};
  const clarityId = String(config.clarityProjectId || '').trim();
  const endpoint = String(config.visitWebhookUrl || '').trim();
  // Microsoft Clarity sólo se carga cuando se configure su ID público.
  if (clarityId && /^[a-z0-9]+$/i.test(clarityId)) {
    (function (c,l,a,r,i,t,y) {
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,'clarity','script',clarityId);
  }
  // No se registran correos, IPs, nombre ni contenido escrito por visitantes.
  // No genera tráfico hasta configurar un webhook HTTPS.
  if (!/^https:\/\//i.test(endpoint)) return;
  const notify = (type) => {
    const url = endpoint + (endpoint.includes('?') ? '&' : '?') +
      new URLSearchParams({event:type, page:location.pathname}).toString();
    const beacon = new Image();
    beacon.referrerPolicy = 'no-referrer';
    beacon.src = url; // Sin preflight, para Apps Script alojado en otro dominio.
  };
  // Una alerta por pestaña, no por cada actualización accidental.
  if (!sessionStorage.getItem('portfolio-visit-notified')) {
    sessionStorage.setItem('portfolio-visit-notified','1');
    notify('visit');
  }
  document.addEventListener('click',(e)=>{
    const a=e.target.closest('a[href]');
    if (!a) return;
    const href=(a.getAttribute('href')||'').toLowerCase();
    const label=(a.textContent||'').toLowerCase();
    if (/cv|curr[ií]culum|resume/.test(href+' '+label)) notify('cv_click');
  });
})();
