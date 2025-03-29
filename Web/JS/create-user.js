document.getElementById("btn-register").addEventListener("click", async function () {
    let inputName = document.getElementById("name-user").value;
    let inputEmail = document.getElementById("email-user").value;
    let inputPassword = document.getElementById("password-user").value;

    if (inputName.trim().length <= 0 || inputEmail.trim().length <= 0 || inputPassword.trim().length <= 0) {
        alert("Complete los campos");
        return false;
    }

    try {
        const response = await fetch('http://localhost:8000/usuarios/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nombre: inputName,
                correo: inputEmail, 
                contrasena: inputPassword 
            })
        });

        if (response.ok) {
            console.log('Usuario creado exitosamente');
            location.href = "login.html";
            fetchitems();
        }
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
});