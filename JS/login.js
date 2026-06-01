// CORRECCIÓN: Apuntar a la URL de producción en Render en lugar de localhost
const URL_API = "https://examen-evelyn-barrios-grupou1.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    inicializarEventosLogin();
});

function inicializarEventosLogin() {

    const botonAbrirModalEmpleado = document.getElementById("botonAbrirModalEmpleado");
    const botonAbrirModalAdmin = document.getElementById("botonAbrirModalAdmin");

    const modalEmpleado = document.getElementById("modalEmpleado");
    const modalAdmin = document.getElementById("modalAdmin");

    const cerrarModalEmpleado = document.getElementById("cerrarModalEmpleado");
    const cerrarModalAdmin = document.getElementById("cerrarModalAdmin");

    const formularioLoginEmpleado = document.getElementById("formularioLoginEmpleado");
    const formularioLoginAdmin = document.getElementById("formularioLoginAdmin");

    if (botonAbrirModalEmpleado) {
        botonAbrirModalEmpleado.addEventListener("click", () => {
            modalEmpleado.classList.remove("oculto");
        });
    }

    if (botonAbrirModalAdmin) {
        botonAbrirModalAdmin.addEventListener("click", () => {
            modalAdmin.classList.remove("oculto");
        });
    }

    if (cerrarModalEmpleado) {
        cerrarModalEmpleado.addEventListener("click", () => {
            modalEmpleado.classList.add("oculto");
        });
    }

    if (cerrarModalAdmin) {
        cerrarModalAdmin.addEventListener("click", () => {
            modalAdmin.classList.add("oculto");
        });
    }

    if (formularioLoginEmpleado) {
        formularioLoginEmpleado.addEventListener("submit", iniciarSesionEmpleado);
    }

    if (formularioLoginAdmin) {
        formularioLoginAdmin.addEventListener("submit", iniciarSesionAdministrador);
    }
}

async function iniciarSesionEmpleado(evento) {

    evento.preventDefault();

    const correo = document.getElementById("correoEmpleado").value.trim();
    const password = document.getElementById("passwordEmpleado").value.trim();

    await validarCredencialesUsuario(correo, password, "empleado");
}

async function iniciarSesionAdministrador(evento) {

    evento.preventDefault();

    const correo = document.getElementById("correoAdmin").value.trim();
    const password = document.getElementById("passwordAdmin").value.trim();

    await validarCredencialesUsuario(correo, password, "admin");
}

async function validarCredencialesUsuario(correo, password, rolEsperado) {

    try {

        const respuesta = await fetch(`${URL_API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const datos = await respuesta.json();

        if (!datos.success) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        if (datos.usuario.rol !== rolEsperado) {
            alert("No posee permisos para esta sección");
            return;
        }

        sessionStorage.setItem(
            "usuarioActivo",
            JSON.stringify(datos.usuario)
        );

        if (rolEsperado === "admin") {
            window.location.href = "../HTML/admin.html";
        } else {
            window.location.href = "../HTML/empleado.html";
        }

    } catch (error) {

        console.error(error);

        alert("Error al iniciar sesión");
    }
}