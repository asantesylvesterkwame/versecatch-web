import "regenerator-runtime/runtime";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { BsRecordCircle, BsPause } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { PiWaveformBold } from "react-icons/pi";
import SelectElement from "./components/elements/SelectElement";
import { bibleVersionOptions } from "./constants";
import useBibleVerseDetection from "./hooks/useBibleVerseDetection";
import { motion } from "framer-motion";

const App = () => {
  const {
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
  } = useBibleVerseDetection();

  const handleTranslationChange = (selectedValue: string) => {
    setTranslation(selectedValue);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      <motion.div
        className="text-2xl font-bold text-black mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Verse Catch
      </motion.div>

      <div className="text-center flex flex-col items-center gap-10">
        <SelectElement
          label="Select one below"
          placeholder="Select a version"
          optionItems={bibleVersionOptions}
          onChange={handleTranslationChange}
        />
        <motion.div
          className="font-bold text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {verseReference
            ? `${verseReference.toUpperCase()} (${translation.toUpperCase()})`
            : "ROMANS 8:28 (WEB)"}
        </motion.div>
        <div className="text-3xl max-w-[70%] ">
          {loading
            ? "Loading..."
            : bibleQuote ||
              "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="shadow-lg rounded-2xl"
        >
          <Card className="flex items-center flex-col h-[250px] justify-between p-10">
            <motion.div
              className="bg-gray-300 p-2.5 rounded-full cursor-pointer hover:bg-gray-400 transition"
              initial={{ scale: 1 }}
              animate={{ scale: listening ? 1.15 : 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                repeat: listening ? Infinity : 0,
                repeatType: "reverse",
              }}
              style={{ willChange: "transform" }}
            >
              {listening ? (
                <PiWaveformBold size={18} />
              ) : paused ? (
                <BsPause size={18} />
              ) : (
                <BsRecordCircle size={18} />
              )}
            </motion.div>
            <div className="text-center max-w-[70%] font-semibold">
              Transcribing and detecting Bible quotations in real time.
            </div>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!recording ? (
                  <Button onClick={handleStartListening}>
                    <FaMicrophone />
                    Start Listening
                  </Button>
                ) : paused ? (
                  <Button onClick={handleStartListening}>
                    <FaMicrophone />
                    Continue Listening
                  </Button>
                ) : (
                  <Button
                    className="bg-red-300 shadow-none hover:bg-red-400 text-red-500"
                    onClick={handleStopListening}
                  >
                    <FaMicrophoneSlash className="text-red-500" />
                    Stop Listening
                  </Button>
                )}
              </motion.div>
              {recording && !paused && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={handlePauseListening}>
                    <BsPause />
                    Pause Listening
                  </Button>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;
