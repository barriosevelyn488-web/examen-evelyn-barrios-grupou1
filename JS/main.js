document.addEventListener("DOMContentLoaded", () => {

    inicializarPortalEmpleado();
    inicializarPortalAdministrador();
});

function inicializarPortalEmpleado() {

    const formularioNuevoTicket =
        document.getElementById("formularioNuevoTicket");

    if (!formularioNuevoTicket) {
        return;
    }

    asignarFechaActual();

    formularioNuevoTicket.addEventListener(
        "submit",
        registrarNuevoTicket
    );

    const botonCerrarSesionEmpleado =
        document.getElementById("botonCerrarSesionEmpleado");

    botonCerrarSesionEmpleado.addEventListener(
        "click",
        cerrarSesionUsuario
    );
}

function inicializarPortalAdministrador() {

    const contenedorTarjetasTickets =
        document.getElementById("contenedorTarjetasTickets");

    if (!contenedorTarjetasTickets) {
        return;
    }

    cargarTicketsAdministrador();

    configurarFiltrosEstado();

    configurarModalAdministrador();

    const botonCerrarSesionAdmin =
        document.getElementById("botonCerrarSesionAdmin");

    botonCerrarSesionAdmin.addEventListener(
        "click",
        cerrarSesionUsuario
    );
}

function asignarFechaActual() {

    const inputFechaCreacion =
        document.getElementById("inputFechaCreacion");

    if (!inputFechaCreacion) {
        return;
    }

    const fechaActual =
        new Date().toISOString().split("T")[0];

    inputFechaCreacion.value = fechaActual;
}

async function registrarNuevoTicket(evento) {

    evento.preventDefault();

    const ticket = obtenerDatosFormularioTicket();

    if (!validarFormularioTicket(ticket)) {
        return;
    }

    const respuesta =
        await guardarNuevoTicket(ticket);

    const mensajeEmpleado =
        document.getElementById("mensajeEmpleado");

    if (respuesta.success) {

        mensajeEmpleado.className =
            "mensaje-exito";

        mensajeEmpleado.textContent =
            "Ticket registrado correctamente";

        document
            .getElementById("formularioNuevoTicket")
            .reset();

        asignarFechaActual();

    } else {

        mensajeEmpleado.className =
            "mensaje-error";

        mensajeEmpleado.textContent =
            respuesta.message ||
            "Error al registrar ticket";
    }
}

function obtenerDatosFormularioTicket() {

    return {

        nombreSolicitante:
            document.getElementById("inputNombreSolicitante").value.trim(),

        departamento:
            document.getElementById("inputDepartamento").value.trim(),

        tipoProblema:
            document.getElementById("inputTipoProblema").value,

        descripcionProblema:
            document.getElementById("inputDescripcionProblema").value.trim(),

        prioridad:
            document.getElementById("inputPrioridad").value,

        fechaCreacion:
            document.getElementById("inputFechaCreacion").value
    };
}

function validarFormularioTicket(ticket) {

    const valores = Object.values(ticket);

    const formularioValido =
        valores.every(valor => valor !== "");

    if (!formularioValido) {

        alert(
            "Todos los campos son obligatorios"
        );

        return false;
    }

    return true;
}

async function cargarTicketsAdministrador() {

    const tickets =
        await obtenerTicketsRegistrados();

    renderizarTarjetasTickets(tickets);
}

function configurarFiltrosEstado() {

    const botonesFiltro =
        document.querySelectorAll(".boton-filtro");

    botonesFiltro.forEach(boton => {

        boton.addEventListener(
            "click",
            async () => {

                const estadoFiltro =
                    boton.dataset.estado;

                let tickets =
                    await obtenerTicketsRegistrados();

                if (estadoFiltro !== "Todos") {

                    tickets = tickets.filter(
                        ticket =>
                            ticket.estado === estadoFiltro
                    );
                }

                renderizarTarjetasTickets(tickets);
            }
        );
    });
}

function configurarModalAdministrador() {

    const cerrarModalDetalle =
        document.getElementById("cerrarModalDetalle");

    const botonGuardarEstado =
        document.getElementById("botonGuardarEstado");

    const botonEliminarTicket =
        document.getElementById("botonEliminarTicket");

    if (!cerrarModalDetalle) {
        return;
    }

    cerrarModalDetalle.addEventListener(
        "click",
        cerrarModalDetalleTicket
    );

    botonGuardarEstado.addEventListener(
        "click",
        guardarEstadoTicketSeleccionado
    );

    botonEliminarTicket.addEventListener(
        "click",
        eliminarTicketActual
    );
}

function cerrarModalDetalleTicket() {

    const modalDetalleTicket =
        document.getElementById("modalDetalleTicket");

    modalDetalleTicket.classList.add("oculto");
}

async function guardarEstadoTicketSeleccionado() {

    if (!ticketSeleccionado) {
        return;
    }

    const nuevoEstado =
        document.getElementById(
            "selectEstadoTicket"
        ).value;

    const respuesta =
        await actualizarEstadoTicket(
            ticketSeleccionado.id,
            nuevoEstado
        );

    if (!respuesta.success) {

        alert(
            "No fue posible actualizar el estado"
        );

        return;
    }

    cerrarModalDetalleTicket();

    await cargarTicketsAdministrador();
}

async function eliminarTicketActual() {

    if (!ticketSeleccionado) {
        return;
    }

    const confirmar =
        confirm(
            "¿Desea eliminar este ticket?"
        );

    if (!confirmar) {
        return;
    }

    const respuesta =
        await eliminarTicketSeleccionado(
            ticketSeleccionado.id
        );

    if (!respuesta.success) {

        alert(
            "No fue posible eliminar el ticket"
        );

        return;
    }

    cerrarModalDetalleTicket();

    await cargarTicketsAdministrador();
}

function cerrarSesionUsuario() {

    sessionStorage.removeItem(
        "usuarioActivo"
    );

    window.location.href = "../index.html";
}