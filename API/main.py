from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector, jsonify

app = FastAPI()

# Configura el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lista de orígenes permitidos# Permite cookies (si las usas)
    allow_methods=["*"],     # Permite todos los métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],     # Permite todos los headers
)

db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'parcialcucarron'
}

class producto(BaseModel):
    nombre: str
    descripcion: str
    cantidad: int
    precio: float
    usuario_id: int

class LoginData(BaseModel):
    correo: str
    contrasena: str

class Usuario(BaseModel):
    nombre: str
    correo: str
    contrasena: str

def get_db_connection():
    return mysql.connector.connect(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )

@app.get("/productos/listar/{usuario_id}")
def leer_productos(usuario_id: int):
    connector = get_db_connection()
    cursor = connector.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos WHERE usuario_id = %s", (usuario_id,))
    usuarios = cursor.fetchall()
    connector.close()
    return usuarios

@app.post("/productos/agregar")
def crear_producto(producto: producto):
    connector = get_db_connection()
    cursor = connector.cursor()
    cursor.execute("INSERT INTO productos (nombre, descripcion, cantidad, precio, usuario_id) VALUES (%s, %s, %s, %s, %s)", (producto.nombre, producto.descripcion, producto.cantidad, producto.precio, producto.usuario_id))
    connector.commit()
    connector.close()
    return {"message": "Producto creado"}

@app.post("/usuarios/agregar")
def crear_usuario(usuario: Usuario):
    connector = get_db_connection()
    cursor = connector.cursor()
    cursor.execute("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)", (usuario.nombre, usuario.correo, usuario.contrasena))
    connector.commit()
    connector.close()
    return {"message": "Usuario creado"}

@app.put("/productos/update/{producto_id}")
def actualizar_producto(producto_id: int, producto: producto):
    connector = get_db_connection()
    cursor = connector.cursor()
    cursor.execute("UPDATE productos SET nombre = %s, descripcion = %s, cantidad = %s, precio = %s WHERE id = %s", (producto.nombre, producto.descripcion, producto.cantidad, producto.precio, producto_id))
    connector.commit()
    connector.close()
    return {"message": "Producto actualizado"}

@app.delete("/productos/borrar/{producto_id}")
def borrar_producto(producto_id: int):
    connector = get_db_connection()
    cursor = connector.cursor()
    cursor.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
    connector.commit()
    connector.close()
    return {"message": "Producto borrado"}

@app.post("/login")
async def login(login_data: LoginData):
    try:
        connector = get_db_connection()
        cursor = connector.cursor(dictionary=True)
        
        cursor.execute(
            'SELECT id FROM usuarios WHERE correo = %s AND contrasena = %s', 
            (login_data.correo, login_data.contrasena)
        )
        user = cursor.fetchone()
        
        connector.close()
        
        if not user:
            raise HTTPException(status_code=404, detail="Credenciales incorrectas")
        return {"message": "Bienvenido", "user": user}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))