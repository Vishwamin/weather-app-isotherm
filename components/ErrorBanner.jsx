'use client';

import { AlertTriangle, X } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-ember/10 border border-ember/30 rounded-lg px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-ember shrink-0 mt-0.5" />
      <p className="text-sm text-paper/90 flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-mist/50 hover:text-paper transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
