import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Se asume que el endpoint GET /api/dashboard devuelve datos con avgComments y topArticles
    fetch("http://localhost:3000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener datos del dashboard");
        }
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {dashboardData ? (
        <div>
          <div
            style={{
              borderBottom: "1px solid #ccc",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          ></div>
          <section>
            <h3>Número medio de comentarios por artículo</h3>
            <p>{dashboardData.avgComments}</p>
          </section>
          <div
            style={{
              borderBottom: "1px solid #ccc",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          ></div>
          <section>
            <h3>Artículos con más comentarios</h3>
            {dashboardData.topArticles &&
            dashboardData.topArticles.length > 0 ? (
              <ul>
                {dashboardData.topArticles.map((article) => (
                  <li key={article._id}>
                    <Link to={`/article/${article._id}`}>
                      – <strong>{article.title}</strong>
                    </Link>{" "}
                    – {article.commentCount} comentarios
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay artículos con comentarios.</p>
            )}
          </section>
        </div>
      ) : (
        <p>Cargando datos del dashboard...</p>
      )}
    </div>
  );
};

export default Dashboard;
