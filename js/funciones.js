let DB;

//************** CONECTAR A LA BD **************************** */

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

//************** ALERTAS **************************** */

function imprimirAlerta(mensaje, tipo) {
  const alerta = document.querySelector(".alerta");

  if (!alerta) {
    // Crear alerta
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add(
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "border",
      "alerta"
    );

    if (tipo === "error") {
      divMensaje.classList.add("bg-red-100", "border-red-400", "text-red-700");
    } else {
      divMensaje.classList.add(
        "bg-green-100",
        "border-green-400",
        "text-green-700"
      );
    }

    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }
}
