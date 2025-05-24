// Variables globales: usuario actual y carrito. Si no están definidos, los inicializa.
if (typeof usuarioActual === 'undefined') {
    var usuarioActual = null;
}
if (typeof carrito === 'undefined') {
    var carrito = [];
}
// Define la ruta base dependiendo si estamos en una subcarpeta "html" o no.
  const rutaBase = window.location.pathname.includes("/html/") ? "../" : "./";

// Si no existe el arreglo productos, crea uno con datos de ejemplo de pavos.
if (typeof productos === 'undefined') {
    var productos = [
  {
    id: 1,
    nombre: "Pavo natural premium",
    tipo: "natural",
    peso: 5.2,
    precio: 45.99,
    fecha: "15/04/2025",
    descripcion: "Pavo natural de alta calidad, criado en granjas ecológicas.",
    imagen: rutaBase + "assets/img/pavo-natural.jpg"
  },
  {
    id: 2,
    nombre: "Pavo ahumado artesanal",
    tipo: "ahumado",
    peso: 4.8,
    precio: 52.50,
    fecha: "10/04/2025",
    descripcion: "Pavo ahumado con técnicas tradicionales.",
    imagen: rutaBase +  "assets/img/pavo-ahumado.jpg"
  },
  {
    id: 3,
    nombre: "Pavo con especias selectas",
    tipo: "especias",
    peso: 5.5,
    precio: 48.75,
    fecha: "18/04/2025",
    descripcion: "Pavo sazonado con una mezcla exclusiva de especias.",
    imagen: rutaBase + "assets/img/pavo-especias.jpg"
  },
  {
    id: 4,
    nombre: "Pavo relleno tradicional",
    tipo: "relleno",
    peso: 6.2,
    precio: 59.99,
    fecha: "20/04/2025",
    descripcion: "Pavo relleno con una receta tradicional familiar.",
    imagen:rutaBase +  "assets/img/pavo-relleno.jpg"
  }
];
}
document.addEventListener('DOMContentLoaded', function() {
  inicializarPagina();
});

// Inicializa la página: verifica sesión, eventos y muestra productos si corresponde
function inicializarPagina() {
  verificarSesion();
  configurarEventos();
  actualizarContadorCarrito();
  
  if (document.getElementById('contenedor-productos')) {
    mostrarProductos(productos);
  }
  
  const dropdown = document.getElementById('cart-dropdown');
  if (dropdown && dropdown.style.display === 'block') {
    actualizarCarrito();
  }
}

// Verifica si el usuario ha iniciado sesión
function verificarSesion() {
  // La sesión se maneja en memoria
  actualizarEstadoSesion();
}

// Actualiza la interfaz según si el usuario ha iniciado sesión o no
function actualizarEstadoSesion() {
  const btnLogout = document.getElementById('logout');

  if (usuarioActual && usuarioActual.autenticado) {
    // El usuario ha iniciado sesión: puedes cambiar el texto del botón o mostrar su nombre si lo deseas.
    if (btnLogout) {
      btnLogout.classList.remove('d-none');
    }
  } else {
    if (btnLogout) {
      btnLogout.classList.remove('d-none'); // Aún visible incluso sin sesión
    }
  }
}

// Actualiza el número que aparece en el ícono del carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-badge');
  if (contador) {
    contador.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
  }
}

// Abre o cierra el desplegable del carrito y actualiza su contenido
function toggleCarrito() {
  const dropdown = document.getElementById('cart-dropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
    actualizarCarrito();
  }
}

// Muestra los productos agregados al carrito en el menú desplegable
function actualizarCarrito() {
  const contenedorItems = document.getElementById('cart-items');
  const contenedorTotal = document.getElementById('cart-total');
  
  if (contenedorItems) {
    contenedorItems.innerHTML = '';
    
    carrito.forEach((item, index) => {
      const divItem = document.createElement('div');
      divItem.className = 'd-flex justify-content-between align-items-center mb-2';
      divItem.innerHTML = `
        <span>${item.nombre} x${item.cantidad}</span>
        <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
        <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">✖</button>
      `;
      contenedorItems.appendChild(divItem);
    });
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (contenedorTotal) contenedorTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Elimina un producto del carrito por índice, luego actualiza interfaz y contador.
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  actualizarCarrito();
  actualizarContadorCarrito();
}

// Asocia los eventos de búsqueda, carrito, logout y filtros.
function configurarEventos() {
  // Búsqueda
  document.querySelector('.btn-search')?.addEventListener('click', buscarProductos);
  
  // Carrito
  document.getElementById('cart-btn')?.addEventListener('click', toggleCarrito);
  document.getElementById('close-cart')?.addEventListener('click', toggleCarrito);

  // Sesión
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logout') {
      e.preventDefault();
      cerrarSesion();
    }
  });

  // Filtros
  document.getElementById('filter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    filtrarProductos();
  });
}

// Busca productos por nombre o tipo con texto ingresado en barra de búsqueda.
function buscarProductos() {
  const termino = document.querySelector('.search-bar input').value.trim().toLowerCase();
  if (!termino) return;

  const resultados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(termino) || 
    producto.tipo.toLowerCase().includes(termino)
  );

  if (resultados.length === 0) {
    alert("No se encontraron resultados para su búsqueda");
  } else {
    alert("Pavo encontrado, revisa el catálogo para más información");
  }

  mostrarProductos(resultados);
}


// Genera las tarjetas HTML para cada producto que se pase, dentro del contenedor.
function mostrarProductos(productosMostrar) {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // Si no hay productos para mostrar, colocar mensaje debajo de “Productos destacados”
  if (productosMostrar.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted fs-5">No se encontraron pavos con los filtros aplicados.</p>
      </div>
    `;
    return;
  }

  productosMostrar.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <span class="badge bg-secondary">${producto.tipo}</span>
          <p class="card-text mt-2"><strong>Peso:</strong> ${producto.peso} kg</p>
          <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
          <p class="card-text"><small class="text-muted">Disponible desde: ${producto.fecha}</small></p>
        </div>
        <div class="card-footer bg-transparent">
          <a href="html/detalle_pavo.html?id=${producto.id}" class="btn btn-primary">Ver detalles</a>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}


// Filtra productos por tipo, rango de peso y precio máximo según formulario.
function filtrarProductos() {
  const tipo = document.getElementById('tipo').value;
  const pesoMin = parseFloat(document.getElementById('peso-min').value) || 0;
  const pesoMax = parseFloat(document.getElementById('peso-max').value) || Infinity;
  const precioMax = parseFloat(document.getElementById('precio-max').value) || Infinity;
  
  const resultados = productos.filter(producto => {
    return (tipo === "" || producto.tipo === tipo) &&
           producto.peso >= pesoMin &&
           producto.peso <= pesoMax &&
           producto.precio <= precioMax;
  });
  
  mostrarProductos(resultados);
}

// Cierra la sesión borrando la variable y redirigiendo a la página principal.
function cerrarSesion() {
  usuarioActual = null;
  const rutaActual = window.location.pathname;
  const estaEnHtml = rutaActual.includes('/html/');
  window.location.href = estaEnHtml ? '../index.html' : 'index.html';
}

// Muestra una notificación temporal en pantalla con el mensaje dado.
function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  notificacion.style.zIndex = '1000';
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}