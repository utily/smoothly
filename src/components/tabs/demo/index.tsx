import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-tabs-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTabsDemo {
	@State() extraTab: boolean

	render() {
		return (
			<Host>
				<smoothly-tabs tabs="multiple">
					<smoothly-tab label="Single Tab" open>
						<strong>Single Tab content here.</strong> If only one tab is available setting <code>tabs</code> to{" "}
						<code>"multiple"</code> will hide the tab navigation and display the single tab's content directly.
						{!this.extraTab && (
							<div>
								<smoothly-button color="primary" onClick={() => (this.extraTab = true)}>
									Click to add extra tab
								</smoothly-button>
							</div>
						)}
					</smoothly-tab>
					{this.extraTab && (
						<smoothly-tab label="Extra tab">
							When there are more then one tab, the tab navigation will show.
						</smoothly-tab>
					)}
				</smoothly-tabs>

				<smoothly-tabs>
					<smoothly-tab label="test1" open>
						Hello world!
					</smoothly-tab>
					<smoothly-tab label="test2">this is a test message!</smoothly-tab>
					<smoothly-tab label="test3">this is a test message again!</smoothly-tab>
				</smoothly-tabs>
			</Host>
		)
	}
}
