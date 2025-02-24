import { Component, h, Host, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemo {
	render(): VNode | VNode[] {
		return (
			<Host>
				<div>
					<smoothly-form-demo-all />
					<smoothly-form-demo-pet />
					<smoothly-form-demo-card />
					<smoothly-form-demo-login />
					<smoothly-form-demo-prices />
					<smoothly-form-demo-typed />
					<smoothly-form-demo-transparent />
					<smoothly-form-demo-date />
					<smoothly-form-demo-schedule />
					<smoothly-form-demo-date-range />
					<smoothly-form-demo-controlled />
				</div>
			</Host>
		)
	}
}
