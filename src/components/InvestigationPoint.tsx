import React from 'react';
import { CheckCircle2, Scan } from 'lucide-react';

interface InvestigationPointProps {
  id: string;
  title: string;
  subtitle: string;
  isInspected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

export const InvestigationPoint: React.FC<InvestigationPointProps> = ({
  title,
  subtitle,
  isInspected,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl border text-left font-mono transition-all duration-300 flex flex-col justify-between min-h-[110px] group ${
        isInspected
          ? 'bg-cyan-950/40 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/30'
          : 'bg-slate-950/80 border-slate-800 hover:border-cyan-400/80 text-slate-200 hover:shadow-lg hover:shadow-cyan-950/50 hover:scale-[1.02]'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isInspected ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-cyan-400 group-hover:text-cyan-300'}`}>
            {icon}
          </div>
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">
            {subtitle}
          </span>
        </div>

        {isInspected ? (
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ANALISADO</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded group-hover:animate-pulse">
            <Scan className="w-3.5 h-3.5" />
            <span>ESCANEAR</span>
          </span>
        )}
      </div>

      <div className="mt-3">
        <h4 className="text-xs md:text-sm font-bold tracking-wider text-white group-hover:text-cyan-300 transition">
          {title}
        </h4>
      </div>
    </button>
  );
};