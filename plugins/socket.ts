import { Plugin } from "@nuxt/types";
import io, { Socket } from "socket.io-client";
import { SocketClientEvents, SocketServerEvents } from "@/types/socket";

const plugin: Plugin = ({ app }, inject) => {
  const { socketPath } = app.$config;

  const { platform, userAgent } = window.navigator;

  const socket: Socket<SocketServerEvents, SocketClientEvents> = io(
    window.location.host,
    {
      path: socketPath,
      query: {
        platform,
        userAgent,
      },
    }
  );

  inject("socket", () => socket);
};

export default plugin;
