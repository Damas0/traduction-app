import { useState } from 'react'; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHistory, FaExchangeAlt, FaHeart } from "react-icons/fa";
import { db, auth } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import "./Translator.css";
import SpeechRecognition from './SpeechRecognition';

const languages = [
  { code: "en", name: "Anglais" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Espagnol" },
  { code: "de", name: "Allemand" },
  { code: "it", name: "Italien" },
  { code: "pt", name: "Portugais" },
  { code: "nl", name: "Néerlandais" },
  { code: "ru", name: "Russe" },
  { code: "zh-CN", name: "Chinois (Simplifié)" },
  { code: "zh-TW", name: "Chinois (Traditionnel)" },
  { code: "ja", name: "Japonais" },
  { code: "ko", name: "Coréen" },
  { code: "ar", name: "Arabe" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turc" },
  { code: "sv", name: "Suédois" },
  { code: "pl", name: "Polonais" },
  { code: "da", name: "Danois" },
  { code: "fi", name: "Finnois" },
  { code: "el", name: "Grec" },
  { code: "he", name: "Hébreu" },
  { code: "id", name: "Indonésien" },
  { code: "ms", name: "Malais" },
  { code: "th", name: "Thaï" },
  { code: "vi", name: "Vietnamien" },
  { code: "uk", name: "Ukrainien" },
  { code: "hu", name: "Hongrois" },
  { code: "cs", name: "Tchèque" },
  { code: "ro", name: "Roumain" },
  { code: "bg", name: "Bulgare" },
  { code: "sr", name: "Serbe" },
  { code: "hr", name: "Croate" },
  { code: "sk", name: "Slovaque" },
  { code: "sl", name: "Slovène" }
];

const VoiceTranslator = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");

  const navigate = useNavigate();

  const translateText = async () => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    try {
      const response = await axios.get(url);
      const translated = response.data.responseData.translatedText;
      setTranslatedText(translated);

      // Enregistrement dans l'historique si l'utilisateur est connecté
      if (auth.currentUser) {
        await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
          sourceText: text,
          translatedText: translated,
          sourceLang,
          targetLang,
          timestamp: new Date(),
          favorite: false,
        });
      } else {
        console.log("Utilisateur non connecté, traduction non sauvegardée.");
      }
    } catch (error) {
      console.error("Erreur de traduction", error);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleTranscription = (transcript) => {
    setText(transcript);
  };

  return (
    <div className="translator-container">
      <div className="translator-box">
        <h2 className="translator-title">Traducteur Audio</h2>

        <div className="translator-options">
          <div>
            <label>De : </label>
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <FaExchangeAlt className="exchange-icon" onClick={swapLanguages} />

          <div>
            <label>Vers : </label>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="translator-textareas">
          <SpeechRecognition onTranscription={handleTranscription} sourceLang={sourceLang} />

          <textarea
            className="translator-textarea input-text"
            rows="6"
            placeholder="Entrez du texte"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <textarea
            className="translator-textarea output-text"
            rows="6"
            placeholder="Traduction affichée ici"
            value={translatedText}
            readOnly
          ></textarea>
        </div>

        <button onClick={translateText} className="translator-button">Traduire</button>

        <div className="translator-icons">
          <div className="icon-container" onClick={() => navigate("/history")}>
            <FaHistory className="history-icon" />
            <p>Historique</p>
          </div>
          <div className="icon-container" onClick={() => navigate("/favorites")}>
            <FaHeart className="favoris-icon" />
            <p>Favoris</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTranslator;
