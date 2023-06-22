(function () {

  // ******* SELECTORES *******
  const formulario = document.querySelector("#formulario");

  // ******* EVENT LISTENERS *******
  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    formulario.addEventListener("submit", validarCliente);
  });

  // ******* FUNCIONES *******

  //************** VALIDAR INPUTS DEL FORMULARIO **************************** */

  function validarCliente(e) {
    e.preventDefault();

    // Leer todos los inputs del formulario
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    // CREAR UN OBJETO CON LOS DATOS DEL CLIENTE

    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
      id: Date.now(),
    };

    crearNuevoCliente(cliente);
  }

  //************ CREAR NUEVO CLIENTE ********************/

  function crearNuevoCliente(cliente) {
    // Creamos una transaccion
    const transaction = DB.transaction(["crm"], "readwrite");

    // Definimos el objectStore
    const objectStore = transaction.objectStore("crm");

    // Añadimos el objeto con el cliente
    objectStore.add(cliente);

    // Si hay un error
    transaction.onerror = () => {
      imprimirAlerta("Hubo un error", "error");
    };

    // Si todo esta OK
    transaction.oncomplete = () => {
      imprimirAlerta("Cliente agregado a la DB");

      // Despues de 3 segundos devolvemos al usuario a la pagina principal
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };
  }


})();
