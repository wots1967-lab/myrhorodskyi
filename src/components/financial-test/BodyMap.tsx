import React from 'react';
import { cn } from '@/lib/utils';

interface BodyMapProps {
  selected: string[];
  onToggle: (zone: string) => void;
}

const zones = [
  { id: 'Голова', path: 'M 95,30 C 95,15 105,5 115,5 C 125,5 135,15 135,30 C 135,45 125,55 115,55 C 105,55 95,45 95,30 Z', label: { x: 115, y: 32 } },
  { id: 'Горло', path: 'M 107,55 L 123,55 L 120,70 L 110,70 Z', label: { x: 115, y: 64 } },
  { id: 'Груди', path: 'M 85,70 L 145,70 L 148,110 L 82,110 Z', label: { x: 115, y: 92 } },
  { id: 'Живіт', path: 'M 82,110 L 148,110 L 145,155 L 85,155 Z', label: { x: 115, y: 134 } },
  { id: 'Руки', path: 'M 55,75 L 85,70 L 82,130 L 72,130 L 60,95 Z M 145,70 L 175,75 L 170,95 L 158,130 L 148,130 Z', label: { x: 55, y: 100 } },
  { id: 'Ноги', path: 'M 85,155 L 110,155 L 108,230 L 100,250 L 88,250 L 85,230 Z M 120,155 L 145,155 L 145,230 L 142,250 L 130,250 L 122,230 Z', label: { x: 115, y: 200 } },
];

const BodyMap: React.FC<BodyMapProps> = ({ selected, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="40 0 150 260" className="w-48 h-auto mx-auto select-none" aria-label="Силует тіла">
        {zones.map((zone) => {
          const isSelected = selected.includes(zone.id);
          return (
            <g key={zone.id} onClick={() => onToggle(zone.id)} className="cursor-pointer" role="button" aria-pressed={isSelected} tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(zone.id); } }}>
              <path
                d={zone.path}
                className={cn(
                  'transition-colors duration-200 stroke-primary/40 stroke-[1.5]',
                  isSelected ? 'fill-primary/50' : 'fill-muted hover:fill-primary/20'
                )}
              />
              <text
                x={zone.label.x}
                y={zone.label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'text-[8px] pointer-events-none select-none',
                  isSelected ? 'fill-primary-foreground font-semibold' : 'fill-foreground/60'
                )}
              >
                {zone.id}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Fallback chip buttons for accessibility */}
      <div className="flex flex-wrap gap-2 justify-center">
        {zones.map((zone) => {
          const isSelected = selected.includes(zone.id);
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onToggle(zone.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors min-h-[36px]',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary/50'
              )}
            >
              {zone.id}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onToggle('Ніде / нейтрально')}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm border transition-colors min-h-[36px]',
            selected.includes('Ніде / нейтрально')
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:border-primary/50'
          )}
        >
          Ніде / нейтрально
        </button>
      </div>
    </div>
  );
};

export default BodyMap;
