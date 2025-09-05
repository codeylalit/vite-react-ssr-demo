import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { languages } from '../data/languages';

interface ScriptSelectorProps {
  selectedScript: string;
  onScriptChange: (script: string) => void;
  className?: string;
}

// Simple mapping of script names to representative emoji / glyph
const scriptIcons: Record<string, string> = {
  Latin: '🔤',
  Devanagari: '🕉️',
  Cyrillic: 'Я',
  Arabic: '📜',
  Chinese: '漢',
  Japanese: 'あ',
  Korean: '한',
  Bengali: 'অ',
  Tamil: 'அ',
  Gujarati: 'અ',
  Thai: 'ก',
  Greek: 'Ω',
  Hebrew: 'א',
};

const getScriptIcon = (script: string): string => scriptIcons[script] || '🔡';

const ScriptSelector: React.FC<ScriptSelectorProps> = ({
  selectedScript,
  onScriptChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (s: string) => {
      onScriptChange(s);
      setIsOpen(false);
    },
    [onScriptChange]
  );

  // Helper to parse speaker strings like "1530M"
  const parseSpeakers = (val: string): number => {
    const match = val.match(/([\d.]+)\s*([MBK]?)/i);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    const suffix = match[2]?.toUpperCase();
    switch (suffix) {
      case 'B':
        return num * 1_000_000_000;
      case 'M':
        return num * 1_000_000;
      case 'K':
        return num * 1_000;
      default:
        return num;
    }
  };

  // Build totals per script
  const scriptTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    languages.forEach(lang => {
      const num = parseSpeakers(lang.speakers);
      totals[lang.script] = (totals[lang.script] || 0) + num;
    });
    return Object.entries(totals)
      .map(([script, total]) => ({ script, total }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const formatSpeakers = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return n.toString();
  };

  const scriptOptions = useMemo(() => scriptTotals, [scriptTotals]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:bg-white hover:border-purple-300 group shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label={selectedScript}>
              {getScriptIcon(selectedScript)}
            </span>
            <div>
              <div className="text-gray-900 font-medium text-sm">{selectedScript}</div>
              <div className="text-gray-600 text-xs flex items-center space-x-1">
                <Users className="w-3 h-3" aria-hidden="true" />
                <span>
                  {formatSpeakers(
                    scriptTotals.find(st => st.script === selectedScript)?.total || 0
                  )}{' '}
                  speakers
                </span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200/50 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
          role="listbox"
          aria-label="Script selection"
          style={{ zIndex: 99999 }}
        >
          {scriptOptions.map(opt => (
            <button
              key={opt.script}
              onClick={() => handleSelect(opt.script)}
              className={`w-full p-4 text-left transition-all duration-200 border-b border-purple-100/50 last:border-b-0 group flex items-center space-x-3 ${
                selectedScript === opt.script ? 'bg-purple-50/60' : 'hover:bg-purple-50/50'
              }`}
              role="option"
              aria-selected={selectedScript === opt.script}
            >
              <span className="text-xl" role="img" aria-label={opt.script}>
                {getScriptIcon(opt.script)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900">{opt.script}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-purple-700 bg-purple-100">
                    {formatSpeakers(opt.total)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptSelector;
