import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-room",
})
export class SmoothlyRoom {
	@Prop() label?: string
	@Prop() icon?: string
	@Prop() path: string | RegExp
	@Prop() to?: string
	render() {
		return <slot></slot>
	}
}
