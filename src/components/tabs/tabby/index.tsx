import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-tabby",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabs {
	render() {
		return (
			<Host>
				<div>One</div>
				<div>Two</div>
				<div>Three</div>
				<div>Four</div>
				<div class="selected">Five</div>
				<div>Six</div>
				<div>Seven</div>
				<div>Eight</div>
				<div>Nine</div>
				<div>Ten</div>
				<div>Eleven</div>
			</Host>
		)
	}
}
