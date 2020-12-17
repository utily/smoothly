import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-spinner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySpinner {
	@Prop({ reflect: true }) active: boolean
	render() {
		return <div>Loading...</div>
	}
}
