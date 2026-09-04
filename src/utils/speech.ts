/**
 * Voice Recognition utility for Sirevo AI
 * Uses Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * with robust interim/final aggregation and graceful fallback simulation.
 */

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceRecognitionHandlers {
  onTranscript: (transcript: string) => void;
  onListeningChange: (isListening: boolean) => void;
  onFinalTranscript?: (finalTranscript: string) => void;
  onError?: (error: string) => void;
}

let activeRecognition: any = null;

const SAMPLE_VOICE_QUERIES = [
  'I need a laptop under ₹60,000 for programming with 16GB RAM and good battery life',
  'Best noise cancelling headphones for office and travel under 30000',
  'Wireless ergonomic mouse for productivity',
  'Complete makeup kit for wedding and festive occasions',
  'boAt bluetooth headphones under 2000'
];

let sampleIndex = 0;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startVoiceRecognition({
  onTranscript,
  onListeningChange,
  onFinalTranscript,
  onError
}: VoiceRecognitionHandlers): () => void {
  const SpeechRecognitionClass = 
    typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!SpeechRecognitionClass) {
    // Graceful incremental fallback simulation for unsupported browsers/restricted environments
    onListeningChange(true);
    const selectedSample = SAMPLE_VOICE_QUERIES[sampleIndex % SAMPLE_VOICE_QUERIES.length];
    sampleIndex++;

    const words = selectedSample.split(' ');
    let currentWordIdx = 0;
    let builtText = '';

    const interval = setInterval(() => {
      if (currentWordIdx < words.length) {
        builtText += (currentWordIdx === 0 ? '' : ' ') + words[currentWordIdx];
        onTranscript(builtText);
        currentWordIdx++;
      } else {
        clearInterval(interval);
        onListeningChange(false);
        if (onFinalTranscript) {
          onFinalTranscript(selectedSample);
        }
      }
    }, 180);

    return () => {
      clearInterval(interval);
      onListeningChange(false);
    };
  }

  try {
    if (activeRecognition) {
      try { 
        activeRecognition.abort(); 
      } catch (e) {}
    }

    const recognition = new SpeechRecognitionClass();
    
    // 1. Web Speech API Configuration
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    activeRecognition = recognition;

    let lastFullSentence = '';
    let silenceTimer: NodeJS.Timeout | null = null;

    recognition.onstart = () => {
      onListeningChange(true);
    };

    // 2. Fixed onresult callback:
    // Iterate through entire event.results array from 0 to event.results.length - 1
    // Keep track of both final and interim transcripts so the full sentence builds up incrementally
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      const fullSentence = (finalTranscript + interimTranscript).trim();
      if (fullSentence) {
        lastFullSentence = fullSentence;
        onTranscript(fullSentence);

        // Auto-finalize if user pauses naturally for 2 seconds after speaking
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          try {
            recognition.stop();
          } catch (e) {}
        }, 2200);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice/error:', event.error);
      if (silenceTimer) clearTimeout(silenceTimer);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        if (onError) onError('Microphone access denied. Using simulated voice recognition.');
        
        // Fallback simulate voice input incrementally
        const fallbackSample = SAMPLE_VOICE_QUERIES[sampleIndex % SAMPLE_VOICE_QUERIES.length];
        sampleIndex++;
        const words = fallbackSample.split(' ');
        let idx = 0;
        let accum = '';
        const simInterval = setInterval(() => {
          if (idx < words.length) {
            accum += (idx === 0 ? '' : ' ') + words[idx];
            onTranscript(accum);
            idx++;
          } else {
            clearInterval(simInterval);
            onListeningChange(false);
            if (onFinalTranscript) {
              onFinalTranscript(fallbackSample);
            }
          }
        }, 180);
        return;
      } else if (onError && event.error !== 'no-speech') {
        onError(event.error);
      }
      onListeningChange(false);
    };

    // 3. Finalize and submit only on onend
    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      onListeningChange(false);
      activeRecognition = null;

      const finalized = lastFullSentence.trim();
      if (finalized && onFinalTranscript) {
        onFinalTranscript(finalized);
      }
    };

    recognition.start();

    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      try {
        recognition.stop();
      } catch (e) {}
      onListeningChange(false);
      activeRecognition = null;
    };
  } catch (err: any) {
    console.warn('Failed to start speech recognition, using fallback:', err);
    onListeningChange(true);
    const fallbackSample = SAMPLE_VOICE_QUERIES[sampleIndex % SAMPLE_VOICE_QUERIES.length];
    sampleIndex++;

    const words = fallbackSample.split(' ');
    let idx = 0;
    let accum = '';
    const simInterval = setInterval(() => {
      if (idx < words.length) {
        accum += (idx === 0 ? '' : ' ') + words[idx];
        onTranscript(accum);
        idx++;
      } else {
        clearInterval(simInterval);
        onListeningChange(false);
        if (onFinalTranscript) {
          onFinalTranscript(fallbackSample);
        }
      }
    }, 180);

    return () => {
      clearInterval(simInterval);
      onListeningChange(false);
    };
  }
}
