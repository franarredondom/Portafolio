# Analítica gratuita del portafolio

La página sigue funcionando sin configurar nada. El seguimiento se activa al completar `analytics/config.js`.

## 1. Microsoft Clarity (gratuito)

1. Crea un proyecto en https://clarity.microsoft.com para https://franarredondom.github.io/Portafolio/.
2. Copia el **Project ID** público (no tu contraseña) en `clarityProjectId` de `analytics/config.js`.
3. Publica los cambios. Verifica el panel de Clarity. Las visitas anteriores a la instalación no se recuperan.

## 2. Telegram + Google Apps Script (sin servidor de pago)

1. En Telegram abre https://t.me/BotFather, envía `/newbot` y guarda el **token en privado**.
2. Abre una conversación con tu bot y envía `/start`. Para obtener tu chat ID, puedes consultar `getUpdates` de Telegram **en privado** o usar un bot de ID confiable; no compartas el token.
3. Crea un proyecto en https://script.google.com y pega el contenido de `google-apps-script/Code.gs` en el editor.
4. En **Configuración del proyecto > Propiedades de secuencia de comandos** agrega dos claves: `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`, con sus valores privados.
5. En **Implementar > Nueva implementación > Aplicación web**, selecciona **Ejecutar como: yo** y **Quién tiene acceso: cualquiera**. Autoriza los permisos solicitados; copia la URL que termina en `/exec`.
6. Pega esa URL en `visitWebhookUrl` de `analytics/config.js` y publica los cambios.
7. Abre tu web en una pestaña privada y verifica que te llegue el aviso a Telegram. Puedes probar también la URL del web app añadiendo `?event=visit&page=/Portafolio/`.

**Importante:** no agregues el token ni chat ID a los archivos públicos. El URL del webhook sí será visible; una persona malintencionada podría usarlo para enviar alertas falsas. Hay un límite aproximado en caché de 30 eventos por categoría, pero para resistir abuso real necesitarías autenticación o un servicio anti-bots. El seguimiento funciona sólo para navegadores que carguen el JS y permitan esas solicitudes. La misma persona puede aparecer varias veces, y bots también pueden generar eventos. Respeta los avisos de privacidad y consentimiento aplicables antes de activar grabaciones de sesión.
