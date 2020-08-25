// tslint:disable-next-line: no-implicit-dependencies
import { Config } from "@stencil/core"

export const config: Config = {
	namespace: "smoothly",
	taskQueue: "async",
	outputTargets: [
		{
			type: "dist",
			esmLoaderPath: "../loader",
		},
		{
			type: "dist-custom-elements-bundle",
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
}
