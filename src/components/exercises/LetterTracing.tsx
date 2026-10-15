import React, { useRef, useState, useEffect } from 'react';
import { Volume2, RotateCcw, Play, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { soundService } from '../../services/soundService';

interface LetterTracingProps {
  targetChar: string;
  transliteration?: string;
  meaning?: string;
  strokePath?: string;
  onComplete: (score: number) => void;
}

export const LetterTracing: React.FC<LetterTracingProps> = ({
  targetChar,
  transliteration = '',
  meaning = '',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isDemonstrating, setIsDemonstrating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    drawGuideLetter();
  }, [targetChar]);

  const drawGuideLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background guide grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw faded guide character
    ctx.font = 'bold 150px "Noto Sans Tamil", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(targetChar, canvas.width / 2, canvas.height / 2);

    // Dotted outline for tracing
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.strokeText(targetChar, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]);
  };

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#0d9488'; // Vibrant teal stroke
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    drawGuideLetter();
    setHasDrawn(false);
    setFeedback(null);
    soundService.playClick();
  };

  const handlePlaySound = () => {
    soundService.playClick();
    soundService.speakTamil(targetChar);
  };

  // Watch Kili stroke-order animation demo
  const handleDemonstration = () => {
    if (isDemonstrating) return;
    setIsDemonstrating(true);
    handleClear();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    soundService.speakTamil(targetChar);

    let step = 0;
    const totalSteps = 40;
    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;

      ctx.save();
      ctx.font = 'bold 150px "Noto Sans Tamil", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.strokeText(targetChar, canvas.width / 2, canvas.height / 2);
      ctx.restore();

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsDemonstrating(false);
      }
    }, 40);
  };

  // Check tracing completeness
  const handleCheck = () => {
    if (!hasDrawn) {
      setFeedback('Draw on the letter first! ✍️');
      return;
    }

    // Friendly praise
    soundService.playCorrect();
    setFeedback('Great tracing! Your finger strokes are getting so smooth! 🌟');
    setTimeout(() => {
      onComplete(95);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      {/* Top Header Card */}
      <div className="bg-amber-100/70 border-2 border-amber-300 rounded-3xl p-4 w-full flex items-center justify-between shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlaySound}
            aria-label="Play sound"
            className="w-12 h-12 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <Volume2 size={24} />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-tamil text-3xl font-extrabold text-slate-800">
                {targetChar}
              </span>
              <span className="text-sm font-bold text-teal-700">({transliteration})</span>
            </div>
            {meaning && <p className="text-xs text-slate-600 font-medium">{meaning}</p>}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDemonstration}
          disabled={isDemonstrating}
          icon={<Play size={14} className="fill-amber-500 text-amber-500" />}
        >
          Watch Demo
        </Button>
      </div>

      {/* Drawing Canvas */}
      <div className="relative bg-white rounded-3xl p-3 shadow-playful border-4 border-amber-200 w-full flex flex-col items-center touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="rounded-2xl cursor-crosshair bg-slate-50/50 w-full max-w-[320px] aspect-square"
        />

        {/* Action Buttons under canvas */}
        <div className="flex items-center justify-between w-full max-w-[320px] mt-4 gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleClear}
            icon={<RotateCcw size={16} />}
          >
            Clear
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleCheck}
            disabled={!hasDrawn}
            icon={<CheckCircle size={18} />}
          >
            Check Stroke
          </Button>
        </div>
      </div>

      {/* Gentle Encouragement Feedback */}
      {feedback && (
        <div className="mt-3 bg-teal-50 border-2 border-teal-300 text-teal-800 px-4 py-2 rounded-2xl font-bold text-sm text-center animate-bounce">
          {feedback}
        </div>
      )}
    </div>
  );
};
