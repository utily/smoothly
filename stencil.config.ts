// tslint:disable-next-line: no-implicit-dependencies
import { Config } from "@stencil/core"

export const config: Config = {
	namespace: "smoothly",
	outputTargets: [
		{
			type: "dist-custom-elements-bundle",
		},
		{
			type: "www",
			serviceWorker: null, // disable service workers
		},
	],
	devServer: {
		openBrowser: false,
	},
}
