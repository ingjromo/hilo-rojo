/* ============================================================
   app.js — Lógica principal de la tienda Hilo Rojo
   ============================================================ */

/* ==================== CONFIGURACIÓN CENTRALIZADA ==================== */
/* Modifica aquí para personalizar la tienda sin tocar el HTML */
const CONFIG = {
  WHATSAPP_NUMBER: '5216141617308',   // Número con código de país, sin + ni espacios
  SHEET_ID:        '1ZsCesY-CZHkovHNpyl1-xptmYDjVQ59D0UgO38ClSiE', // ID del Google Sheet (ver README)
  NOMBRE_TIENDA:   'Hilo Rojo',
};

/* ==================== PRODUCTOS DE PRUEBA (FALLBACK) ==================== */
/* Se usan cuando el Sheet no está configurado o falla la conexión */
const PRODUCTOS_PRUEBA = [
  { id:1,  nombre:'Bolsa bohemia',      descripcion:'Tejida a mano con asa resistente. Disponible en varios colores.',           precio:320, categoria:'accesorios', emoji:'👜', imagenUrl:'' },
  { id:2,  nombre:'Gorro de invierno',  descripcion:'Suave y abrigador para el frío chihuahuense. Tallas adulto y niño.',        precio:180, categoria:'accesorios', emoji:'🧢', imagenUrl:'' },
  { id:3,  nombre:'Llavero tejido',     descripcion:'Pequeño amigurumi para tu llave o mochila. Varios modelos.',                precio:80,  categoria:'accesorios', emoji:'🔑', imagenUrl:'' },
  { id:4,  nombre:'Pokémon tejido',     descripcion:'Figura amigurumi de tu Pokémon favorito. 100% personalizable.',             precio:250, categoria:'figuras',    emoji:'⚡', imagenUrl:'' },
  { id:5,  nombre:'Jugador de fútbol',  descripcion:'Con número y colores de tu equipo. Completamente personalizable.',          precio:350, categoria:'figuras',    emoji:'⚽', imagenUrl:'' },
  { id:6,  nombre:'Figura kawaii',      descripcion:'Animalito amigurumi hecho a mano. Perfecto como regalo.',                   precio:220, categoria:'figuras',    emoji:'🐰', imagenUrl:'' },
  { id:7,  nombre:'Gnomo navideño',     descripcion:'Gnomo decorativo tejido para decorar tu hogar en diciembre.',               precio:290, categoria:'navidad',    emoji:'🎅', imagenUrl:'' },
  { id:8,  nombre:'Esferas navideñas',  descripcion:'Set de 3 esferas tejidas para el árbol. Cada set es único.',                precio:120, categoria:'navidad',    emoji:'🔴', imagenUrl:'' },
  { id:9,  nombre:'Esferas Pokémon',    descripcion:'Esferas navideñas con diseño de Pokéball. Edición especial.',               precio:150, categoria:'navidad',    emoji:'🎄', imagenUrl:'' },
  { id:10, nombre:'Flor decorativa',    descripcion:'Flores tejidas para ramos, espacios o regalos personalizados.',             precio:90,  categoria:'flores',     emoji:'🌸', imagenUrl:'' },
];

/* ==================== ESTADO GLOBAL ==================== */
let todosLosProductos = [];
let categoriaActiva   = 'todos';
let carrito           = [];
let productoModal     = null;  // Producto abierto en el modal

/* ==================== CARRITO ==================== */

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarContadorCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarContadorCarrito();
  renderizarCarrito();
}

function actualizarContadorCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('cart-count').textContent = total;
}

