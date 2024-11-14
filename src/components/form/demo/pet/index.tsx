import { Component, Fragment, h, Host, State, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() hasOwner = false
	@State() owner: { firstName?: string; lastName?: string } = {}
	@State() value: any

	@Watch("value")
	valueChange() {
		console.log("valueChange", this.value)
	}

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
					<smoothly-input-checkbox
						name="hasOwner"
						onSmoothlyInputLoad={e => e.stopPropagation()}
						onSmoothlyInput={e => {
							this.hasOwner = e.detail.hasOwner as boolean
							e.stopPropagation()
						}}>
						Has Owner
					</smoothly-input-checkbox>
					{this.hasOwner && (
						<Fragment>
							<smoothly-input
								type="text"
								name="owner.firstName"
								value={this.owner.firstName}
								onSmoothlyInput={e => (this.owner = { ...this.owner, firstName: e.detail["owner.firstName"] })}>
								Owner First Name
							</smoothly-input>
							<smoothly-input
								type="text"
								name="owner.lastName"
								value={this.owner.lastName}
								onSmoothlyInput={e => (this.owner = { ...this.owner, lastName: e.detail["owner.lastName"] })}>
								Owner Last Name
							</smoothly-input>
						</Fragment>
					)}
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
				<smoothly-display type="json" value={this.value} />
			</Host>
		)
	}
}
