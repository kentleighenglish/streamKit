export const socketEvents = {
  client: {
    CREATE_SET: "@CLIENT/CREATE_SET" as "@CLIENT/CREATE_SET",
    UPDATE_SET: "@CLIENT/UPDATE_SET" as "@CLIENT/UPDATE_SET",
  },
  server: {
    UPDATE_SETS: "@SERVER/UPDATE_SETS" as "@SERVER/UPDATE_SETS",
  },
};

export interface SocketClientEvents {
  [socketEvents.client.CREATE_SET]: (set: any) => void;
  [socketEvents.client.UPDATE_SET]: (set: any) => void;
}

export interface SocketServerEvents {
  [socketEvents.server.UPDATE_SETS]: (sets: any) => void;
}

export interface Device {
  platform: string;
  userAgent: string;
}

export type Socket = any;
