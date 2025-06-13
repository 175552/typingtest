import { useEffect, useState, useRef } from "react";
import '../styles/TypingTest.css';


function TypingTest() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [correctWordsCount, setCorrectWordsCount] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [wordResults, setWordResults] = useState([]); // array of booleans

  const userInputRef = useRef("");
  const currentWordIndexRef = useRef(0);
  const startTimeRef = useRef(null);
  const correctWordsCountRef = useRef(0);
  const timerRef = useRef(null);
  const timerRef2 = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/string")
      .then(response => response.text())
      .then(data => {
        setWords(data.trim().split(/\s+/));
      });
  }, []);

  const calculateWPM = () => {
    const finishTime = endTime || Date.now();
    const minutesElapsed = (finishTime - startTimeRef.current) / 60000;
    return Math.round(correctWordsCountRef.current / minutesElapsed);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;

      timerRef.current = setInterval(() => {
        setWpm(calculateWPM());
      }, 1000);

       timerRef2.current = setInterval(() => {
        setCurrentTime(((Date.now() - startTimeRef.current) /  1000).toFixed(2));
      }, 10);
    }
    

    if (value.endsWith(" ")) {
      const trimmedInput = value.trim();

      setSubmittedWords(prev => [...prev, trimmedInput]);

      const currentWord = words[currentWordIndex] || "";

      const isCorrect = trimmedInput === currentWord;

      setWordResults(prev => [...prev, isCorrect]);

      if (isCorrect) {
        setCorrectWordsCount(prev => {
          correctWordsCountRef.current = prev + 1;
          return prev + 1;
        });
      }

      setUserInput("");
      setCurrentWordIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          const finish = Date.now();
          setEndTime(finish);
          setTotalTime(((finish - startTimeRef.current) / 1000).toFixed(2)); // in seconds
          setWpm(calculateWPM());
          setTestComplete(true);
          clearInterval(timerRef.current);
          clearInterval(timerRef2.current);
          return prev;
        }
        return nextIndex;
      });
    } else {
      setUserInput(value);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(timerRef2.current); // ✅ clean up here too
    };
  }, []);

  const renderCurrentWord = () => {
    const currentWord = words[currentWordIndex] || "";
    return currentWord.split("").map((char, idx) => {
      let className = "";
      if (idx < userInput.length) {
        className = userInput[idx] === char ? "correct-letter" : "incorrect-letter";
      }
      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  const handleRestart = () => {
    // Reload the page or reset state
    window.location.reload();
  };

  if (testComplete) {
    return (
      <div className="results-container">
        <h2>Test Complete!</h2>
        <p>WPM: {wpm}</p>
        <p>Correct Words: {correctWordsCount}</p>
        <p>Time Taken: {totalTime} seconds</p>
        <button className="restart-button" onClick={handleRestart}>Restart Test</button>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="stats-container">
        <div className="stats-display">Time: {currentTime}s</div>
        <div className="stats-display">WPM: {wpm}</div>
      </div>
      <div className="word-box">
        {words.map((word, idx) => {
          if (idx < currentWordIndex) {
            const typed = submittedWords[idx] || "";

            return (
              <span key={idx} className="word">
                {word.split("").map((char, charIdx) => {
                  const typedChar = typed[charIdx];
                  let letterClass = "";
                  if (typedChar != null) {
                    letterClass = typedChar === char ? "correct-letter" : "incorrect-letter";
                  }
                  return (
                    <span key={charIdx} className={letterClass}>
                      {char}
                    </span>
                  );
                })}{" "}
              </span>
            );
          } else if (idx === currentWordIndex) {
            return (
              <span key={idx} className="current-word">
                {renderCurrentWord()}{" "}
              </span>
            );
          } else {
            return (
              <span key={idx} className="word">
                {word}{" "}
              </span>
            );
          }
        })}
      </div>
      <input
        type="text"
        className="typing-input"
        value={userInput}
        onChange={handleChange}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        placeholder="Start typing..."
        disabled={testComplete}
      />

      
      <button className="restart-button" onClick={handleRestart}>Restart Test</button>
    </div>
  );
}

export default TypingTest;