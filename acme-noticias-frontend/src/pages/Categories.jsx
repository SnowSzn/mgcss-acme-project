import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al obtener categorías", err));
  }, []);

  return (
    <div>
      <h2>Categorías</h2>
      {categories.length === 0 ? (
        <p>No hay categorías disponibles.</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              <div
                style={{
                  borderBottom: "1px solid #ccc",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              ></div>
              {/* Al hacer clic en el nombre se navega a la ruta para ver los artículos de esa categoría */}
              <Link to={`/category/${cat._id}`}>
                <strong>{cat.name}</strong>
              </Link>
              <br></br>
              {cat.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
