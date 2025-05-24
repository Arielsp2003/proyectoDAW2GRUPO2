if (typeof usuarioActual === 'undefined') {
    var usuarioActual = null;
}
if (typeof carrito === 'undefined') {
    var carrito = [];
}
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
    imagen: "assets/img/pavo-natural.jpg"
  },
  {
    id: 2,
    nombre: "Pavo ahumado artesanal",
    tipo: "ahumado",
    peso: 4.8,
    precio: 52.50,
    fecha: "10/04/2025",
    descripcion: "Pavo ahumado con técnicas tradicionales.",
    imagen: "assets/img/pavo-ahumado.jpg"
  },
  {
    id: 3,
    nombre: "Pavo con especias selectas",
    tipo: "especias",
    peso: 5.5,
    precio: 48.75,
    fecha: "18/04/2025",
    descripcion: "Pavo sazonado con una mezcla exclusiva de especias.",
    imagen: "assets/img/pavo-especias.jpg"
  },
  {
    id: 4,
    nombre: "Pavo relleno tradicional",
    tipo: "relleno",
    peso: 6.2,
    precio: 59.99,
    fecha: "20/04/2025",
    descripcion: "Pavo relleno con una receta tradicional familiar.",
    imagen: "assets/img/pavo-relleno.jpg"
  }
];
}
document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("show-password");

    toggleBtn.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "Ocultar";
      } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "Mostrar";
      }
    });
  inicializarPagina();

});

function inicializarPagina() {
  verificarSesion(); // Verifica si hay usuario autenticado y actualiza la UI
  configurarEventos(); // Configura todos los listeners de eventos para botones, formularios, etc.
  actualizarContadorCarrito(); // Actualiza el número visible del carrito en la interfaz
  
  if (document.getElementById('contenedor-productos')) {
    mostrarProductos(productos);
  }
  
  const dropdown = document.getElementById('cart-dropdown');
  if (dropdown && dropdown.style.display === 'block') {
    actualizarCarrito();
  }
}

// Verifica el estado de sesión y actualiza botones en la interfaz
function verificarSesion() {
  // La sesión se maneja en memoria
  actualizarEstadoSesion();
}

function actualizarEstadoSesion() {
  const btnLogin = document.querySelector('a[href$="login.html"]');
  const btnRegistro = document.querySelector('a[href$="registro.html"]');
  const btnLogout = document.getElementById('logout');

  if (usuarioActual && usuarioActual.autenticado) {
    if (btnLogin) btnLogin.closest('li').style.display = 'none';
    if (btnRegistro) btnRegistro.closest('li').style.display = 'none';
    if (btnLogout) {
      btnLogout.closest('li').style.display = 'block';
      btnLogout.classList.remove('d-none');
    }
  } else {
    if (btnLogin) btnLogin.closest('li').style.display = 'block';
    if (btnRegistro) btnRegistro.closest('li').style.display = 'block';
    if (btnLogout) {
      btnLogout.closest('li').style.display = 'none';
      btnLogout.classList.add('d-none');
    }
  }
}

// Actualiza el contador visible con la suma de las cantidades de productos en el carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-badge');
  if (contador) {
    contador.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
  }
}

// Muestra u oculta el dropdown del carrito al hacer clic en el botón correspondiente
function toggleCarrito() {
  const dropdown = document.getElementById('cart-dropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
    actualizarCarrito();
  }
}

// Actualiza el contenido visual del carrito en el dropdown
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

// Elimina un producto del carrito según el índice recibido
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  actualizarCarrito();
  actualizarContadorCarrito();
}

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

// Función para buscar productos según término ingresado en barra de búsqueda
function buscarProductos() {
  const termino = document.querySelector('.search-bar input').value.trim().toLowerCase();
  if (!termino) return;
  
  const resultados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(termino) || 
    producto.tipo.toLowerCase().includes(termino)
  );
  
  mostrarProductos(resultados);
}

// Muestra la lista de productos recibida en el contenedor de productos
function mostrarProductos(productosMostrar) {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  
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

// Aplica filtros de tipo, peso mínimo, peso máximo y precio máximo para mostrar productos
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

// Cierra la sesión del usuario actual y redirige a la página principal (index.html)
function cerrarSesion() {
  usuarioActual = null;
  const rutaActual = window.location.pathname;
  const estaEnHtml = rutaActual.includes('/html/');
  window.location.href = estaEnHtml ? '../index.html' : 'index.html';
}

// Muestra una notificación temporal con un mensaje personalizado en la pantalla
function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  notificacion.style.zIndex = '1000';
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  // Remueve la notificación luego de 3 segundos
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}