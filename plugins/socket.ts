import { Plugin } from "@nuxt/types";
import io from "socket.io-client";
import { SocketClientInstance } from "@/types/socket";

const plugin: Plugin = ({ app }, inject) => {
  const { socketPath } = app.$config;

  const { platform, userAgent } = window.navigator;

  const socket: SocketClientInstance = io(window.location.host, {
    path: socketPath,
    query: {
      platform,
      userAgent,
    },
  });

  inject("socket", () => socket);
};

export default plugin;
