import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		globals: true,
		css: true,
		exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"], // Exclude e2e tests
	},
});
