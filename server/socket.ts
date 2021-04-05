import http from "http";
import socketIO from "socket.io";
import { each } from "lodash";
import debugFunc from "debug";

const debug = debugFunc("app:socket");
// const r = require("./rethink");

const setTypes = {
  client: {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
  },
  server: {
    UPDATE_ALL: "UPDATE_ALL",
  },
};

const m = {
  sets: {
    createSet: () => {},
    updateSet: () => {},
    fetchAll: () => [],
  },
};

const user = {
  id: 1,
};

const sockets = {};

const bindEvents = (socket) => {
  each(events, (func, action) => {
    socket.on(action, (data, callback) => {
      debug(`Event Trigger: ${action}`);

      return func({ socket, data, callback });
    });
  });
};

const events = {
  [setTypes.client.CREATE]: async ({ socket, callback, data = {} }) => {
    const { name = null } = data;

    const newSetId = await m.sets.createSet({
      name,
    });

    await this.updateSets(this.io.to(user.id));

    if (callback) {
      callback(newSetId);
    }
  },
  [setTypes.client.UPDATE]: async ({ socket, callback, data = {} }) => {
    const { id, name, layers, slides, cells } = data;

    await m.sets.updateSet({
      id,
      name,
      layers,
      slides,
      cells,
    });

    if (callback) {
      callback();
    }
  },
};

const updateSets = async (socket) => {
  const sets = await m.sets.fetchAll();

  debug(`Event Emit: ${setTypes.server.UPDATE_ALL}`);
  socket.emit(setTypes.server.UPDATE_ALL, sets);
};

export default function () {
  this.nuxt.hook("render:before", (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app);

    const io = socketIO(server);

    this.nuxt.server.listen = (port, host) =>
      new Promise((resolve) =>
        server.listen(port || 3000, host || "localhost", resolve)
      );

    this.nuxt.hook("close", () => new Promise(server.close));

    io.on("connection", (socket) => {
      debug("Socket connection");

      const {
        query: { platform = "", userAgent = "" },
      } = socket.handshake;

      socket.join(user.id);

      sockets[socket.id] = {
        platform,
        userAgent,
      };

      const devicesKeys = Object.keys(
        io.sockets.adapter.rooms[user.id].sockets
      );

      io.to(user.id).emit("%DEVICES/UPDATE", {
        devices: devicesKeys.reduce(
          (arr, socketId) => [...arr, sockets[socketId]],
          []
        ),
      });

      updateSets(socket);

      bindEvents(socket);
    });
  });
}
