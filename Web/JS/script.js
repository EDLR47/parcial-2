window.onload = async function(){
    let status = localStorage.getItem("login");
    if (status !== "ok") {
        location.href = "login.html";
    }

    document.getElementById("logout").addEventListener("click", function (){
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    location.href = "login.html";
    });
};

document.getElementById("listarProductos").addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("formAgregar").style.display = "none";
    document.getElementById("formActualizar").style.display = "none";
    document.getElementById("formBorrar").style.display = "none";
    document.getElementById("tabla").style.display = "block";
    fetchitems();
})

document.getElementById("agregarProducto").addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("tabla").style.display = "none";
    document.getElementById("formActualizar").style.display = "none";
    document.getElementById("formBorrar").style.display = "none";
    document.getElementById("formAgregar").style.display = "block";
});

document.getElementById("itemForm").addEventListener('submit', async function(event) {
    event.preventDefault();

    let user = localStorage.getItem("user");

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;

    try {
        const response = await fetch('http://localhost:8000/productos/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, cantidad, precio, usuario_id: parseInt(user) })
        });

        if (response.ok) {
        document.getElementById("itemForm").reset();
        document.getElementById("formAgregar").style.display = "none";
        document.getElementById("tabla").style.display = "block";
        fetchitems();
        }
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
});

document.getElementById("actualizarProducto").addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("tabla").style.display = "none";
    document.getElementById("formAgregar").style.display = "none";
    document.getElementById("formBorrar").style.display = "none";
    document.getElementById("formActualizar").style.display = "block";
});

document.getElementById("btnUpdate").addEventListener('click', async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('idUpdate').value;
    const nombre = document.getElementById('nombreUpdate').value;
    const descripcion = document.getElementById('descripcionUpdate').value;
    const cantidad = document.getElementById('cantidadUpdate').value;
    const precio = document.getElementById('precioUpdate').value;
    const user = localStorage.getItem("user");

    try {
        const response = await fetch(`http://localhost:8000/productos/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                cantidad: parseInt(cantidad),
                precio: parseFloat(precio),
                usuario_id: parseInt(user)
            })
        });

        if (response.ok) {
            document.getElementById("itemForm").reset();
            document.getElementById("tabla").style.display = "block";
            document.getElementById("formActualizar").style.display = "none";
            fetchitems();
        } else {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});

document.getElementById("borrarProducto").addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("tabla").style.display = "none";
    document.getElementById("formAgregar").style.display = "none";
    document.getElementById("formActualizar").style.display = "none";
    document.getElementById("formBorrar").style.display = "block";
});

document.getElementById("btnBorrar").addEventListener('click', async function(event) {
    event.preventDefault();
    
    const id = document.getElementById('idBorrar').value;
    const user = localStorage.getItem("user");

    try {
        const response = await fetch(`http://localhost:8000/productos/borrar/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ usuario_id: parseInt(user) })
        });

        if (response.ok) {
            document.getElementById("itemForm").reset();
            document.getElementById("tabla").style.display = "block";
            document.getElementById("formBorrar").style.display = "none";
            fetchitems();
        } else {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});

const itemsTable = document.getElementById('itemsTable');

async function fetchitems() {
    const usuario_id = localStorage.getItem("user");

    fetch(`http://localhost:8000/productos/listar/${usuario_id}`)
        .then(response => response.json())
        .then(data => {
            itemsTable.innerHTML = ''; // ojoooooo, esta linea solo limpia la tabla
            data.forEach(producto => {
                const row = document.createElement('tr');
                
                const campoID = document.createElement('td');
                campoID.textContent = producto.id;
                row.appendChild(campoID);
                
                const campoNombre = document.createElement('td');
                campoNombre.textContent = producto.nombre;
                row.appendChild(campoNombre);
                
                const campoDes = document.createElement('td');
                campoDes.textContent = producto.descripcion;
                row.appendChild(campoDes);

                const campoCantidad = document.createElement('td');
                campoCantidad.textContent = producto.cantidad;
                row.appendChild(campoCantidad);

                const campoPrecio = document.createElement('td');
                campoPrecio.textContent = producto.precio;
                row.appendChild(campoPrecio);

                let campoTotal = document.createElement('td');
                campoTotal.textContent = producto.cantidad * producto.precio;
                row.appendChild(campoTotal);
                
                itemsTable.appendChild(row);
            });
        });
}