import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// Helper para obtener el query parameter
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const keyword = query.get("keyword") || "";
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (keyword.trim()) {
      fetch(
        `http://localhost:3000/api/articles/search?keyword=${encodeURIComponent(
          keyword
        )}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al buscar artículos");
          }
          return res.json();
        })
        .then((data) => setArticles(data))
        .catch((err) => {
          console.error(err);
          setError(err.message);
        });
    } else {
      setArticles([]);
    }
  }, [keyword]);

  return (
    <div>
      <h2>Resultados de búsqueda para "{keyword}"</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {articles.length === 0 ? (
        <p>No se encontraron artículos.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article._id}>
              <Link to={`/article/${article._id}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      )}
      <div
        style={{
          borderBottom: "1px solid #ccc",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      ></div>
      <p>
        <Link to="/">Volver a Inicio</Link>
      </p>
    </div>
  );
};

export default SearchResults;
