# Guía de publicación — Sitio web Fundiag con administrador

El proyecto tiene dos partes: el **sitio web** (`index.html`) y el **administrador** (`/admin`), un panel donde editas textos, imágenes, servicios, casos de éxito, documentos y montos de donación sin tocar código. Cada cambio que publicas en el admin se guarda en GitHub y Netlify actualiza el sitio automáticamente en 1-2 minutos.

## Paso 1 — Subir el proyecto a GitHub (10 min)

1. Crea una cuenta gratis en [github.com](https://github.com) si no tienes.
2. Crea un repositorio nuevo llamado `fundiag-web` (público o privado).
3. En el repositorio, usa **Add file → Upload files** y arrastra TODO el contenido de esta carpeta (incluyendo las carpetas `admin`, `content`, `images`, `src`).
4. Haz clic en **Commit changes**.

## Paso 2 — Publicar en Netlify (5 min)

1. Crea una cuenta gratis en [netlify.com](https://netlify.com) (puedes entrar con tu cuenta de GitHub).
2. **Add new site → Import an existing project → GitHub** y elige `fundiag-web`.
3. Deja **Build command** vacío y **Publish directory** en `/`. Haz clic en **Deploy**.
4. En 1 minuto tendrás una dirección tipo `https://fundiag.netlify.app`. Puedes cambiar el nombre en *Site settings → Change site name*, o conectar un dominio propio.

## Paso 3 — Activar el login del administrador con DecapBridge (10 min)

El login clásico de Netlify (Identity) está descontinuado; lo recomendado hoy es **DecapBridge**, gratuito:

1. Crea una cuenta en [decapbridge.com](https://decapbridge.com).
2. **Add site** y conecta tu repositorio `fundiag-web` de GitHub.
3. DecapBridge te mostrará un bloque de configuración con tu `identity_url` (algo como `https://auth.decapbridge.com/sites/abc123`).
4. Abre `admin/config.yml` en GitHub (lápiz para editar) y reemplaza:
   - `<<TU_USUARIO_GITHUB/fundiag-web>>` → tu usuario y repo reales, ej. `mariagarcia/fundiag-web`
   - `<<URL_IDENTITY_DE_DECAPBRIDGE>>` → la `identity_url` que te dio DecapBridge
5. Guarda (**Commit changes**).
6. En DecapBridge, invita por correo a las personas que administrarán el sitio (por ejemplo `familycuape@gmail.com`). Recibirán un enlace para crear su contraseña.

## Paso 4 — Usar el administrador

- Entra a `https://TU-SITIO.netlify.app/admin/`
- Inicia sesión con el correo invitado.
- Verás las secciones: **General, Nosotros, Servicios, Casos de Éxito, Transparencia y Donaciones**. Edita y pulsa **Publicar**. El sitio se actualiza solo en 1-2 minutos.

## Pendientes importantes

1. **Reemplaza las imágenes cuanto antes.** Las actuales apuntan a servidores temporales de Google (Stitch) y caducarán. Desde el admin, en cada campo de imagen pulsa "Elegir imagen → Subir" y sube tus propias fotos (idealmente JPG/WebP de menos de 300 KB). Sube también un `favicon.png` a la carpeta `images/`.
2. **Documentos de transparencia:** sube los PDF reales desde el admin (sección Transparencia). Mientras estén vacíos, el sitio muestra "Disponible próximamente" en lugar de enlaces rotos.
3. **Donaciones:** el botón actual abre el correo del donante con los datos del monto elegido (honesto y funcional, pero manual). Cuando quieran recibir pagos en línea, integren una pasarela como Wompi, PayU o Mercado Pago; ahí sí podrán cobrar directamente.
4. **Política de privacidad:** el formulario pide consentimiento de contacto; conviene publicar una política de privacidad y enlazarla en el pie de página.

## Notas técnicas

- El CSS está precompilado en `styles.css`. Solo si algún día editan `index.html` o `main.js` añadiendo clases nuevas de Tailwind, regeneren el CSS con: `npm install` y luego `npm run build:css`.
- Para probar en el computador: `npx serve .` (el sitio no funciona abriendo el archivo directamente, necesita un servidor).
- Para probar el admin sin internet: `npx decap-server` en una terminal y `npx serve .` en otra.
