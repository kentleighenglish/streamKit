export interface Device {
  platform: string;
  userAgent: string;
}

export type Socket = any;

export interface State {
  devices: Device[];
  socket: Socket;
}

export interface Store {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => any;
  state: State;
  rootState: any;
}
