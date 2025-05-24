// Ejecutar la función actualizarTabla cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', actualizarTabla);

const form = document.getElementById("formPavo");
const tabla = document.getElementById("tablaPavos");
const btnGuardar = document.getElementById("btnGuardar");

let pavos = [
  {
    id_pavo: 1,
    nombre: "Pavo natural premium",
    peso: 5.2,
    precio: 45.99,
    fecha: "2025-04-15",
    tipo: "natural",
    disponible: true
  },
  {
    id_pavo: 2,
    nombre: "Pavo ahumado artesanal",
    peso: 4.8,
    precio: 52.5,
    fecha: "2025-04-10",
    tipo: "ahumado",
    disponible: true
  },
  {
    id_pavo: 3,
    nombre: "Pavo con especias selectas",
    peso: 5.5,
    precio: 48.75,
    fecha: "2025-04-18",
    tipo: "especias",
    disponible: true
  },
  {
    id_pavo: 4,
    nombre: "Pavo relleno tradicional",
    peso: 6.2,
    precio: 59.99,
    fecha: "2025-04-20",
    tipo: "relleno",
    disponible: true
  }
];

let modoEdicion = false;
let idEditando = null;
let contadorID = Math.max(...pavos.map(p => p.id_pavo)) + 1;
document.getElementById('imagen').addEventListener('change', function (event) {
  const archivo = event.target.files[0];
  if (!archivo || !archivo.type.startsWith('image/')) {
    document.getElementById('preview').innerHTML = '<p class="text-danger">Archivo no válido.</p>';
    return;
  }

  const lector = new FileReader();
  lector.onload = function (e) {
    document.getElementById('preview').innerHTML = `<img src="${e.target.result}" class="img-thumbnail" style="max-width: 200px;">`;
  };
  lector.readAsDataURL(archivo);
});
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const precio = parseFloat(document.getElementById("precio").value);
  const fecha = document.getElementById("fecha").value;
  const tipo = document.getElementById("tipo").value;
  const disponible = document.getElementById("disponible").checked;
  const archivoImagen = document.getElementById("imagen").files[0];

  if (!archivoImagen && !modoEdicion) {
    alert("Debe seleccionar una imagen para el nuevo pavo.");
    return;
  }

  // Función que procesa y guarda el pavo, con la imagen en base64 (o null si no cambia)
  const procesarPavo = (imagenBase64) => {
    if (modoEdicion) {
      const index = pavos.findIndex(p => p.id_pavo === idEditando);
      if (index !== -1) {
        pavos[index] = { ...pavos[index], nombre, peso, precio, fecha, tipo, disponible, imagen: imagenBase64 || pavos[index].imagen };
      }
      modoEdicion = false;
      idEditando = null;
      btnGuardar.textContent = "Agregar Pavo";
    } else {
      const id_pavo = contadorID++;
      pavos.push({ id_pavo, nombre, peso, precio, fecha, tipo, disponible, imagen: imagenBase64 });
    }

    actualizarTabla();
    form.reset();
    document.getElementById("disponible").checked = true;
    document.getElementById("preview").innerHTML = "Aquí aparecerá la miniatura.";
  };

  if (archivoImagen) {
    const lector = new FileReader();
    lector.onload = function (e) {
      procesarPavo(e.target.result);
    };
    lector.readAsDataURL(archivoImagen);
  } else {
    procesarPavo(null);
  }
});

// Función para actualizar la tabla HTML con los pavos actuales
function actualizarTabla() {
  tabla.innerHTML = "";
  pavos.forEach((pavo) => {
    tabla.innerHTML += `
      <tr>
        <td>${pavo.id_pavo}</td>
        <td>
          ${pavo.nombre}
          ${pavo.imagen ? `<br><img src="${pavo.imagen}" class="img-thumbnail mt-2" style="max-width: 100px;">` : ''}
        </td>
        <td>${pavo.peso}</td>
        <td>$${pavo.precio.toFixed(2)}</td>
        <td>${pavo.fecha}</td>
        <td>${pavo.tipo}</td>
        <td>
          <input type="checkbox" ${pavo.disponible ? "checked" : ""} onchange="cambiarDisponibilidad(${pavo.id_pavo}, this.checked)">
        </td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="cargarFormulario(${pavo.id_pavo})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminar(${pavo.id_pavo})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Función para eliminar un pavo dado su ID
function eliminar(id) {
    pavos = pavos.filter(p => p.id_pavo !== id);
    actualizarTabla();
}

// Función para cargar datos de un pavo en el formulario para editarlo
function cargarFormulario(id) {
    const pavo = pavos.find(p => p.id_pavo === id);
    if (pavo) {
        document.getElementById("nombre").value = pavo.nombre;
        document.getElementById("peso").value = pavo.peso;
        document.getElementById("precio").value = pavo.precio;
        document.getElementById("fecha").value = pavo.fecha;
        document.getElementById("tipo").value = pavo.tipo;
        document.getElementById("disponible").checked = pavo.disponible;

        modoEdicion = true;
        idEditando = id;
        btnGuardar.textContent = "Guardar Cambios";
    }
}

// Función para cambiar el estado de disponibilidad de un pavo
function cambiarDisponibilidad(id, valor) {
    const index = pavos.findIndex(p => p.id_pavo === id);
    if (index !== -1) {
        pavos[index].disponible = valor;
    }
}

// Función para aplicar filtros de búsqueda y mostrar resultados filtrados (no usado en el resto del código)
function aplicarFiltros() {
  const tipo = document.getElementById('tipo').value;
  const pesoMin = parseFloat(document.getElementById('peso-min').value) || 0;
  const pesoMax = parseFloat(document.getElementById('peso-max').value) || Infinity;
  const precioMax = parseFloat(document.getElementById('precio-max').value) || Infinity;
  const terminoBusqueda = document.getElementById('busqueda').value.toLowerCase();

  const resultados = productos.filter(producto => {
    return (tipo === '' || producto.tipo === tipo) &&
           producto.peso >= pesoMin &&
           producto.peso <= pesoMax &&
           producto.precio <= precioMax &&
           (producto.nombre.toLowerCase().includes(terminoBusqueda) || 
            producto.descripcion.toLowerCase().includes(terminoBusqueda));
  });

  mostrarProductos(resultados);// Mostrar productos filtrados (función externa)
}