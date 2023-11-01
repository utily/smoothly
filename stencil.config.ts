// tslint:disable-next-line: no-implicit-dependencies
import { Config } from "@stencil/core"
import { sass } from "@stencil/sass"

export const config: Config = {
	namespace: "smoothly0",
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
	plugins: [sass()],
}
