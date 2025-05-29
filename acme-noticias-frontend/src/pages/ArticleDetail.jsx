import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ArticleDetail = () => {
  const { id } = useParams(); // ID del artículo
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Cargar el artículo
  useEffect(() => {
    fetch(`http://localhost:3000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch((err) => console.error("Error fetching article:", err));
  }, [id]);

  // Cargar los comentarios sólo si el artículo existe y tiene activados los comentarios
  useEffect(() => {
    if (article && !article.commentsDisabled) {
      fetch(`http://localhost:3000/api/comments?article=${id}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error("Error fetching comments:", err));
    } else {
      // Si los comentarios están desactivados, establecemos el array de comentarios vacío
      setComments([]);
    }
  }, [id, article]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ article: id, text: newComment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al agregar comentario");
        return res.json();
      })
      .then((comment) => {
        // Si el backend no llena la propiedad author, llenarla con los datos del usuario autenticado
        if (!comment.author || !comment.author.username) {
          comment.author = { username: user.username, _id: user._id };
        }
        setComments([...comments, comment]);
        setNewComment("");
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("¿Deseas eliminar este comentario?")) {
      fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar comentario");
          return res.json();
        })
        .then(() => {
          setComments(comments.filter((c) => c._id !== commentId));
        })
        .catch((err) => setError(err.message));
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditedCommentText(comment.text);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleEditComment = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/comments/${editingCommentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editedCommentText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar comentario");
        return res.json();
      })
      .then((updatedComment) => {
        setComments(
          comments.map((c) =>
            c._id === updatedComment._id ? updatedComment : c
          )
        );
        cancelEditingComment();
      })
      .catch((err) => setError(err.message));
  };

  // Función para determinar si el usuario tiene permiso para modificar/eliminar un comentario:
  const canModifyComment = (comment) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "redactor" && article) {
      const articleAuthor =
        typeof article.author === "object"
          ? article.author._id
          : article.author;
      return articleAuthor === user._id;
    }
    return false;
  };

  if (!article) return <p>Cargando artículo...</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>
        Fecha de publicación: {new Date(article.publishedAt).toLocaleString()}
      </p>

      {/* Mostrar la imagen de portada si está definida */}
      {article.coverImage && (
        <div>
          <img
            src={article.coverImage}
            alt="Imagen de portada"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}

      <p style={{ whiteSpace: "pre-wrap" }}>{article.body}</p>

      {article.videoLinks && article.videoLinks.length > 0 && (
        <div>
          <h3>Vídeos relacionados</h3>
          <ul>
            {article.videoLinks.map((link, idx) => (
              <li key={idx}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user &&
        user.role === "redactor" &&
        (typeof article.author === "object"
          ? article.author._id
          : article.author) === user._id && (
          <div>
            <div
              style={{
                borderBottom: "1px solid #ccc",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            ></div>
            <button
              onClick={() => {
                // Toggle de commentsDisabled en el artículo
                fetch(`http://localhost:3000/api/articles/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    commentsDisabled: !article.commentsDisabled,
                  }),
                })
                  .then((res) => {
                    if (!res.ok)
                      throw new Error(
                        "Error al actualizar estado de comentarios."
                      );
                    return res.json();
                  })
                  .then((updatedArticle) => setArticle(updatedArticle))
                  .catch((err) =>
                    console.error("Error al cambiar estado de comentarios", err)
                  );
              }}
            >
              {article.commentsDisabled
                ? "Activar comentarios"
                : "Desactivar comentarios"}
            </button>
          </div>
        )}

      <div
        style={{
          borderBottom: "1px solid #ccc",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      ></div>

      <section>
        <h3>Comentarios</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Si los comentarios están desactivados, mostramos un mensaje */}
        {article.commentsDisabled ? (
          <p>Los comentarios están desactivados para este artículo.</p>
        ) : (
          <section className="article-comments">
            {user ? (
              <form onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows="3"
                ></textarea>
                <br />
                <button type="submit">Enviar comentario</button>
              </form>
            ) : (
              <p>
                <Link to="/login">Inicia sesión</Link> para comentar.
              </p>
            )}

            <ul>
              {comments.map((comment) => (
                <li key={comment._id}>
                  <p>
                    <strong>{comment.author?.username || "Anónimo"}</strong> (
                    {new Date(comment.createdAt).toLocaleString()}):{" "}
                    {comment.text}
                  </p>
                  {user && canModifyComment(comment) && (
                    <>
                      <button onClick={() => startEditingComment(comment)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                  {editingCommentId === comment._id && (
                    <form onSubmit={handleEditComment}>
                      <textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        rows="2"
                      ></textarea>
                      <br />
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={cancelEditingComment}>
                        Cancelar
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
};

export default ArticleDetail;
