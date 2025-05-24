// Verifica si existen las variables globales 'carrito' y 'productos', si no las define
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

// Actualiza la interfaz del carrito: muestra productos, calcula totales y actualiza contadores
function actualizarCarritoUI() {
  const cartItemsElement = document.getElementById('cart-items') || document.getElementById('items-carrito');
  if (cartItemsElement) {
    cartItemsElement.innerHTML = carrito.map(item => `
      <div class="cart-item">
        ${item.nombre} x${item.cantidad} $${(item.precio * item.cantidad).toFixed(2)}
        <button class="remove-item" data-id="${item.id}">✖</button>
      </div>
    `).join('');
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalElement = document.getElementById('cart-total') || document.getElementById('total-carrito') || document.getElementById('total-factura') || document.getElementById('total-pedido');
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  actualizarContadorCarrito();

  // Si se detecta tabla de factura, carga el contenido del carrito en ella
  if (document.getElementById('items-factura')) {
    cargarFactura();
  }

  // Si se detecta resumen del checkout, carga el contenido del carrito en él
  if (document.getElementById('resumen-items')) {
    cargarCheckout();
  }

  // Muestra el monto total a pagar
  if (document.getElementById('monto-pagar')) {
    document.getElementById('monto-pagar').textContent = `$${total.toFixed(2)}`;
  }
}

function actualizarContadorCarrito() {
  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const contador = document.getElementById('cart-badge');
  
  if (contador) {
    contador.textContent = totalItems;
  }
}

// Carga los productos del carrito en la tabla de la factura
function cargarFactura() {
  const tbody = document.getElementById('items-factura');
  const subtotalElement = document.getElementById('subtotal-factura');
  const totalElement = document.getElementById('total-factura');

  tbody.innerHTML = '';

  if (carrito.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos en el carrito</td></tr>';
    if (subtotalElement) subtotalElement.textContent = '$0.00';
    if (totalElement) totalElement.textContent = '$0.00';
    return;
  }

  carrito.forEach((producto, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.peso || 'N/A'}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td><input type="number" min="1" value="${producto.cantidad}" class="input-cantidad" data-index="${index}"></td>
      <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
      <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });

  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;

  configurarEventosCarrito();
}

function configurarEventosCarrito() {
  document.querySelectorAll('.input-cantidad').forEach(input => {
    input.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      const nuevaCantidad = parseInt(this.value) || 1;
      carrito[index].cantidad = nuevaCantidad;
      actualizarCarritoUI();
    });
  });

   // Para cada botón de eliminar producto del carrito
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      carrito.splice(index, 1);
      actualizarCarritoUI();
    });
  });

  // Evento para vaciar todo el carrito al hacer click en el botón 'vaciar-carrito'
  document.getElementById('vaciar-carrito')?.addEventListener('click', function() {
    carrito = [];
    actualizarCarritoUI();
  });

  // Evento global para eliminar un item al hacer click en cualquier botón con clase 'remove-item'
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
      const id = parseInt(e.target.dataset.id);
      carrito = carrito.filter(item => item.id !== id);
      actualizarCarritoUI();
    }
  });
}

function cargarCheckout() {
   // Obtiene el contenedor donde se listan los items del pedido
  const contenedorItems = document.getElementById('resumen-items');
  // Elementos donde se muestran subtotal y total
  const totalElement = document.getElementById('total-pedido');
  const subtotalElement = document.getElementById('subtotal-pedido');

  if (contenedorItems) {
    contenedorItems.innerHTML = '';
    carrito.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
      `;
      contenedorItems.appendChild(tr);
    });

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

function agregarAlCarrito(producto, cantidad = 1) {
   // Busca si el producto ya existe en el carrito por id
  const itemExistente = carrito.find(item => item.id === producto.id);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      peso: producto.peso,
      cantidad: cantidad
    });
  }

  actualizarCarritoUI(); // Actualiza la interfaz del carrito para mostrar los cambios
  mostrarNotificacion(`${producto.nombre} agregado al carrito`);  // Muestra una notificación indicando que se agregó el producto
  return true;
}

function mostrarNotificacion(mensaje) {
  // Crea un div para mostrar el mensaje de alerta
  const notificacion = document.createElement('div');
   // Añade clases de estilo para mostrarlo como alerta fija en la esquina superior derecha
  notificacion.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  notificacion.style.zIndex = '1000';
  // Establece el texto del mensaje
  notificacion.textContent = mensaje;
  // Añade el div al body para mostrarlo
  document.body.appendChild(notificacion);

  // Después de 3 segundos elimina la notificación automáticamente
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  actualizarCarritoUI();
  
  // Configurar eventos del modal
  document.getElementById('continue-shopping')?.addEventListener('click', function() {
    document.getElementById('added-modal').style.display = 'none';
  });
  
  document.querySelector('.close-modal')?.addEventListener('click', function() {
    document.getElementById('added-modal').style.display = 'none';
  });
  
  // Configurar eventos del dropdown del carrito
  document.getElementById('cart-btn')?.addEventListener('click', function() {
    const dropdown = document.getElementById('cart-dropdown') || document.getElementById('dropdown-carrito');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  });
  
  document.getElementById('close-cart')?.addEventListener('click', function() {
    const dropdown = document.getElementById('cart-dropdown') || document.getElementById('dropdown-carrito');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  });
});