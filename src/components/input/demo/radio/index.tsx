import { Component, h, Host, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-input-demo-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoRadio {
	@State() selected: string

	@Watch("selected")
	selectedChange() {
		console.log("selected", this.selected)
	}

	render() {
		return (
			<Host>
				<smoothly-input-radio
					name="radio"
					direction="column"
					onSmoothlyInput={e => (this.selected = e.detail.radio as string)}>
					<smoothly-input-radio-item value="1" selected>
						<span>Option 1</span>
						{this.selected == "1" && (
							<span slot="detail">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
								ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
								fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
								deserunt mollit anim id est laborum.
							</span>
						)}
					</smoothly-input-radio-item>
					<smoothly-input-radio-item value="2">
						<span>Option 2</span>
						<div slot="detail">
							{this.selected == "2" && (
								<smoothly-tabs>
									<smoothly-tab label="Dog" name="dog" open>
										🐕
									</smoothly-tab>
									<smoothly-tab label="Cat" name="cat">
										🐈
									</smoothly-tab>
									<smoothly-tab label="Rat" name="rat">
										🐀
									</smoothly-tab>
								</smoothly-tabs>
							)}
						</div>
					</smoothly-input-radio-item>
				</smoothly-input-radio>
			</Host>
		)
	}
}
