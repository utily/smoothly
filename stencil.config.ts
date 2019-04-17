import { Config } from "@stencil/core"

export const config: Config = {
	namespace: "smoothly",
	globalStyle: "src/style.css",
	globalScript: "src/index.ts",
	outputTargets: [
		{ type: "dist" },
		{
			type: "www",
			serviceWorker: null, // disable service workers
		},
	],
}
