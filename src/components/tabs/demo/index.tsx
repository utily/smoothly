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
				<div>
					<smoothly-button color="primary" onClick={() => (this.extraTab1 = !this.extraTab1)}>
						{this.extraTab1 ? "Remove" : "Add"} tab
					</smoothly-button>
				</div>
				<smoothly-tabs tabs="multiple">
					<smoothly-tab label="Single Tab" open>
						<strong>Single Tab content here.</strong> If only one tab is available setting <code>tabs</code> to{" "}
						<code>"multiple"</code> will hide the tab navigation and display the single tab's content directly.
					</smoothly-tab>
					{this.extraTab1 && (
						<smoothly-tab label="Extra tab">
							When there are more then one tab, the tab navigation will show.
						</smoothly-tab>
					)}
				</smoothly-tabs>

				<div>
					<smoothly-button color="primary" onClick={() => (this.extraTab2 = !this.extraTab2)}>
						{this.extraTab2 ? "Remove" : "Add"} tab
					</smoothly-button>
				</div>
				<smoothly-tabs>
					<smoothly-tab label="Disabled tab" tooltip="Tooltip for test3" disabled>
						this is a test message again!
					</smoothly-tab>
					<smoothly-tab label="test1" tooltip="Tooltip for test1" open>
						Hello world!
					</smoothly-tab>
					<smoothly-tab label="test2">this is a test message!</smoothly-tab>
					{this.extraTab2 && <smoothly-tab label="test-extra">this is a test message!</smoothly-tab>}
				</smoothly-tabs>
			</Host>
		)
	}
}
