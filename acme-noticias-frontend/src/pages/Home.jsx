import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const sortedArticles = data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setArticles(sortedArticles);
      })
      .catch((err) => console.error("Error al obtener artículos", err));
  }, []);

  return (
    <div>
      <h2>Artículos Recientes</h2>
      {articles.length === 0 ? (
        <p>No hay artículos disponibles.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}
          >
            <h3>
              <Link to={`/article/${article._id}`}>{article.title}</Link>
            </h3>
            <p>{article.body.substring(0, 100)}...</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
