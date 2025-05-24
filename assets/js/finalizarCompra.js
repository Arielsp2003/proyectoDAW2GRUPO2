// Variables globales para almacenar los datos del cliente y transferencia
let datosCliente = {};
let datosTransferencia = {};

// Ejecuta funciones principales cuando el documento haya cargado completamente
document.addEventListener('DOMContentLoaded', function() {
  cargarCheckout();  // Carga los productos del carrito al resumen de pedido
  configurarEventos();  // Configura los eventos del formulario y botones
});

// Configura todos los eventos de interacción con el usuario
function configurarEventos() {
  // Evento para método de pago transferencia
  document.querySelector('input[name="metodo-pago"][value="transferencia"]')?.addEventListener('change', function() {
    if (this.checked) {
      const monto = document.getElementById('total-pedido')?.textContent || "$0.00";
      document.getElementById('montoTransferencia').value = monto.replace('$', '');

      // Generar ID aleatorio
      const idGenerado = 'TX-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000);
      document.getElementById('idTransferencia').value = idGenerado;

      const modal = new bootstrap.Modal(document.getElementById('modalTransferencia'));
      modal.show();
    }
  });

  // Evento para guardar los datos de transferencia cuando se hace clic en el botón
  document.getElementById('guardarTransferencia')?.addEventListener('click', function() {
    const cuenta = document.getElementById('cuentaOrigen').value;
    const fecha = document.getElementById('fechaTransferencia').value;
    const id = document.getElementById('idTransferencia').value;

    if (!cuenta || !fecha) {
      alert("Complete todos los campos de transferencia.");
      return;
    }

    datosTransferencia = {
      cuentaOrigen: cuenta,
      cuentaDestino: "012456789",
      beneficiario: "Pavos deliciosos S.A.",
      monto: document.getElementById('montoTransferencia').value,
      fecha,
      idTransferencia: id
    };

    // Mostrar botón para visualizar los datos de transferencia
   const btnTransferencia = document.getElementById('btnVerTransferenciaWrapper');
    if (btnTransferencia) {
    btnTransferencia.classList.remove('d-none');
    }

    bootstrap.Modal.getInstance(document.getElementById('modalTransferencia')).hide();
  });

  // Evento para enviar el formulario de pago
  document.getElementById('formulario-pago')?.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    if (!confirm('¿Está seguro de continuar con la compra?')) {
      return;
    }

    // Guardar los datos del cliente
    datosCliente = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      direccion: document.getElementById('direccion').value,
      ciudad: document.getElementById('ciudad').value,
      pais: document.getElementById('pais').value,
      telefono: document.getElementById('telefono').value,
      cedula: document.getElementById('cedula').value,
      empresa: document.getElementById('empresa').value || 'No aplica',
      metodoPago: document.querySelector('input[name="metodo-pago"]:checked').value,
      fecha: new Date().toLocaleString()
    };

    // 2) Abre factura.html en nueva pestaña
    const facturaWindow = window.open('factura.html', '_blank');
    
    // Espera a que la ventana se cargue para pasar los datos
    facturaWindow.onload = function() {
      facturaWindow.pasarDatosFactura({
        datosCliente,
        productos: carrito,
        total: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0),
        transferencia: datosTransferencia
      });
    };

    // Limpiar carrito y formulario
    carrito = [];
    limpiarFormulario();
  });
}

// Cargar el contenido del carrito al resumen del pedido en la página
function cargarCheckout() {
  if (!document.getElementById('resumen-pedido')) return;

  const contenedorItems = document.getElementById('resumen-items');
  const totalElement = document.getElementById('total-pedido');
  const subtotalElement = document.getElementById('subtotal-pedido');

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

// Validación de campos requeridos del formulario
function validarFormulario() {
  const camposRequeridos = ['nombre', 'apellido', 'direccion', 'ciudad', 'telefono', 'cedula'];
  for (const campo of camposRequeridos) {
    const valor = document.getElementById(campo)?.value;
    if (!valor) {
      mostrarError(`Por favor complete el campo: ${formatearClave(campo)}`);
      return false;
    }
  }
  return true;
}

// Mostrar un mensaje de error al usuario
function mostrarError(mensaje) {
  alert(mensaje);
}

// Formatea el nombre del campo para que se vea más legible en los mensajes
function formatearClave(clave) {
  return clave
    .replace(/([A-Z])/g, ' $1')
    .replace(/-/g, ' ')
    .replace(/^./, str => str.toUpperCase());
}

// Limpia todos los campos del formulario al finalizar la compra
function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('ciudad').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('cedula').value = '';
  document.getElementById('empresa').value = '';
  document.querySelector('input[name="metodo-pago"][value="efectivo"]').checked = true;
}

/**Factura de ejemplo */
document.getElementById('verFacturaEjemplo')?.addEventListener('click', function () {
  const ejemploFactura = {
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
  };

  const nuevaVentana = window.open('factura.html', '_blank');
  nuevaVentana.onload = function () {
    nuevaVentana.pasarDatosFactura(ejemploFactura);
  };
});
