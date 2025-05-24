// Lista inicial de usuarios con sus datos
let usuarios = [
  { id: 1, nombre: "Joshúa Javier", apellido:"Castillo Merejildo", correo: "joshuacastillom004@hotmail.com", pwd: "1234567GMN", cedula: "0951234567" },
  { id: 2, nombre: "Douglas Josue", apellido:"Anastacio Figueroa", correo: "douglas.anastacio@hotmail.com", pwd: "anastacio123", cedula: "0952345678" },
  { id: 3, nombre: "Erick Paul", apellido: "Goyes Recalde", correo: "erick.goyes@hotmail.com", pwd: "goyes456", cedula: "0953456789" },
  { id: 4, nombre: "Ariel Alberto", apellido: "Solis Pino" , correo: "ariel.solis@hotmail.com", pwd: "solis789", cedula: "0954567890" },
  { id: 5, nombre: "Joffre Daniel", apellido: "Yagual Ureta", correo: "joffre.yagual@hotmail.com", pwd: "yagual101", cedula: "0955678901" }
];
let contadorUsuario = Math.max(...usuarios.map(u => u.id)) + 1;


let modoEdicion = false;
let indiceEditando = null;

const form = document.getElementById('formRegistro');
const tablaUsuarios = document.getElementById('tablaUsuarios');
const btnRegistrar = document.getElementById('btnRegistrar');
const msgRegistro = document.getElementById('msgRegistro');

form?.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = document.getElementById('regNombre').value;
  const apellido = document.getElementById('regApellido').value;
  const correo = document.getElementById('regCorreo').value;
  const pwd = document.getElementById('regPassword').value;
  const cedula= document.getElementById('regCedula').value;
  if (modoEdicion) {
    usuarios[indiceEditando] = { ...usuarios[indiceEditando], nombre, apellido, correo, pwd, cedula };
    modoEdicion = false;
    indiceEditando = null;
    btnRegistrar.textContent = "Registrar";
    msgRegistro.textContent = "Usuario actualizado correctamente.";
  } else {
    if (usuarios.find(u => u.correo === correo)) {
      msgRegistro.textContent = 'Correo ya registrado';
      return;
    }
    usuarios.push({ id: contadorUsuario++, nombre, apellido, correo, pwd, cedula });
    msgRegistro.textContent = 'Registro exitoso';
  }


  form.reset();
  actualizarTabla();
});

// Función para actualizar la tabla HTML con los usuarios actuales
function actualizarTabla() {
  tablaUsuarios.innerHTML = "";
  usuarios.forEach((u, index) => {
    tablaUsuarios.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.apellido}</td>
        <td>${u.correo}</td>
        <td>${u.cedula}</td>
        <td>
          <button onclick="editarUsuario(${index})">Editar</button>
          <button onclick="eliminarUsuario(${index})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Función para cargar los datos de un usuario en el formulario y activar modo edición
function editarUsuario(index) {
  const usuario = usuarios[index];
  document.getElementById('regNombre').value = usuario.nombre;
   document.getElementById('regApellido').value = usuario.apellido;
  document.getElementById('regCorreo').value = usuario.correo;
  document.getElementById('regPassword').value = usuario.pwd;
  document.getElementById('regCedula').value = usuario.cedula;

  modoEdicion = true;
  indiceEditando = index;
  btnRegistrar.textContent = "Guardar Cambios";
  msgRegistro.textContent = "Editando usuario...";
}

// Función para eliminar un usuario del arreglo y actualizar la tabla
function eliminarUsuario(index) {
  usuarios.splice(index, 1);
  actualizarTabla();
  msgRegistro.textContent = "Usuario eliminado.";
}
// Al cargar la página, actualizar la tabla para mostrar usuarios
document.addEventListener('DOMContentLoaded', actualizarTabla);
