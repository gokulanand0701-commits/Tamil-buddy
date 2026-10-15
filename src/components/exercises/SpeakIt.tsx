import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { SpeechWaveform } from '../common/SpeechWaveform';
import { TamilWord } from '../common/TamilWord';
import { speechService } from '../../services/speechService';
import { soundService } from '../../services/soundService';
import { SpeechEvalResponse } from '../../types';

interface SpeakItProps {
  prompt: string;
  targetTamil: string;
  targetTranslit?: string;
  targetMeaning?: string;
  onComplete: (score: number) => void;
}

export const SpeakIt: React.FC<SpeakItProps> = ({
  prompt,
  targetTamil,
  targetTranslit = '',
  targetMeaning = '',
  onComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<SpeechEvalResponse | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleListenSample = () => {
    soundService.playClick();
    soundService.speakTamil(targetTamil);
  };

  const startRecording = async () => {
    soundService.playClick();
    setEvalResult(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((track) => track.stop());
          evaluateAudio(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {
        // Fallback for browsers without mic permission
        simulateRecording();
      }
    } catch (err) {
      console.warn('Microphone access denied or unsupported, simulating voice input', err);
      simulateRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsEvaluating(true);
    }
  };

  // Fallback simulator if mic is blocked in test environment
  const simulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setIsEvaluating(true);
      evaluateAudio(null);
    }, 2000);
  };

  const evaluateAudio = async (audioBlob: Blob | null) => {
    try {
      const result = await speechService.evaluateSpeech(audioBlob, targetTamil);
      setEvalResult(result);
      setIsEvaluating(false);

      if (result.score >= 70) {
        soundService.playCorrect();
      } else {
        soundService.playIncorrect();
      }
    } catch (err) {
      setIsEvaluating(false);
    }
  };

  const handleTryAgain = () => {
    setEvalResult(null);
    soundService.playClick();
  };

  const handleFinish = () => {
    if (evalResult) {
      onComplete(evalResult.score);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      {/* Exercise Instruction Banner */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-200/80 border-2 border-amber-300 rounded-3xl p-4 w-full mb-6 text-center shadow-sm">
        <h3 className="font-extrabold text-base md:text-lg text-slate-800">{prompt}</h3>
        <p className="text-xs font-semibold text-amber-800 mt-1">
          Listen first, then speak into the mic!
        </p>
      </div>

      {/* Target Word Card with 3 layers */}
      <div className="bg-white border-4 border-amber-200 rounded-3xl p-6 w-full flex flex-col items-center shadow-playful mb-6 relative">
        <TamilWord
          tamil={targetTamil}
          transliteration={targetTranslit}
          meaning={targetMeaning}
          size="hero"
          showAudio={true}
        />

        <button
          type="button"
          onClick={handleListenSample}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-full transition-all"
        >
          <Volume2 size={16} /> Listen to Kili's pronunciation
        </button>
      </div>

      {/* Speech Evaluation Result Card */}
      {evalResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-md mb-6 flex flex-col items-center"
        >
          {/* Circular Score Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-xl border-4 ${
                evalResult.score >= 80
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : evalResult.score >= 60
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-rose-400 bg-rose-50 text-rose-700'
              }`}
            >
              <span>{evalResult.score}</span>
              <span className="text-[10px] uppercase font-bold leading-none">score</span>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">
                {evalResult.score >= 80 ? '🌟 Awesome Speech!' : '👍 Good Try!'}
              </h4>
              <p className="text-xs text-slate-600 font-medium">{evalResult.feedback_text}</p>
            </div>
          </div>

          {/* Per-Word Color Feedback: Green / Purple / Red */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4">
            <span className="text-[11px] font-bold uppercase text-slate-500 block mb-2">
              Word-by-word pronunciation accuracy:
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {evalResult.per_word.map((pw, i) => {
                let badgeStyle =
                  pw.status === 'correct'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : pw.status === 'close'
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300';

                return (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-xl border font-bold text-sm flex flex-col items-center ${badgeStyle}`}
                  >
                    <span className="font-tamil">{pw.word}</span>
                    <span className="text-[10px] font-semibold uppercase opacity-80">
                      {pw.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Actions */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleTryAgain}
              icon={<RotateCcw size={16} />}
            >
              Try Again
            </Button>
            <Button
              variant="kili"
              size="md"
              fullWidth
              onClick={handleFinish}
              icon={<CheckCircle size={18} />}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}

      {/* Recording Controls when not showing results */}
      {!evalResult && (
        <div className="flex flex-col items-center w-full">
          {/* Waveform Animation */}
          <SpeechWaveform isRecording={isRecording} className="mb-2" />

          {isEvaluating ? (
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm bg-teal-50 px-4 py-2 rounded-2xl animate-pulse">
              <Sparkles size={18} />
              Evaluating pronunciation...
            </div>
          ) : !isRecording ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-coral-500 hover:bg-coral-400 text-white flex items-center justify-center shadow-lg border-b-4 border-coral-700 transition-all cursor-pointer group"
            >
              <Mic size={36} className="group-hover:scale-110 transition-transform" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg border-b-4 border-rose-800 transition-all cursor-pointer animate-pulse"
            >
              <Square size={30} />
            </motion.button>
          )}

          <span className="text-xs font-bold text-slate-500 mt-3">
            {isRecording ? 'Listening... Tap square when done! ⏹️' : 'Tap mic to start speaking 🎙️'}
          </span>
        </div>
      )}
    </div>
  );
};
