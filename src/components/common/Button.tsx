import React from 'react';
import { soundService } from '../../services/soundService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'kili' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      soundService.playClick();
      onClick?.(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-2xl transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary:
      'bg-amber-400 hover:bg-amber-300 active:bg-amber-400 text-slate-900 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-md hover:shadow',
    secondary:
      'bg-teal-500 hover:bg-teal-400 active:bg-teal-500 text-white border-b-4 border-teal-700 active:border-b-0 active:translate-y-1 shadow-md hover:shadow',
    coral:
      'bg-coral-500 hover:bg-coral-400 active:bg-coral-500 text-white border-b-4 border-coral-700 active:border-b-0 active:translate-y-1 shadow-md hover:shadow',
    kili:
      'bg-kili-500 hover:bg-kili-400 active:bg-kili-500 text-white border-b-4 border-kili-700 active:border-b-0 active:translate-y-1 shadow-md hover:shadow',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 border-b-4 border-b-slate-400 active:border-b-2 active:translate-y-0.5',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
    xl: 'text-lg md:text-xl px-8 py-4 gap-3 rounded-3xl shadow-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
