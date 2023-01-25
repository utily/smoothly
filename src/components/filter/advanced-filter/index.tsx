import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-filter-advanced",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterAdvanced {
	render() {
		return <slot />
	}
}
