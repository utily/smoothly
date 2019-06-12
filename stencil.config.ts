import { Config } from "@stencil/core"

export const config: Config = {
	namespace: "smoothly",
	outputTargets: [
		{
			type: "dist",
			esmLoaderPath: "../loader",
		},
		{
			type: "docs-readme",
		},
		{
			type: "www",
			serviceWorker: null, // disable service workers
		},
	],
	devServer: {
		openBrowser: false,
	},
	globalStyle: "src/style.css",
	globalScript: "src/index.ts",
}
