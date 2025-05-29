import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  // Estados para multimedia:
  const [coverImage, setCoverImage] = useState("");
  const [videoLinksInput, setVideoLinksInput] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:3000/api/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setTitle(data.title);
        setBody(data.body);
        // Puede venir como objeto o sólo ID para la categoría:
        setCategory(data.category._id || data.category);
        setCoverImage(data.coverImage || "");
        // Convertir el array de videoLinks a una cadena separada por comas:
        setVideoLinksInput(data.videoLinks ? data.videoLinks.join(", ") : "");
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError("Error al obtener el artículo");
      });
  }, [id, token]);

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoLinks = videoLinksInput
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link !== "");

    fetch(`http://localhost:3000/api/articles/${id}`, {
      method: "PUT",
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
        console.error("Error editing article:", err);
        setError("Error al editar el artículo");
      });
  };

  if (!article) return <p>Cargando artículo...</p>;

  return (
    <div className="edit-article">
      <h2>Editar Artículo</h2>
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
        <div className="edit-article-contents">
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
        <div>
          <label>URL de la imagen de portada:</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label>Enlaces a vídeos (separados por comas):</label>
          <input
            type="text"
            value={videoLinksInput}
            onChange={(e) => setVideoLinksInput(e.target.value)}
            placeholder="https://youtu.be/xxx, https://youtu.be/yyy"
          />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditArticle;
