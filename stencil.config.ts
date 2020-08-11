// tslint:disable-next-line: no-implicit-dependencies
import { Config } from "@stencil/core"

export const config: Config = {
	namespace: "smoothly",
	outputTargets: [
		{
			type: "dist",
			esmLoaderPath: "../loader",
		},
		{
			type: "www",
			serviceWorker: null, // disable service workers
			baseUrl: "smoothly"
		},
	],
	devServer: {
		openBrowser: false,
	},
}
