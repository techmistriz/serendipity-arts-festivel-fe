const config = {
  "*.{js,cjs,mjs,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md,yml,yaml}": "prettier --write",
};

export default config;
