import Vue from "vue";
import createLogger from 'vuex/dist/logger'
import debugFunc from "debug";

export const MUTATION_TYPES = {
  UPDATE_DEVICES: "@UPDATE_DEVICES",
	ADD_SOCKET: "@ADD_SOCKET"
}

const middleware = [];

const loggingMiddleware = store => {
	store.subscribe((mutation, state) => {
		const debug = debugFunc('app:store');
		debug('Store mutation', mutation.type);
	});
}

if (process.env.NODE_ENV === 'development') {
	if (process.env.VUE_ENV === 'server') {
		middleware.push(loggingMiddleware);
	} else {
		middleware.push(createLogger());
	}
}


export const plugins = middleware;

export const state = () => ({
  currentSet: null,
	socket: null,
	sets: [],
	devices: []
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
	[MUTATION_TYPES.OPEN_MODAL]: function(state, { modal }) {
		Vue.set(state, "visibleModal", modal);
	},
  [MUTATION_TYPES.ADD_SOCKET]: function(state, socket) {
    Vue.set(state, "socket", socket);
  },
  [MUTATION_TYPES.INIT_SET]: function(state) {
    const currentSet = sessionStorage.getItem("currentSet");

    if (currentSet) {
      Vue.set(state, "currentSet", currentSet);
    }
  },
  [MUTATION_TYPES.LOAD_SET]: function(state, set) {
    Vue.set(state, "currentSet", set);

    sessionStorage.setItem("currentSet", set);
  },
  [MUTATION_TYPES.UPDATE_SETS]: function(state, sets) {
    Vue.set(state, "sets", sets);
  },
  [MUTATION_TYPES.UPDATE_DEVICES]: function(state, devices) {
    Vue.set(state, "devices", devices);
  },
}
