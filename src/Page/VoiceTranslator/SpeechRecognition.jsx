import { useState, useEffect } from 'react';
import { FaMicrophone } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";
import PropTypes from 'prop-types';

const SpeechRecognition = ({ onTranscription, sourceLang }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.");
      setIsSupported(false);
      return;
    }

    const recog = new window.webkitSpeechRecognition();
    recog.lang = sourceLang;
    recog.interimResults = true;

    recog.onresult = (event) => {
      const speechToText = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(speechToText);
    };

    recog.onend = () => {
      if (isListening) {
        recog.start();
      } else {
        onTranscription(transcript);
      }
    };

    setRecognition(recog);

    return () => {
      recog.stop();
    };
  }, [isListening, transcript, sourceLang, onTranscription]);

  const startListening = () => {
    setTranscript('');
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  if (!isSupported) {
    return <p>Speech recognition is not supported in this browser.</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        {!isListening && (
          <button onClick={startListening}>
            <FaMicrophone />
          </button>
        )}

        {isListening && (
          <button onClick={stopListening}>
            <FaCircleStop />
          </button>
        )}
      </div>
    </div>
  );
};

SpeechRecognition.propTypes = {
  onTranscription: PropTypes.func.isRequired,
  sourceLang: PropTypes.string.isRequired,
};

export default SpeechRecognition;