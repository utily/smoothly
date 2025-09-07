import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-tabs-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabsDemo {
	@State() extraTab1: boolean
	@State() extraTab2: boolean

	render() {
		return (
			<Host>
				<smoothly-tabby></smoothly-tabby>
			</Host>
		)
	}
}
