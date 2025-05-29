import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateArticle = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  // Nuevos estados para multimedia:
  const [coverImage, setCoverImage] = useState("");
  const [videoLinksInput, setVideoLinksInput] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Procesamos videoLinks: se espera que el usuario introduzca URLs separadas por comas.
    const videoLinks = videoLinksInput
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link !== "");

    fetch("http://localhost:3000/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body, category, coverImage, videoLinks }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate("/my-articles");
        }
      })
      .catch((err) => {
        console.error("Error creating article:", err);
        setError("Error al crear el artículo");
      });
  };

  return (
    <div>
      <h2>Crear Nuevo Artículo</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="create-article-contents">
          <label>Contenido:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Campo para imagen de portada */}
        <div>
          <label>URL de la imagen de portada:</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        {/* Campo para enlaces a vídeos */}
        <div>
          <label>Enlaces a vídeos (separados por comas):</label>
          <input
            type="text"
            value={videoLinksInput}
            onChange={(e) => setVideoLinksInput(e.target.value)}
            placeholder="https://youtu.be/xxx, https://youtu.be/yyy"
          />
        </div>
        <button type="submit">Crear Artículo</button>
      </form>
    </div>
  );
};

export default CreateArticle;
