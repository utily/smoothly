import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-table-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTableDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<smoothly-table-demo-nested-no-cell />
				{/* <div class="fake-table">
					<div class="fake-header">
						<h1>Main Application Navigation (Sticks to Page Top)</h1>
					</div>
					<div class="fake-body">
						<div class="fake-header">
							<h1>Main Application Navigation (Sticks to Page Top)</h1>
						</div>
						<div class="fake-body">
							<div class="fake-header">
								<h1>Main Application Navigation (Sticks to Page Top)</h1>
							</div>
							<div class="fake-body">
								<div>More main page content to ensure the page itself scrolls deeply.</div>
							</div>
							<div>More main page content to ensure the page itself scrolls deeply.</div>
						</div>
						<div>More main page content to ensure the page itself scrolls deeply.</div>
					</div>
				</div>
				<smoothly-table-demo-filler-row />
				<smoothly-table-demo-group />
				<smoothly-table-demo-colspan />
				<smoothly-table-demo-simple />
				<smoothly-table-demo-filtered /> */}
			</Host>
		)
	}
}
