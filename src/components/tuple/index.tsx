import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-tuple",
})
export class SmoothlyTuple {
	@Prop() tuple: [string, string]
	render() {
		return [<b>{this.tuple[0]}</b>, ": ", this.tuple[1], <br />]
	}
}
