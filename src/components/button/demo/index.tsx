import { Component, h, Host } from "@stencil/core"
@Component({
	tag: "smoothly-button-demo",
	styleUrl: "style.css",
})
export class SmoothlyButtonDemo {
	render() {
		return (
			<Host>
				<section>
					<smoothly-button-demo-standard />
				</section>
				<section>
					<h4>Confirm button (two clicks)</h4>
					<div>
						<smoothly-button-confirm name="confirm" shape="rounded" color="danger" size="large">
							Delete
						</smoothly-button-confirm>
						<smoothly-button-confirm name="confirm-icon" shape="rounded" color="success" size="icon">
							<smoothly-icon name="checkmark-outline" size="tiny" />
						</smoothly-button-confirm>
						<smoothly-button-confirm name="confirm-icon" shape="rounded" color="danger" size="icon" fill="outline">
							<smoothly-icon name="trash-outline" size="tiny" fill="outline" />
						</smoothly-button-confirm>
					</div>
					<smoothly-toggle-switch-demo />
					<h4>Links with icons</h4>
					<smoothly-button type="link">
						<smoothly-icon name="checkmark-circle" slot="start" />
						type link
					</smoothly-button>
					<smoothly-button type="button" color="warning" fill="default">
						<smoothly-icon name="call" slot="start" />
						<a href="https://google.com">link</a>
					</smoothly-button>
					<smoothly-button link="https://google.com" type="link">
						<smoothly-icon name="arrow-forward" slot="end" />
						link + type link
					</smoothly-button>
					<h4>Size and Color test</h4>
					<smoothly-button color="primary" fill="solid" size="small" shape="rounded">
						Color Primary + Small
					</smoothly-button>
					<smoothly-button color="secondary" fill="solid" shape="rounded">
						Color Secondary + Default
					</smoothly-button>
					<smoothly-button color="warning" fill="solid" size="large">
						Color Warning + Large
					</smoothly-button>
					<smoothly-button color="danger" fill="solid" size="small" shape="rounded">
						Color Danger + Small
					</smoothly-button>
					<smoothly-button color="success" fill="solid" size="small" shape="rounded">
						Color Success + Small
					</smoothly-button>
					<smoothly-button color="tertiary" fill="solid" size="small" shape="rounded">
						Color Tertiary + Small
					</smoothly-button>
					<smoothly-button color="dark" fill="solid" size="small" shape="rounded">
						Color Dark + Small
					</smoothly-button>
					<smoothly-button color="medium" fill="solid" size="small" shape="rounded">
						Color Medium + Small
					</smoothly-button>
					<smoothly-button color="light" fill="solid" size="small" shape="rounded">
						Color Light + Small
					</smoothly-button>
					<h4>Expand examples</h4>
					<smoothly-button color="secondary" fill="solid" expand="full">
						Color Secondary + Default
					</smoothly-button>
					<smoothly-button color="warning" fill="solid" expand="block">
						Color Warning + Large
					</smoothly-button>
					<h4>Fill examples</h4>
					<div>
						<smoothly-button shape="rounded" color="primary" fill="solid">
							<smoothly-icon name="checkmark-circle" slot="start" />
							Fill Solid
						</smoothly-button>
						<smoothly-button shape="rounded" color="secondary" fill="outline">
							<smoothly-icon name="checkmark-circle" slot="start" />
							Fill Outline
						</smoothly-button>
						<smoothly-button shape="rounded" color="tertiary" fill="clear">
							<smoothly-icon name="checkmark-circle" slot="start" />
							Fill Clear
						</smoothly-button>
						<smoothly-button size="icon" shape="rounded" color="success" fill="solid">
							<smoothly-icon name="basketball" />
						</smoothly-button>
					</div>
					<h4>Buttons with Icon in "start"</h4>
					<div>
						<smoothly-button shape="rounded" fill="solid" color="warning">
							<smoothly-icon name="checkmark-circle" slot="start" />
							Check
						</smoothly-button>
						<smoothly-button shape="rounded" fill="solid" color="secondary">
							<smoothly-icon name="basketball" slot="start" />
							Check
						</smoothly-button>
						<smoothly-button shape="rounded" fill="solid" color="success">
							<smoothly-icon name="call" slot="start" />
							Check
						</smoothly-button>
						<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
							<smoothly-icon name="call" />
						</smoothly-button>
						<smoothly-button size="flexible" fill="solid" color="success">
							<smoothly-icon name="airplane" />
						</smoothly-button>
					</div>
					<h4>Buttons with Icon in "end"</h4>
					<smoothly-button fill="solid" color="light">
						Go Forward
						<smoothly-icon name="arrow-forward" slot="end" />
					</smoothly-button>
					<h4>Test for icon button</h4>
					<div>
						<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
							<smoothly-icon name="call" />
						</smoothly-button>
						<smoothly-button size="icon" shape="rounded" color="warning" fill="solid">
							<smoothly-icon name="search-outline" />
						</smoothly-button>
						<smoothly-button size="icon" shape="rounded" color="secondary">
							<smoothly-icon name="checkmark-circle" />
						</smoothly-button>
					</div>
					<h4>Link examples</h4>
					<div>
						<smoothly-button type="link">type link</smoothly-button>
						<smoothly-button type="button" fill="clear">
							<a href="https://google.com">link</a>
						</smoothly-button>
						<smoothly-button link="https://google.com" type="link">
							link + type link
						</smoothly-button>
					</div>
					<h4>Disabled buttons</h4>
					<div>
						<smoothly-button disabled fill="solid" color="secondary">
							Disabled
						</smoothly-button>
						<smoothly-button type="link" link="https://google.com" disabled>
							Disabled link
						</smoothly-button>
					</div>
				</section>
				<smoothly-back-to-top />
			</Host>
		)
	}
}
