import React, { useState } from 'react';
import Visualizer3D from './components/Visualizer3D';
import ControlPanel from './components/ControlPanel';
import FormulaViewer from './components/FormulaViewer';
import { FUNCTIONS } from './constants';
import { PlotState } from './types';
import { explainMathConcept } from './services/geminiService';
import { Box } from 'lucide-react';

export default function App() {
  const [currentFunc, setCurrentFunc] = useState(FUNCTIONS[0]);
  const [plotState, setPlotState] = useState<PlotState>({
    x0: 0.5,
    y0: 0.5,
    showOrder0: true,
    showOrder1: false,
    showOrder2: false,
  });
  
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiExplanation(null);
    
    const activeTerms = [];
    if (plotState.showOrder0) activeTerms.push("Order 0 (Base)");
    if (plotState.showOrder1) activeTerms.push("Order 1 (Linear Plane)");
    if (plotState.showOrder2) activeTerms.push("Order 2 (Quadratic/Curvature)");

    const explanation = await explainMathConcept(
        currentFunc, 
        plotState.x0, 
        plotState.y0, 
        activeTerms
    );
    
    setAiExplanation(explanation);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Box size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Taylor Series 3D Visualizer
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Second Order Expansion • f(x,y)
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visualization */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <Visualizer3D func={currentFunc} plotState={plotState} />
            </div>
            
            <FormulaViewer func={currentFunc} plotState={plotState} />

            {/* AI Explanation Box */}
            {aiExplanation && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm animate-fade-in">
                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">💡</span> AI Explanation
                    </h4>
                    <p className="text-orange-900 leading-relaxed whitespace-pre-line">
                        {aiExplanation}
                    </p>
                </div>
            )}

            {/* Educational Info - Static */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2">1. Base (Order 0)</h4>
                    <p className="text-sm text-slate-600">
                        It starts with the function's value at the point <code>(x₀,y₀)</code>. This is just a flat horizontal plane at that height.
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2">2. Slope (Order 1)</h4>
                    <p className="text-sm text-slate-600">
                        Adding first derivatives <code>fx</code> and <code>fy</code> creates a Tangent Plane. It tilts the surface to match the slope at the point.
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2">3. Curvature (Order 2)</h4>
                    <p className="text-sm text-slate-600">
                        Second derivatives <code>fxx, fyy, fxy</code> curve the plane into a paraboloid or saddle to match how the function bends.
                    </p>
                </div>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Configuration</h2>
                <ControlPanel 
                    currentFunc={currentFunc}
                    plotState={plotState}
                    onFuncChange={setCurrentFunc}
                    onStateChange={setPlotState}
                    onAskAI={handleAskAI}
                    isAiLoading={isAiLoading}
                />
             </div>
             
             {/* Legend */}
             <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold mb-4">Visual Guide</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#6366f1]"></div>
                        <span>Original Function Surface</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#ec4899]"></div>
                        <span>Taylor Approximation</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                        <span>Expansion Point (x₀, y₀)</span>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
