export interface Transition {
  parameters: any;
  type: string;
}

export interface Cell {
  layer: number;
  slide: number;
  source: string;
  startTransition: Transition;
  endTransition: Transition;
}

export interface Set {
  id: string;
  cells: Cell[];
  layers: number;
  slides: number;
}

export type OptionalSet = {
  [Property in keyof Set]?: any;
};

export interface State {
  currentSet: string;
  currentCell: {
    layer: number;
    slide: number;
  };
  sets: Set[];
  loaded: boolean;
  saving: boolean;
  _recentlySaved: boolean;
}

export interface Store {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => any;
  state: State;
  rootState: any;
}
