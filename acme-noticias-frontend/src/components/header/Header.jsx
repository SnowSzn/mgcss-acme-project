import "./Header.css";

function Header() {
  return (
    <section className="header">
      <section className="header-date">
        {new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </section>
    </section>
  );
}

export default Header;
