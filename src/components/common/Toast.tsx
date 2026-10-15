import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Star, Award, X } from 'lucide-react';
import { useToastStore, ToastMessage } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastIcon = (toast: ToastMessage) => {
    if (toast.icon) return <span className="text-xl">{toast.icon}</span>;
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={22} />;
      case 'error':
        return <AlertCircle className="text-coral-500" size={22} />;
      case 'star':
        return <Star className="text-amber-500 fill-amber-400" size={22} />;
      case 'badge':
        return <Award className="text-purple-500" size={22} />;
      default:
        return <Info className="text-sky-500" size={22} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-slate-100 flex items-start gap-3 relative"
          >
            <div className="shrink-0 mt-0.5">{getToastIcon(toast)}</div>
            <div className="flex-1 pr-6">
              <h4 className="font-extrabold text-sm text-slate-800">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5 font-medium">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
