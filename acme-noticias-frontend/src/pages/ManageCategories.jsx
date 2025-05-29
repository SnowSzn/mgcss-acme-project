import React, { useState, useEffect, useCallback } from "react";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Estados para crear una nueva categoría
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Estados para editar una categoría
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");

  // Función para cargar todas las categorías
  const loadCategories = useCallback(() => {
    fetch("http://localhost:3000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Error al obtener las categorías");
      });
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Creación de una nueva categoría
  const handleCreateCategory = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setName("");
          setDescription("");
          loadCategories();
        }
      })
      .catch((err) => {
        console.error("Error creating category:", err);
        setError("Error al crear categoría");
      });
  };

  // Eliminación de una categoría
  const handleDeleteCategory = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría?")) {
      fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(() => loadCategories())
        .catch((err) => {
          console.error("Error deleting category:", err);
          setError("Error al eliminar la categoría");
        });
    }
  };

  // Inicia el proceso de edición para una categoría
  const startEditing = (category) => {
    setEditingCategoryId(category._id);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  // Cancela la edición
  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditName("");
    setEditDescription("");
  };

  // Guarda los cambios en la edición de la categoría
  const handleEditCategory = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/categories/${editingCategoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName, description: editDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          cancelEditing();
          loadCategories();
        }
      })
      .catch((err) => {
        console.error("Error editing category:", err);
        setError("Error al editar categoría");
      });
  };

  return (
    <div>
      <h2>Gestionar Categorías</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Crear Nueva Categoría</h3>
      <form onSubmit={handleCreateCategory}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Categoría</button>
      </form>

      <h3>Categorías Existentes</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            {editingCategoryId === cat._id ? (
              // Formulario de edición inline para la categoría en edición
              <form onSubmit={handleEditCategory}>
                <div>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Descripción:</label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={cancelEditing}>
                  Cancelar
                </button>
              </form>
            ) : (
              <div>
                <strong>{cat.name}</strong> - {cat.description} &nbsp;
                <button onClick={() => startEditing(cat)}>Editar</button> &nbsp;
                <button onClick={() => handleDeleteCategory(cat._id)}>
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

export default ManageCategories;
