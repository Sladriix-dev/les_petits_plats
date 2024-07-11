import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        recipes: "readonly",
        displayRecipes: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
];
