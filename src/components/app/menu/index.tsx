import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-app-menu",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppMenu {
	render() {
		return (
			<ul class="appmenu">
				<li></li>
				<li></li>
				<li></li>
			</ul>
		)
	}
}
