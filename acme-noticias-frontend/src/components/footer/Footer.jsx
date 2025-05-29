import "./Footer.css";

function Footer() {
  return (
    <section className="footer">
      <br></br>
      <hr className="footer-separator" />
      <hr className="footer-separator" />
      <hr className="footer-separator" />
      <section className="footer-copy">
        Copyright © {new Date().getFullYear()}, Noticias Acme, S.A.
      </section>
      <hr className="footer-separator" />
      <hr className="footer-separator" />
      <hr className="footer-separator" />
    </section>
  );
}

export default Footer;
