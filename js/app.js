(function () {
  let DB;

  // ******* SELECTORES *******

  // Seleccion del div donde se va a insertar
  const listadoClientes = document.querySelector("#listado-clientes");

  // ******* EVENT LISTENERS *******

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      crearDB();

      if (window.indexedDB.open("crm", 1)) {
        obtenerClientes();
      }
    }, 2000);

    listadoClientes.addEventListener("click", eliminarRegistro);
  });

  // ******* FUNCIONES *******

  //************** CREAR LA BASE DE DATOS DE INDEXEDDB **************************** */

  function crearDB() {
    // Crear una base de datos v1.0
    let crearDB = window.indexedDB.open("crm", 1);

    // Si hay un error
    crearDB.onerror = function () {
      console.log("No se pudo crear la base de datos");
    };

    // Si todo está bien
    crearDB.onsuccess = function () {
      DB = crearDB.result;
    };

    // Configuracion de la db
    crearDB.onupgradeneeded = (e) => {
      const db = e.target.result;

      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Definir las columnas
      objectStore.createIndex("Nombre", "nombre", { unique: false });
      objectStore.createIndex("Email", "email", { unique: true });
      objectStore.createIndex("Teléfono", "telefono", { unique: false });
      objectStore.createIndex("Empresa", "empresa", { unique: false });
      objectStore.createIndex("ID", "id", { unique: false });

      console.log("DB Lista y creada!");
    };

    // ==================================================================
  }

  //************** OBTENER EL LISTADO DEL CLIENTES DE INDEXEDDB **************************** */

  function obtenerClientes() {
    // Abrimos conexion con la base de datos existente
    const abrirConexion = window.indexedDB.open("crm", 1);

    // En caso de error
    abrirConexion.onerror = () => {
      console.log("Hubo un error");
    };

    // En caso de que todo vaya bien
    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result;

      // Traemos la base de datos de crm y el Objeto que se encuentra dentro
      const objectStore = DB.transaction("crm").objectStore("crm");

      // Traemos cada registro mediante el uso de cursores
      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;

        // Si hay un registro, el cursor lo trae y lo inserta en el html
        if (cursor) {
          const { nombre, email, telefono, empresa, id } = cursor.value;

          // Se inserta usando "+=" para que se vaya concatenando
          listadoClientes.innerHTML += `
            <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${telefono}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${empresa}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                </td>
            </tr>
        `;

          // Sigue al siguente registro que haya en la DB
          cursor.continue();
        } else {
          // Cuando ya no hay mas registros
          console.log("No hay mas registros");
        }
      };
    };
  }

  //************** ELIMINAR UN REGISTRO **************************** */

  function eliminarRegistro(e) {
    // Si el elemento donde se hace click contiene la clase de "eliminar"
    if (e.target.classList.contains("eliminar")) {
      // Asignamos el id ubicado en el dataset del elemento
      const idEliminar = Number(e.target.dataset.cliente);
      // Solicitamos confirmacion
      const confirmacion = confirm("¿Deseas eliminar este cliente?");
      // Si la confirmacion es positiva
      if (confirmacion) {
        // Iniciamos la transaccion
        const transaction = DB.transaction(["crm"], "readwrite");
        // Creamos el objeto de la transaccion
        const objectStore = transaction.objectStore("crm");

        // Eliminamos el objeto con los datos del registro
        objectStore.delete(idEliminar);

        // Si todo esta OK se muestra en consola y se elimina del dom mediante traversing
        transaction.oncomplete = () => {
          console.log("Registro eliminado correctamente");
          e.target.parentElement.parentElement.remove();
        };

        // Si hubo un error
        transaction.onerror = () => {
          console.error("No se pudo eliminar");
        };
      }
    }
  }
})();
