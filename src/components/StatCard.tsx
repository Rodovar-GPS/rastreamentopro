import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  subtitleClass?: string;
  progress?: {
    value: number;
    colorClass: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, subtitleClass, progress, className }: StatCardProps) {
  return (
    <div className={cn("bg-brand-gray p-6 rounded-xl border border-brand-border shadow-md flex flex-col", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{title}</p>
        <Icon className="w-5 h-5 text-brand-yellow/70" />
      </div>
      
      {progress ? (
         <>
           <div className="flex items-end gap-2 mt-3">
             <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
             {subtitle && <span className={cn("mb-1 text-sm font-semibold uppercase tracking-wide", subtitleClass || "text-brand-muted")}>{subtitle}</span>}
           </div>
           <div className="w-full bg-brand-black border border-brand-border h-2 rounded-full mt-4">
             <div className={cn("h-full rounded-full shadow-lg", progress.colorClass)} style={{ width: `${progress.value}%` }}></div>
           </div>
         </>
      ) : (
         <>
           <div className="mt-3">
             <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
           </div>
           {trend && (
             <p className={cn(
               "text-xs font-bold mt-3 uppercase tracking-wide",
               trend.isPositive ? "text-green-500" : "text-red-500"
             )}>
               {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% <span className="text-brand-muted font-medium ml-1">vs mês anterior</span>
             </p>
           )}
           {!trend && subtitle && (
             <p className={cn("text-xs font-bold mt-3 uppercase tracking-wide", subtitleClass || "text-brand-muted")}>
               {subtitle}
             </p>
           )}
         </>
      )}
    </div>
  );
}
