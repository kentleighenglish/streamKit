import { createServer } from "http";
import { Server, Socket, BroadcastOperator } from "socket.io";
import { each } from "lodash";
import debugFunc from "debug";
import {
  SocketClientEvents,
  SocketServerEvents,
  socketEvents,
} from "../types/socket";

const debug = debugFunc("app:socket");
// const r = require("./rethink");

const m = {
  sets: {
    createSet: (data: any) => {},
    updateSet: (data: any) => {},
    fetchAll: () => [],
  },
};

const user = {
  id: "1",
};

interface SocketData {
  platform: string;
  userAgent: string;
}

interface SocketsData {
  [key: string]: SocketData;
}

const sockets: SocketsData = {};

const bindEvents = (io: Server, socket: Socket) => {
  each(events(io), (func, action) => {
    socket.on(action, (data: any, callback: any) => {
      debug(`Event Trigger: ${action}`);

      return func({ socket, data, callback });
    });
  });
};

interface SocketEvent {
  socket: Socket;
  callback: (args?: any) => void;
  data: any;
}

const events = (io: Server) => ({
  [socketEvents.client.CREATE_SET]: async ({
    socket,
    callback,
    data = {},
  }: SocketEvent) => {
    const { name = null } = data;

    const newSetId = await m.sets.createSet({
      name,
    });

    await updateSets(io.to(user.id));

    if (callback) {
      callback(newSetId);
    }
  },
  [socketEvents.client.UPDATE_SET]: async ({
    socket,
    callback,
    data = {},
  }: SocketEvent) => {
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
});

const updateSets = async (
  socket: Socket<SocketServerEvents> | BroadcastOperator<SocketServerEvents>
) => {
  const sets = await m.sets.fetchAll();

  debug(`Event Emit: ${socketEvents.server.UPDATE_SETS}`);
  socket.emit(socketEvents.server.UPDATE_SETS, sets);
};

export default function (this: any, options: { socketPath: string }) {
  this.nuxt.hook("render:before", () => {
    const server = createServer(this.nuxt.renderer.app);

    const io: Server = new Server<SocketClientEvents, SocketServerEvents>(
      server,
      {
        path: options.socketPath,
      }
    );

    this.nuxt.server.listen = (port: number, host: any) =>
      new Promise((resolve: (arg?: any) => void) =>
        server.listen(port || 3000, host || "localhost", resolve)
      );

    this.nuxt.hook("close", () => new Promise(server.close));

    io.on(
      "connection",
      async (socket: Socket<SocketServerEvents, SocketClientEvents>) => {
        debug("Socket connection");

        const {
          query: { platform = "", userAgent = "" },
        } = socket.handshake;

        socket.join(user.id);

        sockets[socket.id] = {
          platform: <string>platform,
          userAgent: <string>userAgent,
        };

        const roomSockets = await io.in(user.id).allSockets();
        // const devicesKeys = Object.keys(
        //   io.sockets.adapter.rooms[user.id].sockets
        // );

        io.to(user.id).emit(socketEvents.server.UPDATE_DEVICES, {
          devices: Array(...roomSockets.values()).reduce(
            (arr: SocketData[], socketId: string) => [
              ...arr,
              sockets[socketId],
            ],
            []
          ),
        });

        updateSets(socket);

        bindEvents(io, socket);
      }
    );
  });
}
