const URL_API_TICKETS = "http://localhost:3000/api/tickets";

async function obtenerTicketsRegistrados() {

    try {

        const respuesta = await fetch(URL_API_TICKETS);

        return await respuesta.json();

    } catch (error) {

        console.error("Error obteniendo tickets:", error);

        return [];
    }
}

async function guardarNuevoTicket(datosTicket) {

    try {

        const respuesta = await fetch(URL_API_TICKETS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosTicket)
        });

        return await respuesta.json();

    } catch (error) {

        console.error("Error guardando ticket:", error);

        return {
            success: false
        };
    }
}

async function actualizarEstadoTicket(idTicket, nuevoEstado) {

    try {

        const respuesta = await fetch(
            `${URL_API_TICKETS}/${idTicket}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        );

        return await respuesta.json();

    } catch (error) {

        console.error(error);

        return {
            success: false
        };
    }
}

async function eliminarTicketSeleccionado(idTicket) {

    try {

        const respuesta = await fetch(
            `${URL_API_TICKETS}/${idTicket}`,
            {
                method: "DELETE"
            }
        );

        return await respuesta.json();

    } catch (error) {

        console.error(error);

        return {
            success: false
        };
    }
}