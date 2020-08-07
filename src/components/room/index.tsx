// tslint:disable-next-line: no-implicit-dependencies
import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-room",
})
export class SmoothlyAppDemo {
	@Prop() title: string
	@Prop() path: string
	render() {
		return <slot></slot>
	}
}


