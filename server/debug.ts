import debugFunc from "debug";

export default (group: string, error: boolean = false) => (
  arg: any,
  ...args: any
) => debugFunc(`app:${group}${error ? ":error" : ""}`)(arg, ...args);
