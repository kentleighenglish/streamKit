import { Plugin } from "@nuxt/types";
import io from "socket.io-client";

const plugin: Plugin = ({ app }, inject) => {
  const { socketPath } = app.$config;

  const { platform, userAgent } = window.navigator;

  const socket = io(socketPath, {
    query: {
      platform,
      userAgent,
    },
  });

  inject("socket", () => socket);
};

export default plugin;
