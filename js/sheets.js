function mostrarSkeletons() {
  const grid = document.getElementById('product-grid');
  let html = '';
  for (let i = 0; i < 6; i++) {
    html += `<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>`;
  }
  grid.innerHTML = html;
}

/* Convierte cualquier URL de Google Drive al formato thumbnail que sí carga como imagen.
   Google dejó de servir imágenes vía uc?export=view — el endpoint thumbnail es el reemplazo. */
function normalizarUrlDrive(url) {
  if (!url) return '';

  // Soporta estos formatos:
  //   https://drive.google.com/file/d/FILE_ID/view
  //   https://drive.google.com/uc?export=view&id=FILE_ID
  //   https://drive.google.com/open?id=FILE_ID
  const matchPath  = url.match(/\/file\/d\/([^/?]+)/);
  const matchQuery = url.match(/[?&]id=([^&]+)/);
  const fileId = (matchPath?.[1] ?? matchQuery?.[1] ?? '').trim();

  if (!fileId) return url;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

async function fetchProductos(sheetId) {
  if (!sheetId || sheetId === 'TU_SHEET_ID_AQUI') return null;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\((\{[\s\S]*\})\)/);
    if (!match) throw new Error('Formato inesperado');
    const data = JSON.parse(match[1]);
    const rows = data?.table?.rows ?? [];
    return rows.map(row => {
      const c = row.c ?? [];
      return {
        id:          c[0]?.v ?? '',
        nombre:      String(c[1]?.v ?? '').trim(),
        descripcion: String(c[2]?.v ?? '').trim(),
        precio:      parseFloat(c[3]?.v) || 0,
        categoria:   String(c[4]?.v ?? '').toLowerCase().trim(),
        imagenUrl:   normalizarUrlDrive(String(c[5]?.v ?? '').trim()),
        emoji:       String(c[6]?.v ?? '🧶').trim(),
        disponible:  c[7]?.v,
      };
    }).filter(p =>
      p.nombre &&
      (p.disponible === true || String(p.disponible).toUpperCase() === 'TRUE')
    );
  } catch (error) {
    console.warn('[Hilo Rojo] Error cargando Sheet:', error.message);
    return null;
  }
}
