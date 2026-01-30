import { MathFunction } from './types';

export const FUNCTIONS: MathFunction[] = [
  {
    id: 'paraboloid',
    name: 'Circular Paraboloid',
    latex: 'f(x,y) = x^2 + y^2',
    description: 'A classic bowl shape. Simple curvature, easy to visualize approximation.',
    evaluate: (x, y) => x * x + y * y,
    df_dx: (x, y) => 2 * x,
    df_dy: (x, y) => 2 * y,
    d2f_dx2: () => 2,
    d2f_dy2: () => 2,
    d2f_dxdy: () => 0,
  },
  {
    id: 'saddle',
    name: 'Hyperbolic Paraboloid (Saddle)',
    latex: 'f(x,y) = x^2 - y^2',
    description: 'Curved up in one direction, down in the other. Shows why mixed terms matter.',
    evaluate: (x, y) => x * x - y * y,
    df_dx: (x, y) => 2 * x,
    df_dy: (x, y) => -2 * y,
    d2f_dx2: () => 2,
    d2f_dy2: () => -2,
    d2f_dxdy: () => 0,
  },
  {
    id: 'sine_wave',
    name: 'Sine Cosine Wave',
    latex: 'f(x,y) = \\sin(x) \\cdot \\cos(y)',
    description: 'Complex oscillating surface. Best for seeing local vs global approximation.',
    evaluate: (x, y) => Math.sin(x) * Math.cos(y),
    df_dx: (x, y) => Math.cos(x) * Math.cos(y),
    df_dy: (x, y) => -Math.sin(x) * Math.sin(y),
    d2f_dx2: (x, y) => -Math.sin(x) * Math.cos(y),
    d2f_dy2: (x, y) => -Math.sin(x) * Math.cos(y),
    d2f_dxdy: (x, y) => -Math.cos(x) * Math.sin(y),
  },
];

export const COLOR_PALETTE = {
  function: '#6366f1', // Indigo
  approx: '#ec4899',   // Pink
  point: '#ef4444',    // Red
};
