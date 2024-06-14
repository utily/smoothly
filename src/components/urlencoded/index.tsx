import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-urlencoded",
})
export class Urlencoded {
	@Prop() data: string // TODO: Consider using a specific type for this
	render() {
		return this.data
			.split("&")
			.map(p => p.split("=") as [string, string])
			.map(tuple => <smoothly-0-tuple tuple={tuple}></smoothly-0-tuple>)
	}
}
