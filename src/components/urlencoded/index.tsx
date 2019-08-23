// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-urlencoded",
})

export class Urlencoded {
	@Prop() data: string // TODO: Consider using a specific type for this
	render() {
		let dataString = this.data
		const decodedData: [string, string][] = []
		while (dataString.length > 0) {
			decodedData.push([dataString.substring(0, dataString.indexOf("=")), dataString.substring(dataString.indexOf("=") + 1, dataString.indexOf("&") >= 0 ? dataString.indexOf("&") : dataString.length)])
			dataString = dataString.indexOf("&") >= 0 ? dataString.substring(dataString.indexOf("&") + 1) : ""
		}
		return [
			decodedData.map(tuple => <smoothly-tuple tuple={ tuple }></smoothly-tuple>),
		]
	}
}
