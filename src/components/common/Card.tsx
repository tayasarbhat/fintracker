import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function Card({ title, icon: Icon, children, action }: CardProps) {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-blue-400" />}
          <h3 className="text-xl font-semibold text-white/90">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}