import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';
import { ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface CalculatorAppProps {
  theme: ThemeConfig;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ theme }) => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit: string) => {
    playUiClick();
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    playUiClick();
    setFormula(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    playUiClick();
    setDisplay('0');
    setFormula('');
  };

  const handleDelete = () => {
    playUiClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEqual = () => {
    playUiClick();
    try {
      const fullExpression = formula + display;
      // Sanitize expression
      const cleanExpr = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${cleanExpr})`)();
      const rounded = Math.round(result * 10000000) / 10000000;
      setHistory([`${fullExpression} = ${rounded}`, ...history.slice(0, 8)]);
      setDisplay(String(rounded));
      setFormula('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div
      className="h-full p-4 flex flex-col justify-between select-none"
      style={{ backgroundColor: theme.colors.surfaceVariant }}
    >
      {/* Top bar with History toggle */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span className="font-bold">STANDARD</span>
        <button
          onClick={() => {
            playUiClick();
            setShowHistory(!showHistory);
          }}
          className="p-1 hover:text-black transition-colors cursor-pointer"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {showHistory && (
        <div className="p-3 mb-2 rounded-2xl bg-white/70 border border-black/5 text-xs space-y-1 max-h-28 overflow-y-auto">
          <div className="font-bold opacity-60">History</div>
          {history.length === 0 ? (
            <div className="text-gray-400">No calculation history</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="font-mono text-gray-700">
                {h}
              </div>
            ))
          )}
        </div>
      )}

      {/* Screen / Display */}
      <div className="flex-1 flex flex-col justify-end text-right px-2 py-4">
        <div className="text-xs text-gray-500 font-mono h-4">{formula}</div>
        <div className="font-['DM_Serif_Display'] text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 truncate">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={handleClear}
          className="h-12 rounded-2xl bg-rose-200 text-rose-900 font-bold hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          AC
        </button>
        <button
          onClick={handleDelete}
          className="h-12 rounded-2xl bg-rose-100 text-rose-900 font-bold flex items-center justify-center hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOperator('%')}
          className="h-12 rounded-2xl bg-rose-100 text-rose-900 font-bold hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="h-12 rounded-2xl bg-amber-200 text-amber-900 font-bold text-lg hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          ÷
        </button>

        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="h-12 rounded-2xl bg-white font-bold text-base shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('×')}
          className="h-12 rounded-2xl bg-amber-200 text-amber-900 font-bold text-lg hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          ×
        </button>

        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="h-12 rounded-2xl bg-white font-bold text-base shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="h-12 rounded-2xl bg-amber-200 text-amber-900 font-bold text-lg hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          -
        </button>

        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="h-12 rounded-2xl bg-white font-bold text-base shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="h-12 rounded-2xl bg-amber-200 text-amber-900 font-bold text-lg hover:brightness-95 active:scale-95 transition-all cursor-pointer"
        >
          +
        </button>

        <button
          onClick={() => {
            playUiClick();
            setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
          }}
          className="h-12 rounded-2xl bg-white font-bold hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="h-12 rounded-2xl bg-white font-bold text-base shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          0
        </button>
        <button
          onClick={() => {
            if (!display.includes('.')) handleDigit('.');
          }}
          className="h-12 rounded-2xl bg-white font-bold text-base shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="h-12 rounded-2xl bg-[#c85252] text-white font-bold text-lg shadow-md hover:bg-[#b04242] active:scale-95 transition-all cursor-pointer"
        >
          =
        </button>
      </div>
    </div>
  );
};
