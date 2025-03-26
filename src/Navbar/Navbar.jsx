import { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Écoute de l'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Gestion de la déconnexion
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="App-header">
      <nav className={styles.navbar}>
        <Link to="/home" className={styles.logo}>
          Dev.
        </Link>

        <div
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>

        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
          <li>
            <Link
              to="/home"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/text-translator"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Traduction Simple
            </Link>
          </li>
          <li>
            <Link
              to="/voice-translator"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Traduction Vocale
            </Link>
          </li>
          <li>
            <Link
              to="/image-translator"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Traduction Image
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Historique
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Favoris
            </Link>
          </li>

          {/* Affichage pour mobile */}
          <div className={styles.mobileAuth}>
            {!user ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    className={styles.signIn}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/sign-up');
                      setIsOpen(false);
                    }}
                    className={styles.signUp}
                  >
                    Sign Up
                  </button>
                </li>
              </>
            ) : (
              <li className={styles.userMenu}>
                <span className={styles.username}>
                  {user.displayName || user.email}
                </span>
                <button onClick={handleSignOut} className={styles.logout}>
                  Déconnexion
                </button>
              </li>
            )}
          </div>
        </ul>

        {/* Affichage pour desktop */}
        {!user ? (
          <div className={styles.authButtons}>
            <button onClick={() => navigate('/login')} className={styles.signIn}>
              Login
            </button>
            <button onClick={() => navigate('/sign-up')} className={styles.signUp}>
              Sign Up
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <span className={styles.username}>
              {user.displayName || user.email}
            </span>
            <button onClick={handleSignOut} className={styles.logout}>
              Déconnexion
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
