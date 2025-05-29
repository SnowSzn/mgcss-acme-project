import React, { useState, useEffect, useCallback } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Estados para crear un nuevo usuario
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("reader");

  // Estados para editar un usuario existente
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("reader");

  const token = localStorage.getItem("token");

  // Función para cargar todos los usuarios desde el backend
  const loadUsers = useCallback(() => {
    fetch("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Error al obtener los usuarios");
      });
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Función para crear un nuevo usuario
  const handleCreateUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Limpiar formulario y recargar lista de usuarios
          setNewUsername("");
          setNewPassword("");
          setNewRole("reader");
          loadUsers();
        }
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        setError("Error al crear usuario");
      });
  };

  // Función para iniciar la edición de un usuario
  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditPassword(""); // Opcional: dejar en blanco para no modificar la contraseña
  };

  // Función para cancelar la edición
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditUsername("");
    setEditPassword("");
    setEditRole("reader");
  };

  // Función para guardar los cambios en un usuario (editar)
  const handleEditUser = (e) => {
    e.preventDefault();
    // Construye el payload para actualizar. Si la contraseña se deja en blanco, no se envía.
    const payload = { username: editUsername, role: editRole };
    if (editPassword.trim() !== "") {
      payload.password = editPassword;
    }
    fetch(`http://localhost:3000/api/users/${editingUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          cancelEditing();
          loadUsers();
        }
      })
      .catch((err) => {
        console.error("Error editing user:", err);
        setError("Error al editar el usuario");
      });
  };

  // Función para eliminar un usuario
  const handleDeleteUser = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(() => loadUsers())
        .catch((err) => {
          console.error("Error deleting user:", err);
          setError("Error al eliminar el usuario");
        });
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Formulario para crear un nuevo usuario */}
      <h3>Crear Usuario</h3>
      <form onSubmit={handleCreateUser}>
        <div>
          <label>Nombre de usuario: </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rol: </label>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="reader">Lector</option>
            <option value="redactor">Redactor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Crear Usuario</button>
      </form>

      {/* Lista de usuarios existentes */}
      <h3>Usuarios Existentes</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {editingUserId === user._id ? (
              // Formulario de edición inline
              <form onSubmit={handleEditUser}>
                <div>
                  <label>Nombre de usuario: </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Contraseña: </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>
                <div>
                  <label>Rol: </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="reader">Lector</option>
                    <option value="redactor">Redactor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={cancelEditing}>
                  Cancelar
                </button>
              </form>
            ) : (
              // Vista normal de cada usuario
              <div>
                <strong>{user.username}</strong> - {user.role} &nbsp;
                <button onClick={() => startEditing(user)}>Editar</button>{" "}
                &nbsp;
                <button onClick={() => handleDeleteUser(user._id)}>
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
