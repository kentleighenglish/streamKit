import { Cell } from "@/types/sets";

export const label = "Fade";

export const start = async (cell: Cell, options: any) => {};

export const end = async (cell: Cell, options: any) => {};

export const controls = {
  duration: {
    label: "Duration",
    type: "range",
    max: 20,
    min: 0,
    step: 0.1,
    default: 3,
    rangeUnit: "seconds",
  },
};
