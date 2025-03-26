import "./Accueil.css";
import Micro from "../assets/micro.png";
import ImageToText from "../assets/imageToText.png";
import Normal from "../assets/traduction.png";
import imageLangue from "../assets/iamgeAccueil.png";

const Accueil = () => {
  return (
    <div>
      {/* Section Héro */}
      <section className="hero">
        <div className="hero-content">
          <h1>Brisez la barrière de la langue</h1>
          <p>Notre application vous permet de traduire instantanément du texte, de la voix et des images. Facile à utiliser, elle vous aide à communiquer sans barrière linguistique où que vous soyez. 🌍✨</p>
          <button className="translate-btn">Traduire maintenant</button>
        </div>
        <div>
          <img src={imageLangue} alt="Illustration de l'application" className="hero-image" />
        </div>
      </section>

      {/* Section Détails des Fonctionnalités */}
      <section className="detailed-features">
        {/* Traduction vocale */}
        <div className="feature-section">
          <div className="feature-text">
            <div className="icon-box">
              <h2>🗣 Traduction vocale</h2>
            </div>
            <p>Exprimez-vous librement dans votre langue et laissez notre application traduire en temps réel. Idéal pour les voyages et les discussions professionnelles.</p>
          </div>
          <div className="feature-image">
            <img src={Micro} alt="Traduction vocale" />
          </div>
        </div>

        {/* Traduction d'images */}
        <div className="feature-section reverse">
          <div className="feature-text">
            <div className="icon-box">
              <h2>{"📷 Traduction d'images"}</h2>
            </div>
            <p>Capturez du texte avec votre appareil photo et obtenez une traduction instantanée. Parfait pour les menus, panneaux et documents étrangers.</p>
          </div>
          <div className="feature-image">
            <img src={ImageToText} alt="Traduction d'images" />
          </div>
        </div>

        {/* Traduction de texte */}
        <div className="feature-section">
          <div className="feature-text">
            <div className="icon-box">
              <h2>📖 Traduction de texte</h2>
            </div>
            <p>Collez un texte dans notre application et obtenez une traduction précise et fluide en quelques secondes.</p>
          </div>
          <div className="feature-image">
            <img src={Normal} alt="Traduction de texte" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
