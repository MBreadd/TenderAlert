'use client';

import { useState } from 'react';
import { AlertCircle, Gauge, MoreVertical } from 'lucide-react';

export function ActionPlanItem({ item }: { item: { id: string; texto: string; cumplido: boolean } }) {
  const [completed, setCompleted] = useState(item.cumplido);

  return (
    <div className="p-6 flex items-start gap-6 hover:bg-[#ffffff] transition-colors group">
      <div className="mt-1">
        <input
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="w-5 h-5 rounded border-[#c3c6d5] text-[#00327d] focus:ring-[#00327d]/20 cursor-pointer"
          type="checkbox"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#1e1b19]">{item.texto}</h4>
          {completed ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-['Hanken_Grotesk'] text-[11px]">
              Completed
            </span>
          ) : (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-['Hanken_Grotesk'] text-[11px]">
              Pending
            </span>
          )}
        </div>
        <div className="flex gap-4 text-[#434653] font-['Hanken_Grotesk'] text-xs font-semibold">
          <span className={`flex items-center gap-1 ${!completed ? 'text-[#00327d]' : ''}`}>
            <AlertCircle className="w-4 h-4" /> 
            Priority: {completed ? 'Normal' : 'High'}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4" /> 
            Effort: Medium
          </span>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-2 transition-opacity text-[#434653]">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}
