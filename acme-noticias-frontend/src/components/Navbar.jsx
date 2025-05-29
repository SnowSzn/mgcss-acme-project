import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  // Lee la cookie actual del usuario (si existe)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    // Elimina las cookies de inicio de sesion
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirige a la pagina de login
    window.location.href = "/login";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirige a la ruta de búsqueda con el parámetro keyword
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      setSearchKeyword("");
    }
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#007BFF",
        color: "#FFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link to="/" style={{ color: "#FFF", textDecoration: "none" }}>
        <img src={"/Logo.svg"} width={150} height={150} alt="Logo"></img>
      </Link>
      <ul
        style={{
          display: "flex",
          gap: "15px",
          listStyle: "none",
          margin: 0,
          alignItems: "center",
        }}
      >
        <li>
          <Link to="/" style={{ color: "#FFF", textDecoration: "none" }}>
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/categories"
            style={{ color: "#FFF", textDecoration: "none" }}
          >
            Categorías
          </Link>
        </li>
        {user && (user.role === "redactor" || user.role === "admin") && (
          <li>
            <Link
              to="/my-articles"
              style={{ color: "#FFF", textDecoration: "none" }}
            >
              Mis Artículos
            </Link>
          </li>
        )}
        {user && user.role === "admin" && (
          <>
            <li>
              <Link
                to="/manage-categories"
                style={{ color: "#FFF", textDecoration: "none" }}
              >
                Gestión de Categorías
              </Link>
            </li>
            <li>
              <Link
                to="/manage-users"
                style={{ color: "#FFF", textDecoration: "none" }}
              >
                Gestión de Usuarios
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                style={{ color: "#FFF", textDecoration: "none" }}
              >
                Dashboard
              </Link>
            </li>
          </>
        )}
        <li>
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ marginTop: "20px", padding: "5px" }}
            />
            <button
              type="submit"
              style={{
                marginTop: "20px",
                marginLeft: "5px",
                padding: "5px 10px",
              }}
            >
              Buscar
            </button>
          </form>
        </li>
        {user ? (
          <li>
            <button onClick={logout}>Cerrar Sesión</button>
          </li>
        ) : (
          <li>
            <Link to="/login" style={{ color: "#FFF", textDecoration: "none" }}>
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