function calcularTotal() {
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

function renderizarCarrito() {
  const body = document.getElementById('cart-body');

  if (carrito.length === 0) {
    body.innerHTML = '<p class="cart-empty">Tu carrito está vacío 🧶</p>';
    return;
  }

  const itemsHtml = carrito.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}${item.cantidad > 1 ? ` &times;${item.cantidad}` : ''}</div>
        <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN</div>
      </div>
      <button class="cart-item-remove" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar ${item.nombre}">✕</button>
    </div>
  `).join('');

  const total = calcularTotal();

  body.innerHTML = `
    <div class="cart-items">${itemsHtml}</div>
    <div class="cart-footer">
      <div class="cart-total">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-amount">
          $${total.toLocaleString('es-MX')}
          <span style="font-family:var(--font-sans);font-size:0.72rem;font-weight:300;color:var(--ink3)">MXN</span>
        </span>
      </div>
      <button class="btn-whatsapp" onclick="solicitarPorWhatsApp()">
        Solicitar por WhatsApp
      </button>
    </div>
  `;
}

/* ==================== WHATSAPP ==================== */

function solicitarPorWhatsApp() {
  if (carrito.length === 0) return;

  const lineas = carrito
    .map(item => `- ${item.nombre} ×${item.cantidad} — $${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN`)
    .join('\n');

  const total   = calcularTotal();
  const mensaje =
    `Hola! Quiero hacer un pedido en ${CONFIG.NOMBRE_TIENDA} 🧶\n` +
    `${lineas}\n` +
    `Total: $${total.toLocaleString('es-MX')} MXN\n` +
    `¿Me pueden dar los datos de transferencia?`;

  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.location.href = url;
}

/* ==================== DRAWER DEL CARRITO ==================== */

function abrirCarrito() {
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.add('open');
  drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cerrarCarrito() {
  document.getElementById('cart-drawer').classList.remove('open');
}

function toggleCarrito() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer.classList.contains('open')) {
    cerrarCarrito();
  } else {
    abrirCarrito();
  }
}

/* ==================== MODAL DE DETALLE ==================== */

function abrirModal(producto) {
  if (!producto) return;
  productoModal = producto;

  const imgWrap = document.getElementById('modal-img-wrap');

  document.getElementById('modal-category').textContent = producto.categoria;
  document.getElementById('modal-name').textContent     = producto.nombre;
  document.getElementById('modal-desc').textContent     = producto.descripcion;
  document.getElementById('modal-price').innerHTML =
    `$${producto.precio.toLocaleString('es-MX')} <small>MXN</small>`;

  /* Mostrar imagen de Drive o emoji como fallback */
  if (producto.imagenUrl) {
    imgWrap.innerHTML = `
      <img
        src="${producto.imagenUrl}"
        alt="${producto.nombre}"
        onerror="this.style.display='none';document.getElementById('modal-emoji-fb').style.display='flex'"
      >
      <span id="modal-emoji-fb" class="modal-emoji" style="display:none;position:absolute">${producto.emoji}</span>`;
  } else {
    imgWrap.innerHTML = `<span class="modal-emoji">${producto.emoji}</span>`;
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  productoModal = null;
}

/* ==================== RENDERIZAR PRODUCTOS ==================== */

function crearImgHtml(p) {
  if (!p.imagenUrl) {
    return `<span class="product-emoji">${p.emoji}</span>`;
  }
  /* Muestra imagen; si falla, la oculta y muestra el emoji */
  return `
    <img
      src="${p.imagenUrl}"
      alt="${p.nombre}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
    >
    <span class="product-emoji" style="display:none;position:absolute;inset:0">${p.emoji}</span>`;
}

function renderizarProductos(lista) {
  const grid    = document.getElementById('product-grid');
  const counter = document.getElementById('collection-count');

  if (!lista || lista.length === 0) {
    grid.innerHTML = '<div class="no-results">No hay productos en esta categoría aún.</div>';
    counter.textContent = '0 piezas';
    return;
  }

  counter.textContent = `${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'}`;

  grid.innerHTML = lista.map(p => `
    <article
      class="product-card"
      onclick="abrirModal(todosLosProductos.find(x => x.id === ${JSON.stringify(p.id)}))"
      tabindex="0"
      role="button"
      aria-label="Ver detalle de ${p.nombre}"
      onkeydown="if(event.key==='Enter')this.click()"
    >
      <div class="product-img-wrap">
        ${crearImgHtml(p)}
        <span class="product-badge">${p.categoria}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.nombre}</h3>
        <p class="product-desc">${p.descripcion}</p>
        <div class="product-footer">
          <span class="product-price">$${p.precio.toLocaleString('es-MX')} <small>MXN</small></span>
          <button
            class="btn-add"
            onclick="event.stopPropagation(); agregarAlCarrito(todosLosProductos.find(x => x.id === ${JSON.stringify(p.id)}))"
            aria-label="Agregar ${p.nombre} al carrito"
          >+</button>
        </div>
      </div>
    </article>
  `).join('');

  iniciarMagnificadores();
}

/* ==================== LUPA / MAGNIFIER ==================== */

function iniciarMagnificadores() {
  document.querySelectorAll('.product-card').forEach(card => {
    const wrap = card.querySelector('.product-img-wrap');
    const img  = wrap?.querySelector('img');
    if (!img) return;

    const lupa = document.createElement('div');
    lupa.className = 'magnifier-lens';
    wrap.appendChild(lupa);

    wrap.addEventListener('mousemove', e => {
      const rect  = wrap.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const size  = 110;
      const zoom  = 2.8;

      lupa.style.left = `${x - size / 2}px`;
      lupa.style.top  = `${y - size / 2}px`;

      lupa.style.backgroundImage    = `url('${img.src}')`;
      lupa.style.backgroundSize     = `${rect.width * zoom}px ${rect.height * zoom}px`;
      lupa.style.backgroundPosition =
        `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    });

    wrap.addEventListener('mouseenter', () => { lupa.style.opacity = '1'; });
    wrap.addEventListener('mouseleave', () => { lupa.style.opacity = '0'; });
  });
}

/* ==================== FILTROS ==================== */

function filtrarProductos(categoria) {
  categoriaActiva = categoria;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === categoria);
  });

  const lista = categoria === 'todos'
    ? todosLosProductos
    : todosLosProductos.filter(p => p.categoria === categoria);

  renderizarProductos(lista);
}

/* ==================== INICIALIZACIÓN ==================== */

async function init() {
  mostrarSkeletons();

  const productosSheet = await fetchProductos(CONFIG.SHEET_ID);

  if (productosSheet && productosSheet.length > 0) {
    todosLosProductos = productosSheet;
  } else {
    /* Fallback a los productos de prueba hardcodeados */
    todosLosProductos = PRODUCTOS_PRUEBA;
  }

  renderizarProductos(todosLosProductos);
}

/* ==================== EVENT LISTENERS ==================== */

document.addEventListener('DOMContentLoaded', () => {
  init();

  /* Filtros */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filtrarProductos(btn.dataset.cat));
  });

  /* Carrito — botón navbar */
  document.getElementById('navbar-cart-btn').addEventListener('click', e => {
    e.preventDefault();
    toggleCarrito();
  });

  /* Carrito — botón hero */
  document.getElementById('hero-cart-btn').addEventListener('click', e => {
    e.preventDefault();
    abrirCarrito();
  });

  /* Cerrar carrito */
  document.getElementById('cart-close').addEventListener('click', cerrarCarrito);

  /* Cerrar modal */
  document.getElementById('modal-close').addEventListener('click', cerrarModal);

  /* Cerrar modal al hacer clic en el overlay */
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) cerrarModal();
  });

  /* Cerrar modal con tecla Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });

  /* Agregar al carrito desde el modal */
  document.getElementById('modal-add-btn').addEventListener('click', () => {
    if (productoModal) {
      agregarAlCarrito(productoModal);
      cerrarModal();
      abrirCarrito();
    }
  });
});
