module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        semi: true,
        tabs: true,
        tabWidth: 2,
      },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
  },
};
