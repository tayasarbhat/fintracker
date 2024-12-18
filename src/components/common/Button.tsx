import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center px-4 py-2 rounded-xl transition-colors font-medium';
  
  const variantStyles = {
    primary: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30',
    secondary: 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/20',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}