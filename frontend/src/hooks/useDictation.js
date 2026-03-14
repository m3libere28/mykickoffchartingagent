import { useState, useEffect, useRef, useCallback } from 'react';

export const useDictation = (onTextChange) => {
  const [isDictating, setIsDictating] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  
  // Track interim results to avoid appending duplicates, but real updates append to final text
  const currentInterimRef = useRef('');

  useEffect(() => {
    // Check support for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsDictating(true);
      setError(null);
      currentInterimRef.current = '';
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      currentInterimRef.current = interimTranscript;

      if (finalTranscript) {
        onTextChange((prevText) => {
          const newText = prevText ? prevText + (prevText.endsWith(' ') || prevText.endsWith('\n') ? '' : ' ') + finalTranscript : finalTranscript;
          return newText;
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}. Please check your browser permissions.`);
      }
      setIsDictating(false);
    };

    recognition.onend = () => {
      setIsDictating(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTextChange]);

  const toggleDictation = useCallback(() => {
    if (!isSupported) {
      setError("Your browser doesn't support speech recognition. Try Google Chrome.");
      return;
    }

    if (isDictating) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Could not start dictation:", err);
      }
    }
  }, [isDictating, isSupported]);

  const interimText = currentInterimRef.current;

  return {
    isDictating,
    isSupported,
    error,
    toggleDictation,
    interimText
  };
};
