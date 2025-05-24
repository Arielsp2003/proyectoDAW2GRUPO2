// Cuando el DOM esté completamente cargado, ejecutar las funciones iniciales
document.addEventListener('DOMContentLoaded', function () {
  mostrarProductos(productos);
  configurarEventos();
});

// Función para configurar los eventos de interacción en la página
function configurarEventos() {
  document.querySelector('.btn-search')?.addEventListener('click', aplicarFiltros);
    document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logout') {
      e.preventDefault();
      cerrarSesion();
    }
  });
  document.getElementById('filter-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    aplicarFiltros();
  });
}

// Función que filtra los productos según los valores ingresados en el formulario
function aplicarFiltros() {
  const tipoInput = document.getElementById('tipo');
  const pesoMinInput = document.getElementById('peso-min');
  const pesoMaxInput = document.getElementById('peso-max');
  const precioMaxInput = document.getElementById('precio-max');
  const busquedaInput = document.querySelector('.search-bar input');

  const tipo = tipoInput ? tipoInput.value.toLowerCase() : "";
  const pesoMin = pesoMinInput ? parseFloat(pesoMinInput.value) || 0 : 0;
  const pesoMax = pesoMaxInput ? parseFloat(pesoMaxInput.value) || Infinity : Infinity;
  const precioMax = precioMaxInput ? parseFloat(precioMaxInput.value) || Infinity : Infinity;
  const textoBusqueda = busquedaInput ? busquedaInput.value.toLowerCase() : "";

  const resultados = productos.filter(pavo =>
    (tipo === "" || pavo.tipo.toLowerCase() === tipo) &&
    pavo.peso >= pesoMin &&
    pavo.peso <= pesoMax &&
    pavo.precio <= precioMax &&
    (
      pavo.nombre.toLowerCase().includes(textoBusqueda) ||
      pavo.descripcion.toLowerCase().includes(textoBusqueda)
    )
  );

  if (textoBusqueda.trim() !== "") {
    if (resultados.length > 0) {
      alert("Pavo encontrado, vaya al catálogo para más información.");
    } else {
      alert("No se encontraron resultados para su búsqueda.");
    }
  }

  mostrarProductos(resultados);
}

// Función que muestra una lista de productos (pavos) en el contenedor correspondiente
function mostrarProductos(lista) {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return;

  contenedor.innerHTML = ''; // Limpiar

  if (lista.length === 0) {
    contenedor.innerHTML = '<p class="text-center">No se encontraron pavos con los filtros aplicados.</p>';
    return;
  }

  lista.forEach(producto => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'pavo-card';

    tarjeta.innerHTML = `
      <div class="pavo-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="pavo-info">
        <h3>${producto.nombre}</h3>
        <span class="pavo-tipo">${producto.tipo}</span>
        <p class="pavo-peso"><strong>Peso:</strong> ${producto.peso} kg</p>
        <p class="pavo-precio"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
        <p class="pavo-fecha"><strong>Disponible desde:</strong> ${producto.fecha}</p>
        <a href="detalle_pavo.html?id=${producto.id}" class="btn btn-primary mt-2">Ver detalles</a>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}
