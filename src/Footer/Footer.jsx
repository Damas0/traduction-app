import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>Une application de traduction rapide et efficace pour briser les barrières linguistiques en un clic.</p>
        </div>

        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Fonctionnalités</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 TraductionApp. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
