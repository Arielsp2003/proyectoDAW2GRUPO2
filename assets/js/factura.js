let facturaData = null;

// Función para recibir datos de la página de pago
function pasarDatosFactura(data) {
  facturaData = data;
  mostrarFactura();
}

function mostrarFactura() {
  if (!facturaData) {
    alert('No hay datos de factura');
    window.location.href = 'finalizarCompra.html';
    return;
  }

  const dc = facturaData.datosCliente;
  document.getElementById('datos-cliente').innerHTML = `
    <p><strong>Nombre completo:</strong> ${dc.nombre} ${dc.apellido}</p>
    <p><strong>Dirección:</strong> ${dc.direccion}, ${dc.ciudad}, ${dc.pais}</p>
    <p><strong>Teléfono:</strong> ${dc.telefono}</p>
    <p><strong>Cédula:</strong> ${dc.cedula}</p>
    <p><strong>Empresa:</strong> ${dc.empresa}</p>
    <p><strong>Pago:</strong> ${dc.metodoPago}</p>
    <p><strong>Fecha:</strong> ${dc.fecha}</p>
  `;

  // 2. Mostrar productos
  const tf = document.getElementById('productos-factura');
  facturaData.productos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.cantidad}</td>
      <td>$${p.precio.toFixed(2)}</td>
      <td>$${(p.precio * p.cantidad).toFixed(2)}</td>
    `;
    tf.appendChild(tr);
  });

  // 3. Mostrar total
  document.getElementById('total-factura').textContent = `$${facturaData.total.toFixed(2)}`;

  // 4. Si es transferencia, mostrar sus datos
  if (dc.metodoPago === 'transferencia' && facturaData.transferencia) {
    const contenedor = document.getElementById('transferencia-info');
    document.getElementById('datos-transferencia').classList.remove('d-none');

    contenedor.innerHTML = `
      <p><strong>Cuenta de origen:</strong> ${facturaData.transferencia.cuentaOrigen}</p>
      <p><strong>Cuenta acreditada:</strong> ${facturaData.transferencia.cuentaDestino}</p>
      <p><strong>Beneficiario:</strong> ${facturaData.transferencia.beneficiario}</p>
      <p><strong>Monto transferido:</strong> $${facturaData.transferencia.monto}</p>
      <p><strong>Fecha de transferencia:</strong> ${facturaData.transferencia.fecha}</p>
      <p><strong>ID de la transferencia:</strong> ${facturaData.transferencia.idTransferencia}</p>
    `;
  }
}

// Mostrar factura al cargar si hay datos en la URL
document.addEventListener('DOMContentLoaded', function() {
  // Si no hay datos aún, mostramos una factura de ejemplo por defecto
  if (!facturaData) {
    pasarDatosFactura({
 datosCliente: {
      nombre: 'Erick',
      apellido: 'Goyes Gonzalez',
      direccion: 'Av. 9 de octubre Calle 26',
      ciudad: 'Guayaquil',
      pais: 'Ecuador',
      telefono: '0999999999',
      cedula: '0912345678',
      empresa: 'Ejemplo S.A.',
      metodoPago: 'efectivo',
      fecha: new Date().toLocaleString()
    },
    productos: [
      { nombre: 'Pavo natural premium', cantidad: 2, precio: 45.99 },
      { nombre: 'Pavo ahumado artesanal', cantidad: 1, precio: 52.50 }
    ],
    total: 144.48,
    transferencia: null
 
    });
  }
});
