import React from 'react';
import { MathFunction, PlotState } from '../types';

interface FormulaViewerProps {
  func: MathFunction;
  plotState: PlotState;
}

const FormulaViewer: React.FC<FormulaViewerProps> = ({ func, plotState }) => {
  const f0 = func.evaluate(plotState.x0, plotState.y0).toFixed(2);
  const fx = func.df_dx(plotState.x0, plotState.y0).toFixed(2);
  const fy = func.df_dy(plotState.x0, plotState.y0).toFixed(2);
  const fxx = func.d2f_dx2(plotState.x0, plotState.y0).toFixed(2);
  const fyy = func.d2f_dy2(plotState.x0, plotState.y0).toFixed(2);
  const fxy = func.d2f_dxdy(plotState.x0, plotState.y0).toFixed(2);

  const getStyle = (isActive: boolean) => isActive ? "opacity-100 transform scale-105" : "opacity-30 blur-[1px]";

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Current Taylor Expansion</h3>
      
      <div className="font-mono text-lg md:text-xl leading-relaxed text-slate-800 break-words">
        <span>f(x,y) ≈ </span>
        
        {/* Order 0 */}
        <span className={`inline-block transition-all duration-300 ${getStyle(plotState.showOrder0)} text-blue-600 font-bold mx-1`}>
          {f0}
        </span>

        {/* Order 1 */}
        <span className={`inline-block transition-all duration-300 ${getStyle(plotState.showOrder1)} mx-1`}>
          <span className="text-slate-400">+</span>
          <span className="text-purple-600"> ({fx})(x-x₀) </span>
          <span className="text-slate-400">+</span>
          <span className="text-purple-600"> ({fy})(y-y₀) </span>
        </span>

        {/* Order 2 */}
        <span className={`inline-block transition-all duration-300 ${getStyle(plotState.showOrder2)} mx-1`}>
           <span className="text-slate-400">+</span>
           <span className="text-pink-600"> 0.5 </span>
           <span className="text-slate-600">[</span>
           <span className="text-pink-600">({fxx})(x-x₀)²</span>
           <span className="text-slate-400"> + </span>
           <span className="text-pink-600">2({fxy})(x-x₀)(y-y₀)</span>
           <span className="text-slate-400"> + </span>
           <span className="text-pink-600">({fyy})(y-y₀)²</span>
           <span className="text-slate-600">]</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
        <div className={`p-2 rounded ${plotState.showOrder0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>
            <strong>Order 0</strong><br/>Height (Base)
        </div>
        <div className={`p-2 rounded ${plotState.showOrder1 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-400'}`}>
            <strong>Order 1</strong><br/>Slope (Plane)
        </div>
        <div className={`p-2 rounded ${plotState.showOrder2 ? 'bg-pink-100 text-pink-800' : 'bg-slate-100 text-slate-400'}`}>
            <strong>Order 2</strong><br/>Curvature
        </div>
      </div>
    </div>
  );
};

export default FormulaViewer;
