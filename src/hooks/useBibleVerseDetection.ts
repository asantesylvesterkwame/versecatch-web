import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";

const useBibleVerseDetection = (initialTranslation = "WEB") => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [bibleQuote, setBibleQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState(initialTranslation);
  const [verseReference, setVerseReference] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const verse = extractBibleVerse(transcript);
      if (verse) {
        setVerseReference(verse);
        fetchBibleVerse(verse);
      }
    }
  }, [transcript]);

  useEffect(() => {
    if (verseReference) {
      fetchBibleVerse(verseReference);
    }
  }, [translation]);

  const handleStartListening = () => {
    resetTranscript();
    setBibleQuote("");
    setPaused(false);
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setRecording(false);
    setPaused(false);
  };

  const handlePauseListening = () => {
    SpeechRecognition.stopListening();
    setPaused(true);
  };

  const extractBibleVerse = (text: string) => {
    const verseRegex =
      /\b([1-3]?\s?[A-Za-z]+)\s(\d{1,3}):(\d{1,3})(-\d{1,3})?\b/;
    const match = text.match(verseRegex);
    if (match) {
      const book = match[1].replace(/\s/g, "");
      const chapter = match[2];
      const verse = match[3];
      const range = match[4] ? match[4] : "";
      return `${book} ${chapter}:${verse}${range}`;
    }
    return null;
  };

  const fetchBibleVerse = async (verse: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.API_URL
        }/api/v1/bible/verse?reference=${encodeURIComponent(
          verse
        )}&translation=${translation}`
      );
      setBibleQuote(response.data.verses);
    } catch (error) {
      console.error("Error fetching verse:", error);
      setBibleQuote("Error fetching verse. Please try again later.");
    }
    setLoading(false);
  };

  return {
    recording,
    paused,
    bibleQuote,
    loading,
    translation,
    verseReference,
    listening,
    browserSupportsSpeechRecognition,
    handleStartListening,
    handleStopListening,
    handlePauseListening,
    setTranslation,
  };
};

export default useBibleVerseDetection;
