import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./HistoryFavorites.css";

const History = () => {
  const [user] = useAuthState(auth);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const historyRef = collection(db, "users", user.uid, "history");
      const q = query(historyRef);
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTranslations(items);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique :", error);
    }
  };

  const toggleFavorite = async (id, currentFavorite) => {
    try {
      const docRef = doc(db, "users", user.uid, "history", id);
      await updateDoc(docRef, { favorite: !currentFavorite });
      setTranslations(
        translations.map((item) =>
          item.id === id ? { ...item, favorite: !currentFavorite } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori :", error);
    }
  };

  return (
    <div className="history-container">
      <h2>Historique des traductions</h2>
      {translations.length === 0 ? (
        <p className="empty-state">Aucune traduction effectuée.</p>
      ) : (
        <ul className="history-list">
          {translations.map((item) => (
            <li key={item.id} className="history-item">
              <div className="item-text">
                <strong>{item.sourceText}</strong> → {item.translatedText}
              </div>
              <button
                className={`item-button ${
                  item.favorite ? "btn-remove" : "btn-add"
                }`}
                onClick={() => toggleFavorite(item.id, item.favorite)}
              >
                {item.favorite
                  ? "Retirer des favoris"
                  : "Ajouter aux favoris"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
