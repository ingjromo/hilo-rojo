# Hilo Rojo — Tienda de tejidos artesanales

Bienvenida, Daniela 👋 Este es el manual completo para configurar y publicar tu tienda en internet.

---

## ¿Qué necesitas antes de empezar?

- Una cuenta de Google (para el Sheet y Google Drive)
- Una cuenta de GitHub (gratis en github.com)
- Un editor de texto simple (puedes usar el Bloc de notas, o mejor aún: Visual Studio Code, que es gratis)

---

## PASO 1 — Crear el catálogo de productos (Google Sheet)

Tu tienda lee los productos desde una hoja de cálculo de Google Sheets.

1. Ve a **sheets.google.com** e inicia sesión.
2. Crea una hoja nueva haciendo clic en **+**.
3. En la primera fila escribe estas columnas, una por celda (de A a H):

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | id | nombre | descripcion | precio | categoria | imagenUrl | emoji | disponible |

4. A partir de la fila 2 agrega tus productos. Ejemplo:

   | 1 | Bolsa bohemia | Tejida a mano con asa resistente | 320 | accesorios | (link de Drive) | 👜 | TRUE |

**Categorías disponibles:** `accesorios`, `figuras`, `navidad`, `flores`

> **Importante:** La columna `disponible` debe decir `TRUE` (en mayúsculas) para que el producto aparezca. Pon `FALSE` para ocultarlo sin borrarlo.

---

## PASO 2 — Hacer el Sheet público

Para que la tienda pueda leer tus productos:

1. En tu Google Sheet, ve a **Archivo → Compartir → Publicar en la web**.
2. En el menú desplegable de la izquierda deja **"Toda la hoja de cálculo"**.
3. En el de la derecha elige **"Página web"**.
4. Haz clic en **Publicar** y confirma.

Listo. Esto no comparte tus archivos personales, solo ese Sheet específico.

---

## PASO 3 — Pegar el ID del Sheet en la tienda

1. Con tu Sheet abierto, copia la URL de la barra del navegador. Se ve así:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
   ```

2. El ID es la parte larga entre `/d/` y `/edit`. En el ejemplo de arriba sería:
   ```
   1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
   ```

3. Abre el archivo `js/app.js` con tu editor de texto.

4. Cerca del inicio del archivo busca esta línea:
   ```javascript
   SHEET_ID: 'TU_SHEET_ID_AQUI',
   ```

5. Reemplaza `TU_SHEET_ID_AQUI` con tu ID real:
   ```javascript
   SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
   ```

6. Guarda el archivo.

---

## PASO 4 — Agregar fotos de los productos (Google Drive)

1. Ve a **drive.google.com** y sube la foto del producto.
2. Haz clic derecho en la foto → **Compartir**.
3. Cambia el acceso a **"Cualquier persona con el vínculo → Lector"** y copia el link.
   El link se verá así:
   ```
   https://drive.google.com/file/d/ABC123xyz/view
   ```

4. Copia solo el ID (la parte entre `/d/` y `/view`), en este caso `ABC123xyz`.

5. Arma la URL de la imagen así:
   ```
   https://drive.google.com/uc?export=view&id=ABC123xyz
   ```

6. Esa URL es la que pegas en la columna `imagenUrl` de tu Sheet.

> Si la foto no carga, verifica que el archivo esté compartido como "Cualquier persona con el vínculo".

---

## PASO 5 — Cambiar el número de WhatsApp

1. Abre `js/app.js`.
2. Busca esta línea:
   ```javascript
   WHATSAPP_NUMBER: '521XXXXXXXXXX',
   ```
3. Cámbiala por tu número con código de país, sin espacios ni símbolos:
   ```javascript
   WHATSAPP_NUMBER: '5216141234567',
   ```
   (Para México: `521` + 10 dígitos de tu número)

---

## PASO 6 — Publicar en GitHub Pages (gratis)

### Opción A: Con la terminal (gh CLI) — más rápido

Si tienes instalado **GitHub CLI** (`gh`), ejecuta esto en la carpeta del proyecto:

```bash
# 1. Inicializar el repositorio (ya está hecho si seguiste las instrucciones)
git init
git add .
git commit -m "Primer commit — Hilo Rojo"

# 2. Crear el repositorio en GitHub y subir el código
gh repo create hilo-rojo --public --push --source=.

# 3. Activar GitHub Pages
gh api repos/$(gh api user --jq .login)/hilo-rojo/pages \
  --method POST \
  --field source='{"branch":"main","path":"/"}'
```

Tu tienda estará en: `https://TU-USUARIO.github.io/hilo-rojo`

---

### Opción B: Desde github.com — sin terminal

1. **Crear el repositorio:**
   - Ve a **github.com** e inicia sesión.
   - Haz clic en el botón **"+"** arriba a la derecha → **"New repository"**.
   - En "Repository name" escribe: `hilo-rojo`
   - Deja marcado **Public**.
   - **NO** marques "Add a README file".
   - Haz clic en **"Create repository"**.

2. **Subir los archivos:**
   - En la página del repositorio recién creado, haz clic en **"uploading an existing file"**.
   - Arrastra y suelta TODOS los archivos y carpetas de la tienda:
     - `index.html`
     - carpeta `css/`
     - carpeta `js/`
     - carpeta `admin/`
     - `README.md`
   - Escribe en el mensaje de commit: `Primer commit`
   - Haz clic en **"Commit changes"**.

3. **Activar GitHub Pages:**
   - Ve a la pestaña **Settings** del repositorio.
   - En el menú izquierdo busca **Pages**.
   - En "Source" selecciona **"Deploy from a branch"**.
   - En "Branch" selecciona **main** y la carpeta **/ (root)**.
   - Haz clic en **Save**.

4. **Esperar unos minutos** y luego visitar:
   ```
   https://TU-USUARIO.github.io/hilo-rojo
   ```
   (Reemplaza `TU-USUARIO` con tu nombre de usuario en GitHub)

---

## Estructura de archivos

```
hilo-rojo/
├── index.html          → La tienda principal
├── css/
│   └── styles.css      → Todos los estilos
├── js/
│   ├── app.js          → Lógica de la tienda (carrito, filtros, etc.)
│   └── sheets.js       → Carga productos desde Google Sheets
├── admin/
│   └── index.html      → Panel de administración
└── README.md           → Este manual
```

---

## Actualizar productos

Una vez publicada la tienda, para agregar o modificar productos **solo necesitas editar el Google Sheet**. Los cambios se ven reflejados automáticamente en la tienda al recargar la página.

No necesitas tocar el código ni volver a publicar nada.

---

## Panel de administración

Accede en: `https://TU-USUARIO.github.io/hilo-rojo/admin/`

Contraseña inicial: `hilorrojo2024`

Ahí encontrarás las instrucciones paso a paso y un acceso directo a tu Google Sheet.

---

## ¿Problemas? Checklist rápida

- ¿Los productos no cargan? → Verifica que el Sheet esté **publicado en la web** (Paso 2) y que el SHEET_ID sea correcto (Paso 3).
- ¿Las fotos no se ven? → Verifica que el archivo en Drive esté compartido con "Cualquier persona con el vínculo".
- ¿WhatsApp no abre? → Revisa que el número en `js/app.js` tenga código de país sin `+` ni espacios.
- ¿La tienda no se actualiza después de cambios? → Espera unos minutos y fuerza recarga con `Ctrl+Shift+R`.
