const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const aplicacion = express();
const PUERTO = 3000;

aplicacion.use(cors());
aplicacion.use(express.json());

const rutaUsuarios = path.join(
    __dirname,
    "../PERSISTENCIA/usuarios.json"
);

const rutaTickets = path.join(
    __dirname,
    "../PERSISTENCIA/tickets.json"
);

/* ==================================
   FUNCIONES DE LECTURA Y ESCRITURA
================================== */

async function obtenerUsuariosRegistrados() {

    try {

        const usuarios =
            await fs.readFile(
                rutaUsuarios,
                "utf8"
            );

        return JSON.parse(usuarios);

    } catch (error) {

        console.error(
            "Error obteniendo usuarios:",
            error
        );

        return [];
    }
}

async function obtenerTicketsRegistrados() {

    try {

        const tickets =
            await fs.readFile(
                rutaTickets,
                "utf8"
            );

        return JSON.parse(tickets);

    } catch (error) {

        console.error(
            "Error obteniendo tickets:",
            error
        );

        return [];
    }
}

async function guardarTicketsActualizados(tickets) {

    try {

        await fs.writeFile(
            rutaTickets,
            JSON.stringify(
                tickets,
                null,
                2
            )
        );

    } catch (error) {

        console.error(
            "Error guardando tickets:",
            error
        );

        throw error;
    }
}

/* ==================================
   LOGIN
================================== */

aplicacion.post(
    "/api/login",
    async (request, response) => {

        try {

            const {
                correo,
                password
            } = request.body;

            const usuarios =
                await obtenerUsuariosRegistrados();

            const usuarioEncontrado =
                usuarios.find(
                    usuario =>
                        usuario.correo === correo &&
                        usuario.password === password
                );

            if (!usuarioEncontrado) {

                return response.status(401).json({
                    success: false,
                    message:
                        "Credenciales incorrectas"
                });
            }

            response.json({
                success: true,
                usuario: usuarioEncontrado
            });

        } catch (error) {

            response.status(500).json({
                success: false,
                message:
                    "Error interno del servidor"
            });
        }
    }
);

/* ==================================
   OBTENER TODOS LOS TICKETS
================================== */

aplicacion.get(
    "/api/tickets",
    async (request, response) => {

        try {

            const tickets =
                await obtenerTicketsRegistrados();

            tickets.sort(
                (ticketA, ticketB) =>
                    new Date(ticketB.fechaCreacion) -
                    new Date(ticketA.fechaCreacion)
            );

            response.json(tickets);

        } catch (error) {

            response.status(500).json({
                success: false,
                message:
                    "Error obteniendo tickets"
            });
        }
    }
);

/* ==================================
   REGISTRAR TICKET
================================== */

aplicacion.post(
    "/api/tickets",
    async (request, response) => {

        try {

            const nuevoTicket =
                request.body;

            const tickets =
                await obtenerTicketsRegistrados();

            const ticketDuplicado =
                tickets.find(ticket =>

                    ticket.nombreSolicitante
                        .trim()
                        .toLowerCase()
                    ===
                    nuevoTicket.nombreSolicitante
                        .trim()
                        .toLowerCase()

                    &&

                    ticket.departamento
                        .trim()
                        .toLowerCase()
                    ===
                    nuevoTicket.departamento
                        .trim()
                        .toLowerCase()

                    &&

                    ticket.tipoProblema
                        .trim()
                        .toLowerCase()
                    ===
                    nuevoTicket.tipoProblema
                        .trim()
                        .toLowerCase()

                    &&

                    ticket.descripcionProblema
                        .trim()
                        .toLowerCase()
                    ===
                    nuevoTicket.descripcionProblema
                        .trim()
                        .toLowerCase()

                    &&

                    ticket.estado !== "Resuelto"
                );

            if (ticketDuplicado) {

                return response.status(409).json({
                    success: false,
                    message:
                        "Ya existe un ticket abierto con esta información"
                });
            }

            nuevoTicket.id = Date.now();

            nuevoTicket.estado =
                "Pendiente";

            tickets.push(nuevoTicket);

            await guardarTicketsActualizados(
                tickets
            );

            response.status(201).json({
                success: true,
                ticket: nuevoTicket
            });

        } catch (error) {

            response.status(500).json({
                success: false,
                message:
                    "Error registrando ticket"
            });
        }
    }
);

/* ==================================
   ACTUALIZAR ESTADO
================================== */

aplicacion.put(
    "/api/tickets/:id",
    async (request, response) => {

        try {

            const idTicket =
                Number(
                    request.params.id
                );

            const {
                estado
            } = request.body;

            const tickets =
                await obtenerTicketsRegistrados();

            const posicionTicket =
                tickets.findIndex(
                    ticket =>
                        ticket.id === idTicket
                );

            if (posicionTicket === -1) {

                return response.status(404).json({
                    success: false,
                    message:
                        "Ticket no encontrado"
                });
            }

            tickets[
                posicionTicket
            ].estado = estado;

            await guardarTicketsActualizados(
                tickets
            );

            response.json({
                success: true,
                ticket:
                    tickets[posicionTicket]
            });

        } catch (error) {

            response.status(500).json({
                success: false,
                message:
                    "Error actualizando ticket"
            });
        }
    }
);

/* ==================================
   ELIMINAR TICKET
================================== */

aplicacion.delete(
    "/api/tickets/:id",
    async (request, response) => {

        try {

            const idTicket =
                Number(
                    request.params.id
                );

            const tickets =
                await obtenerTicketsRegistrados();

            const ticketsActualizados =
                tickets.filter(
                    ticket =>
                        ticket.id !== idTicket
                );

            await guardarTicketsActualizados(
                ticketsActualizados
            );

            response.json({
                success: true,
                message:
                    "Ticket eliminado correctamente"
            });

        } catch (error) {

            response.status(500).json({
                success: false,
                message:
                    "Error eliminando ticket"
            });
        }
    }
);

/* ==================================
   INICIAR SERVIDOR
================================== */

aplicacion.listen(
    PUERTO,
    () => {

        console.log(
            `Servidor ejecutándose en http://localhost:${PUERTO}`
        );
    }
);