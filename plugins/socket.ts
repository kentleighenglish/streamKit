import io from "socket.io-client";

export default ({ app }, inject) => {
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
