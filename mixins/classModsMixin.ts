import Vue, { VueConstructor } from "vue";

export interface ClassMod {
  baseClass: string;
  modifiers: { [key: string]: (vm: any) => boolean | string };
}

export interface ClassModsMixin {
  classMod: ClassMod;
}

declare module "vue/types/options" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    classMod?: ClassMod;
  }
}

export default (Vue as VueConstructor<Vue & ClassModsMixin>).extend({
  computed: {
    componentClass() {
      if (this.$options.classMod) {
        const { baseClass = "", modifiers = {} } = this.$options.classMod;

        return Object.keys(modifiers)
          .reduce(
            (arr, key) => {
              const modifier = modifiers[key];

              const result = modifier(this);

              if (typeof result === "string") {
                return [...arr, `${baseClass}--${result}`];
              }

              if (result) {
                return [...arr, `${baseClass}--${key}`];
              } else {
                return arr;
              }
            },
            [baseClass]
          )
          .join(" ");
      }

      return "";
    },
  },
});
