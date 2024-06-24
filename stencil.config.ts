// tslint:disable-next-line: no-implicit-dependencies
import { Config } from "@stencil/core"
import { sass } from "@stencil/sass"

export const config: Config = {
	namespace: "smoothly",
	taskQueue: "async",
	sourceMap: true,
	globalScript: "src/global/index.ts",
	outputTargets: [
		{
			type: "dist",
			esmLoaderPath: "../loader",
		},
		{
			type: "dist-custom-elements",
			customElementsExportBehavior: "auto-define-custom-elements",
			externalRuntime: false,
			generateTypeDeclarations: true,
		},
		{
			type: "www",
			serviceWorker: null, // disable service workers
			buildDir: "",
		},
	],
	devServer: {
		openBrowser: false,
	},
	plugins: [sass()],
}
