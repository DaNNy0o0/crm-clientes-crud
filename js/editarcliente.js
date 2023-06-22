(function () {
  let idCliente;

  // ******* SELECTORES DE CAMPOS DEL FORMULARIO *******

  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");

  const formulario = document.querySelector("#formulario");

  // ******* EVENT LISTENER *******

  document.addEventListener("DOMContentLoaded", () => {
    // Conectamos a la DB
    conectarDB();

    // Llamamos la funcion de actualizar el cliente al mandar el submit en edicion
    formulario.addEventListener("submit", actualizarCliente);

    // Verificar el ID de la url
    const parametrosURL = new URLSearchParams(window.location.search);

    // Guardamos el ID del cliente en la constante IdCliente
    idCliente = parametrosURL.get("id");

    // Si existe en la DB, se obtiene el cliente ocmpleto
    if (idCliente) {
      // Retrasamos la ejecucion de la funcion para hacerla asincrona y que le de tiempo a cargar
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 100);
    }
  });

  // ******* FUNCIONES *******

  //************** OBTENER CLIENTE POR SU ID **************************** */

  function obtenerCliente(id) {
    // Iniciamos una transacción para realizar una accion en la DB
    const transaction = DB.transaction(["crm"], "readwrite");

    // Creamos el objectStore para interactuar con la BD
    const objectStore = transaction.objectStore("crm");

    // Abrimos un cursor para recorrer las entradas de la DB
    const cliente = objectStore.openCursor();

    // Si todo va OK
    cliente.onsuccess = function (e) {
      // Asignamos cada resultado al cursor
      const cursor = e.target.result;

      // Si existe
      if (cursor) {
        // Si el id de ese registro es igual al id que le estamos pasando desde la url
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }

        // Recorre todas las entradas hasta el final
        cursor.continue();
      }
    };
  }

  function actualizarCliente(e) {
    e.preventDefault();

    // Validacion de los campos del formulario
    if (
      nombreInput.value === "" ||
      emailInput.value === "" ||
      empresaInput.value === "" ||
      telefonoInput.value === ""
    ) {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    // Si pasa la validación, se actualiza el cliente
    const clienteActualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      empresa: empresaInput.value,
      telefono: telefonoInput.value,
      id: Number(idCliente), // Convertimos el idCliente a numero para que lo encuentre
    };

    // Iniciamos la transaccion/accion que vamos a realizar
    const transaction = DB.transaction(["crm"], "readwrite");

    // Creamos el objeto de la transaccion
    const objectStore = transaction.objectStore("crm");

    // Colocamos el objeto actualizado de la transaccion en la db
    objectStore.put(clienteActualizado);

    // Si todo ha ido bien mostramos mensaje y devolvemos al usuario al index
    transaction.oncomplete = function () {
      imprimirAlerta("Cambios guardados correctamente");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };

    // Si hay un error
    transaction.onerror = function (e) {
      imprimirAlerta("Hubo un error", "error");
      // Mostramos el error que da IndexedDB en la consola
      console.log(e.target.error.message);
    };
  }

  //************** RELLENAR EL FORMULARIO CON EL ID SELECCIONADO PARA EDICION **************************** */

  function llenarFormulario(datos) {
    // Extraemos los campos del cursor que le pasamos como "datos"
    const { nombre, email, telefono, empresa } = datos;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  //************** CONECTAR A LA BASE DE DATOS **************************** */

  function conectarDB() {
    // Conectar a la BD
    let abrirConexion = window.indexedDB.open("crm", 1);

    // Si hay un error
    abrirConexion.onerror = function () {
      console.log("No se pudo crear la base de datos");
    };

    // Si todo está bien
    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  }
})();
