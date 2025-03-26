import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar/navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import './App.css';
import History from "./Page/History.jsx";
import Favorites from "./Page/Favorites";
import Accueil from "./Page/Accueil.jsx";
import VoiceTranslator from "./Page/VoiceTranslator/VoiceTranslator.jsx";
import TextTranslator from "./Page/TextTranslator/TextTranslator.jsx";
import ImageTranslator from "./Page/ImageTranslator/ImageTranslator.jsx";
import SignUp from "./Page/Authentification/SignUp.jsx";
import Login from "./Page/Authentification/Login.jsx";


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/home" element={<Accueil />} />
          <Route path="/voice-translator" element={<VoiceTranslator />} />
          <Route path="/text-translator" element={<TextTranslator />} />
          <Route path="/image-translator" element={<ImageTranslator />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<Favorites />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
