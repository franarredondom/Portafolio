/**
 * Script de Google Apps Script. Desplegar como Web App (cualquier persona).
 * Define TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en Project Settings > Script properties.
 * No pongas estos secretos en GitHub ni en analytics/config.js.
 */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const event = String(p.event || '');
  if (!['visit', 'cv_click'].includes(event)) return ContentService.createTextOutput('ignored');
  const path = String(p.page || '/').slice(0, 160);
  if (!path.startsWith('/') || path.includes('..')) return ContentService.createTextOutput('ignored');
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chat = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chat) return ContentService.createTextOutput('not configured');
  const cache = CacheService.getScriptCache();
  const day = Utilities.formatDate(new Date(), 'America/Santiago', 'yyyyMMdd');
  // Evita avalanchas accidentales; NO es una defensa sólida frente a spam intencional.
  const guardKey = 'limit_' + day + '_' + event;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return ContentService.createTextOutput('busy');
  try {
    const count = Number(cache.get(guardKey) || 0);
    if (count >= 30) return ContentService.createTextOutput('rate limited');
    cache.put(guardKey, String(count + 1), 21600); // Caché temporal: límite aproximado.
  } finally { lock.releaseLock(); }
  const now = Utilities.formatDate(new Date(), 'America/Santiago', 'dd/MM/yyyy HH:mm:ss');
  const message = event === 'cv_click' ? '📄 Clic en CV' : '👀 Nueva visita al portafolio';
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({chat_id: chat, text: message + '\nPágina: ' + path + '\nHora Chile: ' + now}),
      muteHttpExceptions: true
    });
  } catch (err) { console.error('Telegram delivery failed'); }
  return ContentService.createTextOutput('ok');
}
