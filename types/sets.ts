export interface Transition {
  parameters: any;
  type: string;
}

export interface Cell {
  layer: number;
  slide: number;
  source?: string;
  startTransition?: Transition;
  endTransition?: Transition;
}

export interface Set {
  id: string;
  name: string;
  cells: Cell[];
  layers: number;
  slides: number;
}

export type OptionalSet = {
  [Property in keyof Set]?: any;
};
