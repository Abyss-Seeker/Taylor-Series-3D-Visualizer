import React, { useEffect, useRef } from 'react';
import { MathFunction, PlotState } from '../types';
import { COLOR_PALETTE } from '../constants';

interface Visualizer3DProps {
  func: MathFunction;
  plotState: PlotState;
}

const Visualizer3D: React.FC<Visualizer3DProps> = ({ func, plotState }) => {
  const plotContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotContainerRef.current) return;

    // Grid configuration
    const size = 6;
    const step = 0.2; // Resolution
    const range = { min: -3, max: 3 };
    
    const xValues: number[] = [];
    const yValues: number[] = [];
    
    for (let i = range.min; i <= range.max; i += step) {
      xValues.push(i);
      yValues.push(i);
    }

    // 1. Calculate Real Function Surface
    const zReal: number[][] = [];
    for (let i = 0; i < yValues.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < xValues.length; j++) {
        row.push(func.evaluate(xValues[j], yValues[i]));
      }
      zReal.push(row);
    }

    // 2. Calculate Taylor Approximation Surface
    const zApprox: number[][] = [];
    
    // Calculate derivatives at (x0, y0) once
    const f0 = func.evaluate(plotState.x0, plotState.y0);
    const fx = func.df_dx(plotState.x0, plotState.y0);
    const fy = func.df_dy(plotState.x0, plotState.y0);
    const fxx = func.d2f_dx2(plotState.x0, plotState.y0);
    const fyy = func.d2f_dy2(plotState.x0, plotState.y0);
    const fxy = func.d2f_dxdy(plotState.x0, plotState.y0);

    for (let i = 0; i < yValues.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < xValues.length; j++) {
        const dx = xValues[j] - plotState.x0;
        const dy = yValues[i] - plotState.y0;

        let val = 0;
        
        // 0th Order
        if (plotState.showOrder0) {
            val += f0;
        }

        // 1st Order
        if (plotState.showOrder1) {
            val += (fx * dx) + (fy * dy);
        }

        // 2nd Order
        if (plotState.showOrder2) {
            val += 0.5 * ((fxx * dx * dx) + (2 * fxy * dx * dy) + (fyy * dy * dy));
        }

        row.push(val);
      }
      zApprox.push(row);
    }

    const data: any[] = [
      // Actual Function
      {
        type: 'surface',
        x: xValues,
        y: yValues,
        z: zReal,
        opacity: 0.6,
        showscale: false,
        name: 'f(x,y)',
        colorscale: [[0, COLOR_PALETTE.function], [1, '#818cf8']],
        contours: {
            z: { show: true, usecolormap: true, highlightcolor: "#42f546", project: { z: true } }
        }
      },
      // Point (x0, y0)
      {
        type: 'scatter3d',
        mode: 'markers',
        x: [plotState.x0],
        y: [plotState.y0],
        z: [f0],
        marker: {
            size: 6,
            color: COLOR_PALETTE.point,
        },
        name: '(x₀, y₀)'
      }
    ];

    // Only add approximation surface if at least one term is active
    if (plotState.showOrder0 || plotState.showOrder1 || plotState.showOrder2) {
        data.push({
            type: 'surface',
            x: xValues,
            y: yValues,
            z: zApprox,
            opacity: 0.85,
            showscale: false,
            name: 'Taylor Approx',
            colorscale: [[0, COLOR_PALETTE.approx], [1, '#f9a8d4']],
            surfacecolor: zApprox.map(row => row.map(() => 1)) // Solid color effect
        });
    }

    const layout = {
      margin: { l: 0, r: 0, b: 0, t: 0 },
      scene: {
        camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        zaxis: { title: 'f(x,y)' },
        aspectmode: 'cube'
      },
      showlegend: false,
      height: 500,
      autosize: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    };

    // Access Plotly via window
    const Plotly = (window as any).Plotly;
    Plotly.react(plotContainerRef.current, data, layout, {displayModeBar: false});

  }, [func, plotState]);

  return <div ref={plotContainerRef} className="w-full h-[500px] bg-white rounded-xl shadow-inner border border-slate-200" />;
};

export default Visualizer3D;
