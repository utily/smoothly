import { Component, State, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-spinner",
	styleUrl: "smoothly-spinner.css",
	scoped: true,
})
export class SmoothlySpinner {
	@Prop() active: boolean
	hostData() {
		return { class: { active: this.active } }
	}
	render() {
		return <div>Loading...</div>
	}
}
