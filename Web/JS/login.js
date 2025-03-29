window.onload = async function (){
    let status = localStorage.getItem("login");
    if (status === "ok") {
        location.href = "index.html";
    }
}

document.getElementById("btn-login").addEventListener("click", async function () {
    let inputEmail = document.getElementById("email-user");
    let inputPassword = document.getElementById("password-user");

    // Validación de campos
    if (inputEmail.value.trim().length <= 0 || inputPassword.value.trim().length <= 0) {
        alert("Complete todos los campos");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                correo: inputEmail.value,
                contrasena: inputPassword.value
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Credenciales incorrectas");
        }

        if (result.message === "Bienvenido") {
            localStorage.setItem("login", "ok");
            localStorage.setItem("user", result.user.id);
            location.href = "index.html";
        } else {
            alert(result.message || "Respuesta inesperada del servidor");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert(error.message || "Error al conectar con el servidor");
    }
});