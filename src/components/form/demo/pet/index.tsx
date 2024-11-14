import { Component, h, Host, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() value: any

	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Pet</h2>
				<h3>Value</h3>
				<smoothly-form
					looks="border"
					onSmoothlyFormSubmit={(e: CustomEvent) => alert(JSON.stringify(e.detail))}
					onSmoothlyFormInput={e => (this.value = { ...e.detail })}>
					<smoothly-input type="text" name="name.first">
						Name
					</smoothly-input>
					<smoothly-input type="integer" name="age">
						Age (Years)
					</smoothly-input>
					<smoothly-input type={"text"} name="owner.firstName">
						Owners First Name
					</smoothly-input>
					<smoothly-input name={"owner.lastName"}>Owners Last Name</smoothly-input>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
				<smoothly-display type="json" value={this.value} />
			</Host>
		)
	}
}
