import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import axios from "axios";
import { db, auth } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import "./ImageTranslator.css";
import { FaHistory, FaHeart, FaCloudUploadAlt } from "react-icons/fa";

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

const ImageTranslator = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cvReady, setCvReady] = useState(false);
  const [targetLang, setTargetLang] = useState("fr");
  const navigate = useNavigate();

  useEffect(() => {
    const checkCv = setInterval(() => {
      if (window.cv && window.cv.imread) {
        console.log("OpenCV prêt !");
        setCvReady(true);
        clearInterval(checkCv);
      }
    }, 200);
    return () => clearInterval(checkCv);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setSelectedImage(imgURL);

      if (cvReady) {
        const processedImg = await preprocessImage(imgURL);
        extractText(processedImg);
      } else {
        extractText(imgURL);
      }
    }
  };

  const preprocessImage = async (imageSrc) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (!window.cv || !window.cv.imread) {
          console.error("OpenCV n'est pas prêt !");
          return resolve(imageSrc);
        }

        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();

        window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY, 0);
        window.cv.threshold(dst, dst, 120, 255, window.cv.THRESH_BINARY);

        window.cv.imshow(canvas, dst);
        src.delete();
        dst.delete();

        resolve(canvas.toDataURL());
      };
    });
  };

  const extractText = (image) => {
    setLoading(true);
    Tesseract.recognize(image, "eng+fra", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        const cleanedText = cleanText(text);
        setExtractedText(cleanedText);
        translateText(cleanedText);
      })
      .catch(() => setExtractedText("Erreur de reconnaissance"))
      .finally(() => setLoading(false));
  };

  const translateText = async (text) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    try {
      const response = await axios.get(url);
      const translated = response.data.responseData.translatedText;
      setTranslatedText(translated);

      // Enregistrement dans l'historique si l'utilisateur est connecté
      if (auth.currentUser) {
        await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
          sourceText: text,
          translatedText: translated,
          sourceLang: "en",
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

  const cleanText = (text) => {
    return text.replace(/\n{2,}/g, "\n").replace(/[^a-zA-ZÀ-ÿ0-9\s.,!?€$]/g, "");
  };

  return (
    <div className="image-translator-container">
      <div className="image-translator-box">
        <h2 className="image-translator-title">Traducteur d'Images</h2>
  
        <div className="upload-section">
          <div className="file-input-wrapper">
            <label className="custom-file-upload">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <FaCloudUploadAlt style={{ fontSize: '1.5em' }} />
              Choisir une image
            </label>
          </div>
  
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage} alt="Preview" />
            </div>
          )}
        </div>
  
        <div className="translation-controls">
          <div className="language-selector">
            <label>Traduire vers : </label>
            <select
              className="language-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {loading ? (
          <p className="loading-text">Traitement de l'image en cours...</p>
        ) : (
          <div className="results">
            <div className="text-box">
              <h3>Texte Extrait</h3>
              <div className="text-content">{extractedText}</div>
            </div>
            <div className="text-box">
              <h3>Traduction</h3>
              <div className="text-content">{translatedText}</div>
            </div>
          </div>
        )}
  
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

export default ImageTranslator;
