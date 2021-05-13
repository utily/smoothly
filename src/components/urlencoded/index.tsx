import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-urlencoded",
})
export class Urlencoded {
	@Prop() data: string // TODO: Consider using a specific type for this
	render() {
		return this.data
			.split("&")
			.map(p => p.split("=") as [string, string])
			.map(tuple => <smoothly-tuple tuple={tuple}></smoothly-tuple>)
	}
}
