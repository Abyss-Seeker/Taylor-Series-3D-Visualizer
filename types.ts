export interface MathFunction {
  id: string;
  name: string;
  latex: string;
  description: string;
  // Function to evaluate f(x,y)
  evaluate: (x: number, y: number) => number;
  // First derivatives
  df_dx: (x: number, y: number) => number;
  df_dy: (x: number, y: number) => number;
  // Second derivatives
  d2f_dx2: (x: number, y: number) => number;
  d2f_dy2: (x: number, y: number) => number;
  d2f_dxdy: (x: number, y: number) => number;
}

export interface PlotState {
  x0: number;
  y0: number;
  showOrder0: boolean;
  showOrder1: boolean;
  showOrder2: boolean;
}

export enum TermType {
  CONST = 'CONST',
  LINEAR = 'LINEAR',
  QUAD = 'QUAD',
  MIXED = 'MIXED'
}