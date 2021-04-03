import { createLogger } from "vuex";

export const MUTATION_TYPES = {
  UPDATE_DEVICES: "@UPDATE_DEVICES",
  ADD_SOCKET: "@ADD_SOCKET",
};

const middleware = [];

if (process.env.NODE_ENV === "development") {
  middleware.push(createLogger());
}

export const plugins = middleware;

export { state } from "./root/constants";

export * as actions from "./root/actions";

export * as mutations from "./root/mutations";
