import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, X, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { soundService } from '../../services/soundService';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 w-full max-w-sm text-center relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-3xl shadow-inner mb-4">
          👋
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-2">
          {t('exitDialogTitle')}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">
          {t('exitDialogMsg')}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundService.playClick();
              onConfirm();
            }}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-2xl shadow-playful flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm"
          >
            <LogOut size={16} />
            <span>{t('exitConfirmBtn')}</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold py-2.5 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm"
          >
            <span>{t('exitCancelBtn')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
