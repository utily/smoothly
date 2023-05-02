import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-select-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySelectDemo {
	render() {
		return [
			<smoothly-tab-switch>
				<smoothly-tab label="test1" open>
					Hello world!
				</smoothly-tab>
				<smoothly-tab label="test2">this is a test message!</smoothly-tab>
				<smoothly-tab label="test3">this is a test message again!</smoothly-tab>
			</smoothly-tab-switch>,
		]
	}
}
