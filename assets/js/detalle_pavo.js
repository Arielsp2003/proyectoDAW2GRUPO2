function cargarDetalleProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get('id');

  // Obtener el producto seleccionado
  const producto = productos.find(p => p.id == idProducto);
  
  if (!producto) {
    console.error('Producto no encontrado');
    return;
  }
  
  // Actualizar la interfaz
  document.getElementById('product-title').textContent = producto.nombre;
  document.getElementById('product-weight').textContent = producto.peso;
  document.getElementById('product-price').textContent = producto.precio.toFixed(2);
  document.getElementById('main-image').src = producto.imagen;

  // Configurar evento del botón
document.getElementById('add-to-cart').addEventListener('click', function() {
  const cantidad = parseInt(document.getElementById('quantity').value) || 1;
  const agregado = agregarAlCarrito(producto, cantidad);
  
  if (agregado) {
    mostrarModalProducto(producto, cantidad);
  }
});

}

function mostrarModalProducto(producto, cantidad) {
  const modal = document.getElementById('added-modal');
  if (!modal) return;
  
  modal.style.display = 'block';
  document.getElementById('modal-product-info').innerHTML = `
    <p>${producto.nombre} x${cantidad} - $${(producto.precio * cantidad).toFixed(2)}</p>
  `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('product-title')) {
    cargarDetalleProducto();
  }
});