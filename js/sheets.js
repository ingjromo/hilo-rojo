/* ============================================================
   sheets.js — Carga productos desde Google Sheets (API pública)
   ============================================================ */

/**
 * Muestra 6 tarjetas skeleton mientras los productos cargan.
 * Fondo --paper2 con animación de pulso suave.
 */
function mostrarSkeletons() {
  const grid = document.getElementById('product-grid');
  let html = '';
  for (let i = 0; i < 6; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>`;
  }
  grid.innerHTML = html;
}

/**
 * Obtiene y mapea productos desde Google Sheets vía la API gviz.
 *
 * Columnas esperadas en el Sheet (en este orden):
 *   A: id | B: nombre | C: descripcion | D: precio | E: categoria
 *   F: imagenUrl | G: emoji | H: disponible
 *
 * Devuelve un array de productos, o null si falla / no está configurado.
 *
 * @param {string} sheetId - ID del Google Sheet público
 * @returns {Promise<Array|null>}
 */
async function fetchProductos(sheetId) {
  if (!sheetId || sheetId === 'TU_SHEET_ID_AQUI') {
    return null;
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();

    /* Google envuelve la respuesta así:
       /*O_o*/
       google.visualization.Query.setResponse({...});
       Necesitamos extraer solo el JSON del interior. */
    const match = text.match(/google\.visualization\.Query\.setResponse\((\{[\s\S]*\})\)/);
    if (!match) throw new Error('Formato de respuesta inesperado');

    const data = JSON.parse(match[1]);
    const rows = data?.table?.rows ?? [];

    const productos = rows
      .map(row => {
        const c = row.c ?? [];
        return {
          id:          c[0]?.v ?? '',
          nombre:      String(c[1]?.v ?? '').trim(),
          descripcion: String(c[2]?.v ?? '').trim(),
          precio:      parseFloat(c[3]?.v) || 0,
          categoria:   String(c[4]?.v ?? '').toLowerCase().trim(),
          imagenUrl:   String(c[5]?.v ?? '').trim(),
          emoji:       String(c[6]?.v ?? '🧶').trim(),
          disponible:  c[7]?.v,
        };
      })
      .filter(p =>
        p.nombre &&
        (p.disponible === true ||
         String(p.disponible).toUpperCase() === 'TRUE')
      );

    return productos;

  } catch (error) {
    console.warn('[Hilo Rojo] No se pudo cargar el Sheet:', error.message);
    return null;
  }
}
