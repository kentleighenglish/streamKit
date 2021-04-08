import { Socket } from "socket.io-client";
import { OptionalSet, Set } from "./sets";

export const socketEvents = {
  client: {
    CREATE_SET: "@CLIENT/CREATE_SET" as "@CLIENT/CREATE_SET",
    UPDATE_SET: "@CLIENT/UPDATE_SET" as "@CLIENT/UPDATE_SET",
  },
  server: {
    UPDATE_SETS: "@SERVER/UPDATE_SETS" as "@SERVER/UPDATE_SETS",
    UPDATE_DEVICES: "@SERVER/UPDATE_DEVICES" as "@SERVER/UPDATE_DEVICES",
  },
};

export interface Device {
  platform: string;
  userAgent: string;
}

export interface SocketClientEvents {
  [socketEvents.client.CREATE_SET]: (
    set: OptionalSet,
    callback?: (set: Set) => void
  ) => void;
  [socketEvents.client.UPDATE_SET]: (
    set: OptionalSet,
    callback?: (set: Set) => void
  ) => void;
}

export interface SocketServerEvents {
  [socketEvents.server.UPDATE_SETS]: (sets: Set[]) => void;
  [socketEvents.server.UPDATE_DEVICES]: (devices: Device[]) => void;
}

export type SocketClientInstance = Socket<
  SocketServerEvents,
  SocketClientEvents
>;

declare module "@nuxt/types" {
  interface Context {
    $socket: () => SocketClientInstance;
  }
  interface NuxtAppOptions {
    $socket: () => SocketClientInstance;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $socket: () => SocketClientInstance;
  }
}
