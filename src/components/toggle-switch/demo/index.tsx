import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-toggle-switch-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyToggleSwitchDemo {
	render() {
		return (
			<Host>
				<h4>Toggle switches</h4>
				<div>
					<p>Checkmark</p>
					<span>
						<p>Tiny</p>
						<smoothly-toggle-switch disabled={false} size="tiny" />
					</span>
					<span>
						<p>Small</p>
						<smoothly-toggle-switch disabled={false} size="small" />
					</span>
					<span>
						<p>Standard</p>
						<smoothly-toggle-switch disabled={false} />
					</span>
					<span>
						<p>Large</p>
						<smoothly-toggle-switch disabled={false} size="large" />
					</span>
					<p>Colors checkmark</p>
					<span>
						<p>Danger</p>
						<smoothly-toggle-switch color="danger" disabled={false} size="small" />
					</span>
					<span>
						<p>Primary color</p>
						<smoothly-toggle-switch color="primary" disabled={false} size="small" />
					</span>
					<span>
						<p>Secondary color</p>
						<smoothly-toggle-switch color="secondary" disabled={false} size="small" />
					</span>
					<p></p>
					<p>Colors no checkmark</p>
					<span>
						<p>Danger</p>
						<smoothly-toggle-switch checkmark={false} color="danger" disabled={false} size="small" />
					</span>
					<span>
						<p>Primary color</p>
						<smoothly-toggle-switch checkmark={false} color="primary" disabled={false} size="small" />
					</span>
					<span>
						<p>Secondary color</p>
						<smoothly-toggle-switch checkmark={false} color="secondary" disabled={false} size="small" />
					</span>
				</div>
			</Host>
		)
	}
}
