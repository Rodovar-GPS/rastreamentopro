import React from 'react';
import { cn } from '../lib/utils';
import { ShipmentStatus } from '../types';

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const styles: Record<ShipmentStatus, string> = {
    pendente: 'bg-[#1A1A1A] text-brand-muted border-brand-border',
    em_transito: 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20',
    entregue: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelado: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const labels: Record<ShipmentStatus, string> = {
    pendente: 'Pendente',
    em_transito: 'Em Trânsito',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", styles[status])}>
      {labels[status]}
    </span>
  );
}
