import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-button-demo",
	styleUrl: "style.css",
})
export class SmoothlyButtonDemo {
	render() {
		return [
			<h2>Buttons</h2>,
			<section>
				<h4>Confirm button (two clicks)</h4>
				<div>
					<smoothly-button-confirm name="confirm" type="button" shape="rounded" color="danger" size="large">
						Delete
					</smoothly-button-confirm>
					<smoothly-button-confirm name="confirm-icon" type="button" shape="rounded" color="success" size="icon">
						<smoothly-icon name="checkmark-outline" size="small" />
					</smoothly-button-confirm>
				</div>
				<h4>Toggle button</h4>
				<smoothly-toggle>
					<smoothly-icon name="card" fill="solid" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<smoothly-toggle>
					<smoothly-icon name="briefcase" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<smoothly-toggle>
					<smoothly-icon name="airplane" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<h4>Toggle switches</h4>
				<smoothly-toggle-switch
					checkmark={false}
					color="primary"
					disabled={false}
					size="small"
					onSmoothlyToggleSwitchChange={e => {
						console.log("toggleSwitch ", e.detail)
					}}></smoothly-toggle-switch>
				<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
				<smoothly-toggle-switch disabled={false} size="large"></smoothly-toggle-switch>
				<h4>Links with icons</h4>
				<smoothly-button type="link">
					<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
					type link
				</smoothly-button>
				<smoothly-button type="button" color="warning" fill="default">
					<smoothly-icon name="call" slot="start"></smoothly-icon>
					<a href="https://google.com">link</a>
				</smoothly-button>
				<smoothly-button link="https://google.com" type="link">
					<smoothly-icon name="arrow-forward" slot="end"></smoothly-icon>
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
						<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
						Fill Solid
					</smoothly-button>
					<smoothly-button shape="rounded" color="secondary" fill="outline">
						<smoothly-icon name="checkmark-circle" slot="start" fill="clear"></smoothly-icon>
						Fill Outline
					</smoothly-button>
					<smoothly-button shape="rounded" color="tertiary" fill="clear">
						<smoothly-icon name="checkmark-circle" slot="start" fill="clear"></smoothly-icon>
						Fill Clear
					</smoothly-button>
					<smoothly-button size="icon" shape="rounded" color="success" fill="solid">
						<smoothly-icon name="basketball" fill="solid"></smoothly-icon>
					</smoothly-button>
				</div>
				<h4>Buttons with Icon in "start"</h4>
				<div>
					<smoothly-button shape="rounded" fill="solid" color="warning">
						<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button shape="rounded" fill="solid" color="secondary">
						<smoothly-icon name="basketball" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button shape="rounded" fill="solid" color="success">
						<smoothly-icon name="call" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
						<smoothly-icon name="call"></smoothly-icon>
					</smoothly-button>
					<smoothly-button size="flexible" fill="solid" color="success">
						<smoothly-icon name="airplane"></smoothly-icon>
					</smoothly-button>
				</div>
				<h4>Buttons with Icon in "end"</h4>
				<smoothly-button fill="solid" color="light">
					Go Forward
					<smoothly-icon name="arrow-forward" slot="end"></smoothly-icon>
				</smoothly-button>
				<h4>Test for icon button</h4>
				<div>
					<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
						<smoothly-icon name="call"></smoothly-icon>
					</smoothly-button>
					<smoothly-button size="icon" shape="rounded" color="warning" fill="solid">
						<smoothly-icon name="search-outline"></smoothly-icon>
					</smoothly-button>
					<smoothly-button size="icon" shape="rounded" color="secondary">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
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
			</section>,
			<smoothly-back-to-top />,
		]
	}
}
