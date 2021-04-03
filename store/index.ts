import Vue from "vue";
import createLogger from "vuex/dist/logger";
import debugFunc from "debug";

export const MUTATION_TYPES = {
  UPDATE_DEVICES: "@UPDATE_DEVICES",
  ADD_SOCKET: "@ADD_SOCKET",
};

const middleware = [];

const loggingMiddleware = (store) => {
  store.subscribe((mutation, state) => {
    const debug = debugFunc("app:store");
    debug("Store mutation", mutation.type);
  });
};

if (process.env.NODE_ENV === "development") {
  if (process.env.VUE_ENV === "server") {
    middleware.push(loggingMiddleware);
  } else {
    middleware.push(createLogger());
  }
}

export const plugins = middleware;

export const state = () => ({
  socket: null,
  devices: [],
});

export const actions = {
  addSocket: ({ commit }, socket) => {
    commit(MUTATION_TYPES.ADD_SOCKET, socket);
  },
  updateDevices: ({ commit }, devices) => {
    commit(MUTATION_TYPES.UPDATE_DEVICES, devices);
  },
};

export const mutations = {
  [MUTATION_TYPES.ADD_SOCKET](state, socket) {
    Vue.set(state, "socket", socket);
  },
  [MUTATION_TYPES.UPDATE_DEVICES](state, devices) {
    Vue.set(state, "devices", devices);
  },
};
