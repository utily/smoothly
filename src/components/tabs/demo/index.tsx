import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-tabs-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabsDemo {
	render() {
		return [
			<h2>Default tabs</h2>,
			<div>
				<smoothly-tabs>
					<smoothly-tab label="test1" open>
						Hello world!
					</smoothly-tab>
					<smoothly-tab label="test2">this is a test message!</smoothly-tab>
					<smoothly-tab label="test3">this is a test message again!</smoothly-tab>
				</smoothly-tabs>
			</div>,
			<h2>Filled tabs</h2>,
			<div>
				<smoothly-tabs filled>
					<smoothly-tab label="test4" open>
						Hello world!
					</smoothly-tab>
					<smoothly-tab label="test5">this is a test message!</smoothly-tab>
					<smoothly-tab label="test6">this is a test message again!</smoothly-tab>
				</smoothly-tabs>
			</div>,
		]
	}
}
