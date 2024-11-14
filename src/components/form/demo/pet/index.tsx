import { Component, Fragment, h, Host, State, VNode, Watch } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() hasOwner = false
	@State() owner: { firstName?: string; lastName?: string; birthday?: string; ownedRange?: isoly.DateRange } = {}
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
							<smoothly-input-date
								name="owner.birthday"
								value={this.owner.birthday}
								onSmoothlyInput={e => (this.owner = { ...this.owner, birthday: e.detail["owner.birthday"] })}>
								Owner birthday
							</smoothly-input-date>
							<smoothly-input-date-range
								name="owner.ownedRange"
								start={this.owner.ownedRange?.start}
								end={this.owner.ownedRange?.end}
								onSmoothlyInput={e => (this.owner = { ...this.owner, ownedRange: e.detail["owner.ownedRange"] })}>
								Owner ownedRange
							</smoothly-input-date-range>
						</Fragment>
					)}
					<smoothly-tabs>
						<smoothly-tab label="Dog">
							<smoothly-input type={"text"} name="dog.breed">
								Breed
							</smoothly-input>
						</smoothly-tab>
						<smoothly-tab label="Cat" open>
							<smoothly-input name={"cat.favoriteFood"}>Favorite Food</smoothly-input>
						</smoothly-tab>
					</smoothly-tabs>
					<smoothly-summary>
						<span slot="summary">Has nickname</span>
						<smoothly-input slot="content" type="text" name="name.nick">
							Nickname
						</smoothly-input>
					</smoothly-summary>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
				<smoothly-display type="json" value={this.value} />
			</Host>
		)
	}
}
