// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-urlencoded",
})

export class Urlencoded {
	@Prop() data: string // TODO: Consider using a specific type for this
	render() {
		const pairs = this.data.split("&")
		const decoded: [string, string][] = []
		for (const p of pairs) {
			const pair = p.split("=")
			decoded.push([pair[0], pair[1]])
		}

		// let dataString = this.data
		// const decodedData: [string, string][] = []
		// while (dataString.length > 0) {
		// 	decodedData.push([dataString.substring(0, dataString.indexOf("=")), dataString.substring(dataString.indexOf("=") + 1, dataString.indexOf("&") >= 0 ? dataString.indexOf("&") : dataString.length)])
		// 	dataString = dataString.indexOf("&") >= 0 ? dataString.substring(dataString.indexOf("&") + 1) : ""
		// }
		return [
			decoded.map(tuple => <smoothly-tuple tuple={ tuple }></smoothly-tuple>),
		]
	}
}
