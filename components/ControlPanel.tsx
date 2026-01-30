import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, ChevronRight, Calculator, Activity, Waves } from 'lucide-react';
import { MathFunction, PlotState } from '../types';
import { FUNCTIONS } from '../constants';

interface ControlPanelProps {
  currentFunc: MathFunction;
  plotState: PlotState;
  onFuncChange: (f: MathFunction) => void;
  onStateChange: (s: PlotState) => void;
  onAskAI: () => void;
  isAiLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  currentFunc, 
  plotState, 
  onFuncChange, 
  onStateChange,
  onAskAI,
  isAiLoading
}) => {
  
  const handleSliderChange = (key: keyof PlotState, value: number) => {
    onStateChange({ ...plotState, [key]: value });
  };

  const toggleTerm = (term: 'showOrder0' | 'showOrder1' | 'showOrder2') => {
    // Logic for progressive disclosure
    let newState = { ...plotState };
    
    if (term === 'showOrder0') {
        newState.showOrder0 = !newState.showOrder0;
        if (!newState.showOrder0) { newState.showOrder1 = false; newState.showOrder2 = false; }
    } else if (term === 'showOrder1') {
        newState.showOrder1 = !newState.showOrder1;
        if (newState.showOrder1) newState.showOrder0 = true;
        if (!newState.showOrder1) newState.showOrder2 = false;
    } else if (term === 'showOrder2') {
        newState.showOrder2 = !newState.showOrder2;
        if (newState.showOrder2) { newState.showOrder0 = true; newState.showOrder1 = true; }
    }
    
    onStateChange(newState);
  };

  const getIcon = (id: string) => {
      switch(id) {
          case 'paraboloid': return <Activity size={18} />;
          case 'saddle': return <RotateCcw size={18} />;
          case 'sine_wave': return <Waves size={18} />;
          default: return <Calculator size={18} />;
      }
  }

  return (
    <div className="space-y-6">
      
      {/* Function Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">Select Example Equation</label>
        <div className="grid grid-cols-1 gap-2">
          {FUNCTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => onFuncChange(f)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                currentFunc.id === f.id 
                  ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className={`p-2 rounded-full ${currentFunc.id === f.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                {getIcon(f.id)}
              </div>
              <div>
                <div className="font-medium text-slate-900">{f.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{f.latex}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Point Position */}
      <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700">Expansion Point (x₀, y₀)</label>
            <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                ({plotState.x0.toFixed(1)}, {plotState.y0.toFixed(1)})
            </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>x: -2</span>
            <span>2</span>
          </div>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={plotState.x0}
            onChange={(e) => handleSliderChange('x0', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>y: -2</span>
            <span>2</span>
          </div>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={plotState.y0}
            onChange={(e) => handleSliderChange('y0', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Term Toggles */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">Approximation Order</label>
        <div className="flex flex-col gap-2">
            <button
                onClick={() => toggleTerm('showOrder0')}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border font-medium transition-colors ${
                    plotState.showOrder0 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-current text-white text-xs">0</span>
                    <span>Constant (Height)</span>
                </div>
                {plotState.showOrder0 && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </button>

            <button
                onClick={() => toggleTerm('showOrder1')}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border font-medium transition-colors ${
                    plotState.showOrder1 
                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-current text-white text-xs">1</span>
                    <span>Linear (Tangent Plane)</span>
                </div>
                {plotState.showOrder1 && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
            </button>

            <button
                onClick={() => toggleTerm('showOrder2')}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border font-medium transition-colors ${
                    plotState.showOrder2 
                    ? 'bg-pink-50 border-pink-500 text-pink-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-current text-white text-xs">2</span>
                    <span>Quadratic (Curvature)</span>
                </div>
                {plotState.showOrder2 && <div className="w-2 h-2 rounded-full bg-pink-500"></div>}
            </button>
        </div>
      </div>

      {/* AI Helper */}
      <button
        onClick={onAskAI}
        disabled={isAiLoading}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white p-3 rounded-xl font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAiLoading ? (
            <>Thinking...</>
        ) : (
            <>
                <HelpCircle size={20} />
                <span>Explain this State with AI</span>
            </>
        )}
      </button>

    </div>
  );
};

export default ControlPanel;
