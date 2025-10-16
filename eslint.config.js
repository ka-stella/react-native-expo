const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,

  {
    files: ["**/*.js", "**/*.mjs", "eslint.config.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
      },
      parser: require("@babel/eslint-parser"),
      parserOptions: {
        requireConfigFile: false,
      },
    },
  },

  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      // ====== バグ防止（Error推奨）======
      // Promiseの放置を禁止し、非同期処理のバグを防ぐ
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true },
      ],
      // Promiseを返す関数が同期的に使われる誤用を防ぐ
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // ====== 品質向上（Warn推奨）======
      // 未使用の変数を警告。ただし、引数名が _ で始まる場合は無視
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      // 型安全性なしの `any` 型の使用を警告
      "@typescript-eslint/no-explicit-any": "warn",
      // 危険な Non-Null アサーション `!` の使用を警告
      "@typescript-eslint/no-non-null-assertion": "warn",
      // 命名規則を推奨。camelCaseを基本とし、PascalCase/UPPER_CASEも許可
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
      ],
      // 戻り値の型を明示することを推奨（ただし型推論が効くアロー関数などは許可）
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],

      // ====== スタイルの柔軟性（Off）======
      // 配列の型（T[] vs Array<T>）や、型の定義（interface vs type）を強制しない
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  },

  {
    ignores: ["dist/*", "node_modules/**","eslint.config.js"],
  },
]);
