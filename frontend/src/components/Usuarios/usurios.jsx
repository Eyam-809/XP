import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Usuario.css";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const navigate = useNavigate(); // Hook para volver a la pantalla anterior

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        const response = await fetch("http://localhost:8000/api/usuarios");
        const data = await response.json();
        setUsuarios(data);
    };

    const agregarUsuario = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nombre, email, password }),
        });

        if (response.ok) {
            fetchUsuarios();
            setNombre("");
            setEmail("");
            setPassword("");
            setMostrarFormulario(false);
        }
    };

    const eliminarUsuario = async (id) => {
        await fetch(`http://localhost:8000/api/usuarios/${id}`, {
            method: "DELETE",
        });
        fetchUsuarios();
    };

    const abrirEditor = (usuario) => {
        setUsuarioEditando(usuario);
    };

    const editarUsuario = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/api/usuarios/${usuarioEditando.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: usuarioEditando.name,
                email: usuarioEditando.email,
            }),
        });

        if (response.ok) {
            setUsuarioEditando(null);
            fetchUsuarios();
        }
    };

    return (
        <div className="container">
            <h1 className="h1_title">Catálogo de Usuarios</h1>

            {/* Botón para abrir el formulario */}
            <button className="button add" onClick={() => setMostrarFormulario(true)}>Agregar Usuario</button>

            {/* Botón para volver a la pantalla anterior */}
            <button className="button back" onClick={() => navigate(-1)}>Volver</button>

            {/* Tabla de usuarios */}
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className="table">
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td className="text_black">{usuario.name}</td>
                            <td className="text_black">{usuario.email}</td>
                            <td>
                                <button className="button edit" onClick={() => abrirEditor(usuario)}>Editar</button>
                                <button className="button delete" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar usuario */}
            {mostrarFormulario && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="h1_title">Agregar Usuario</h2>
                        <form onSubmit={agregarUsuario}>
                            <input className="input" type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            <br />
                            <input className="input" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <br />
                            <input className="input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <br />
                            <button type="submit" className="button save">Guardar</button>
                            <br />
                            <button type="button" className="button cancel" onClick={() => setMostrarFormulario(false)}>Volver</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para editar usuario */}
            {usuarioEditando && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="h1_title">Editar Usuario</h2>
                        <form onSubmit={editarUsuario}>
                            <input className="input" type="text" value={usuarioEditando.name} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, name: e.target.value })} required />
                            <br />
                            <input className="input" type="email" value={usuarioEditando.email} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })} required />
                            <br />
                            <button type="submit" className="button save">Guardar Cambios</button>
                            <br />
                            <button type="button" className="button cancel" onClick={() => setUsuarioEditando(null)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Usuarios;
