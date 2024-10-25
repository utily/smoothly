import { Component, Fragment, h, Host, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() hasOwner = false
	@State() owner: { firstName?: string; lastName?: string } = {}
	@State() value: any

	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Pet</h2>
				<smoothly-form
					looks="border"
					onSmoothlyFormSubmit={(e: CustomEvent) => alert(JSON.stringify(e.detail))}
					onSmoothlyFormInput={e => (this.value = { ...e.detail })}>
					{/* <smoothly-input type="text" name="name">
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
					</smoothly-input-checkbox>*/}
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
					<smoothly-tabs>
						<smoothly-tab label="Dog">
							<smoothly-input type={"text"} name="dog.breed">
								Breed
							</smoothly-input>
							<smoothly-input-select name="dog.size">
								<span slot="label">Size</span>
								{["small", "medium", "large"].map(size => (
									<smoothly-item value={size}>{size}</smoothly-item>
								))}
							</smoothly-input-select>
							{/* <smoothly-input-checkbox name="dog.neutered">Neutered</smoothly-input-checkbox> */}
							{/* <smoothly-input-date name="dog.birthDate">Born</smoothly-input-date> */}
							{/* <smoothly-input-date-range name="dog.trainingPeriod">Training Period</smoothly-input-date-range> */}
						</smoothly-tab>
						<smoothly-tab label="Cat" open>
							<smoothly-input name={"cat.favoriteFood"}>Favorite Food</smoothly-input>
							<smoothly-input-select name="cat.environment">
								<span slot="label">Environment</span>
								{["indoor", "outdoor", "both"].map(environment => (
									<smoothly-item value={environment}>{environment}</smoothly-item>
								))}
							</smoothly-input-select>
							{/* <smoothly-input-checkbox name="cat.declawed">Declawed</smoothly-input-checkbox> */}
							{/* <smoothly-input-file name="cat.medicalDocument">Medical Document</smoothly-input-file> */}
						</smoothly-tab>
						{/* <smoothly-tab label="Bird"> */}
						{/* <smoothly-input name={"bird.species"}>Species</smoothly-input> */}
						{/* <smoothly-input-radio name="bird.talks">
								<span slot="label">Can talks</span>
								<smoothly-input-radio-item value="yes">Yes</smoothly-input-radio-item>
								<smoothly-input-radio-item value="no">No</smoothly-input-radio-item>
							</smoothly-input-radio> */}
						{/* <smoothly-input-range name="bird.wingspan" min={1} max={200} step={1}>
								Wingspan (cm)
							</smoothly-input-range> */}
						{/* <smoothly-input-color name="bird.color">Color</smoothly-input-color> */}
						{/* </smoothly-tab> */}
					</smoothly-tabs>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
				<smoothly-display type="json" value={this.value} />
			</Host>
		)
	}
}
