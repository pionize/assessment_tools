import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
	globalIgnores([
		"dist",
		"node_modules",
		"coverage",
		"build",
		".vscode",
		".claude",
		"docs"
	]),
	// Source files with type checking
	{
		files: ["src/**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: "./tsconfig.app.json",
			},
		},
		rules: {
			// Disable formatting rules - handled by BiomeJS
			"@typescript-eslint/indent": "off",
			"@typescript-eslint/quotes": "off",
			"@typescript-eslint/semi": "off",
			"@typescript-eslint/comma-dangle": "off",
			"@typescript-eslint/object-curly-spacing": "off",
			"@typescript-eslint/space-before-function-paren": "off",
			
			// Disable rules that overlap with BiomeJS
			"@typescript-eslint/no-unused-vars": "off", // BiomeJS handles this
			"no-unused-vars": "off", // BiomeJS handles this
			
			// Disable overly strict rules for this project
			"@typescript-eslint/prefer-nullish-coalescing": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "off",
			"@typescript-eslint/no-redundant-type-constituents": "off",
			
			// Focus on React-specific rules
			"react-hooks/exhaustive-deps": "error",
			"react-refresh/only-export-components": "warn",
			"react-hooks/rules-of-hooks": "error",
			
			// Keep essential TypeScript rules
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/prefer-as-const": "error",
		},
	},
	// Config files without type checking
	{
		files: ["*.{js,ts}", "e2e/**/*.ts", "**/*.config.{js,ts}"],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
		},
	},
]);
