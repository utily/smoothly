import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-room",
})
export class Smoothly0Room {
	@Prop() label?: string
	@Prop() icon?: string
	@Prop() path: string | RegExp
	@Prop() to?: string
	render() {
		return <slot></slot>
	}
}
