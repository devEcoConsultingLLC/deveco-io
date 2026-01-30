import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import baseConfig from "./base.js";

export default [
  ...baseConfig,
  ...vuePlugin.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/component-tags-order": [
        "error",
        { order: ["script", "template", "style"] },
      ],
      "vue/define-macros-order": [
        "error",
        { order: ["defineProps", "defineEmits"] },
      ],
    },
  },
];
