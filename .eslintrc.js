module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // Allow _id (MongoDB convention)
    "no-underscore-dangle": ["error", { allow: ["_id"] }],

    // Ignore 'next' in Express middleware and variables starting with '_'
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
