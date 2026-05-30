let ticketSeleccionado = null;

function obtenerClaseEstado(estadoTicket) {

    switch (estadoTicket) {

        case "Pendiente":
            return "estado-pendiente";

        case "En Proceso":
            return "estado-proceso";

        case "Resuelto":
            return "estado-resuelto";

        default:
            return "";
    }
}

function renderizarTarjetasTickets(tickets) {

    const contenedorTarjetasTickets =
        document.getElementById("contenedorTarjetasTickets");

    if (!contenedorTarjetasTickets) {
        return;
    }

    contenedorTarjetasTickets.innerHTML = "";

    if (tickets.length === 0) {

        contenedorTarjetasTickets.innerHTML = `
            <h3>No existen tickets registrados</h3>
        `;

        return;
    }

    tickets.forEach(ticket => {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("tarjeta-ticket");

        tarjeta.innerHTML = `
            <h3>${ticket.nombreSolicitante}</h3>

            <p>
                <strong>Departamento:</strong>
                ${ticket.departamento}
            </p>

            <p>
                <strong>Prioridad:</strong>
                ${ticket.prioridad}
            </p>

            <p>
                <strong>Fecha:</strong>
                ${ticket.fechaCreacion}
            </p>

            <p>
                <span class="${obtenerClaseEstado(ticket.estado)}">
                    ${ticket.estado}
                </span>
            </p>

            <br>

            <button
                class="boton-primario boton-ver-detalle"
                data-id="${ticket.id}">
                Ver Detalle
            </button>
        `;

        contenedorTarjetasTickets.appendChild(tarjeta);
    });

    agregarEventosDetalleTicket(tickets);
}

function agregarEventosDetalleTicket(tickets) {

    const botonesDetalle =
        document.querySelectorAll(".boton-ver-detalle");

    botonesDetalle.forEach(boton => {

        boton.addEventListener("click", () => {

            const idTicket =
                Number(boton.dataset.id);

            const ticketEncontrado =
                tickets.find(ticket =>
                    ticket.id === idTicket
                );

            if (!ticketEncontrado) {
                return;
            }

            mostrarModalDetalleTicket(ticketEncontrado);
        });
    });
}

function mostrarModalDetalleTicket(ticket) {

    ticketSeleccionado = ticket;

    const modalDetalleTicket =
        document.getElementById("modalDetalleTicket");

    const contenidoDetalleTicket =
        document.getElementById("contenidoDetalleTicket");

    contenidoDetalleTicket.innerHTML = `
        <div class="detalle-ticket">
            <strong>Solicitante:</strong>
            ${ticket.nombreSolicitante}
        </div>

        <div class="detalle-ticket">
            <strong>Departamento:</strong>
            ${ticket.departamento}
        </div>

        <div class="detalle-ticket">
            <strong>Tipo Problema:</strong>
            ${ticket.tipoProblema}
        </div>

        <div class="detalle-ticket">
            <strong>Descripción:</strong>
            ${ticket.descripcionProblema}
        </div>

        <div class="detalle-ticket">
            <strong>Prioridad:</strong>
            ${ticket.prioridad}
        </div>

        <div class="detalle-ticket">
            <strong>Fecha:</strong>
            ${ticket.fechaCreacion}
        </div>

        <br>

        <label>
            Estado
        </label>

        <select id="selectEstadoTicket">

            <option
                value="Pendiente"
                ${ticket.estado === "Pendiente" ? "selected" : ""}>
                Pendiente
            </option>

            <option
                value="En Proceso"
                ${ticket.estado === "En Proceso" ? "selected" : ""}>
                En Proceso
            </option>

            <option
                value="Resuelto"
                ${ticket.estado === "Resuelto" ? "selected" : ""}>
                Resuelto
            </option>

        </select>
    `;

    modalDetalleTicket.classList.remove("oculto");
}