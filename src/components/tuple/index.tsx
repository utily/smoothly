// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-tuple",
	styleUrl: "style.css",
	scoped: true,
})

export class SmoothlyTuple {
	@Prop() tuple: [string, string]
	render() {
		return [
			<b>{ this.tuple[0] }</b>, ": ",
			this.tuple[1], <br />,
		]
	}
}
