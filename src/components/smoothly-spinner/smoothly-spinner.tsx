import { Component, State, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-spinner",
	styleUrl: "smoothly-spinner.css",
	shadow: true,
})
export class SmoothlySpinner {
	@Prop() active: boolean
	render() {
		return <div class={this.active ? "active" : ""}><div>Loading...</div></div>
	}
}
