import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <span className="text-sm font-medium">Carregando...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
}
