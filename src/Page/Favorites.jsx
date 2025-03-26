import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./HistoryFavorites.css";

const Favorites = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const historyRef = collection(db, "users", user.uid, "history");
      const q = query(historyRef, where("favorite", "==", true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(items);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris :", error);
    }
  };

  const toggleFavorite = async (id, currentFavorite) => {
    try {
      const docRef = doc(db, "users", user.uid, "history", id);
      await updateDoc(docRef, { favorite: !currentFavorite });
      setFavorites(favorites.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori :", error);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favoris</h2>
      {favorites.length === 0 ? (
        <p className="empty-state">Aucun favori pour l'instant.</p>
      ) : (
        <ul className="favorites-list">
          {favorites.map((item) => (
            <li key={item.id} className="favorites-item">
              <div className="item-text">
                <strong>{item.sourceText}</strong> → {item.translatedText}
              </div>
              <button
                className="item-button btn-remove"
                onClick={() => toggleFavorite(item.id, item.favorite)}
              >
                Retirer des favoris
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
