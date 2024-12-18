import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Modal({ title, onClose, children, icon }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}