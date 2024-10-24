import { Component, Fragment, h, Host, State, VNode } from "@stencil/core"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() hasOwner = false

	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Pet</h2>
				<smoothly-form
					looks="border"
					onSmoothlyFormSubmit={(e: CustomEvent) => alert(JSON.stringify(e.detail))}
					onSmoothlyFormInput={e => console.log("Pet.SmoothlyFormInput", e.detail)}>
					<smoothly-input type="text" name="name">
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
							<smoothly-input type="text" name="owner.firstName">
								Owner First Name
							</smoothly-input>
							<smoothly-input type="text" name="owner.lastName">
								Owner Last Name
							</smoothly-input>
						</Fragment>
					)}
					<smoothly-tabs>
						<smoothly-tab label="Dog" open>
							<smoothly-input type={"text"} name="dog.breed">
								Breed
							</smoothly-input>
							{/* <smoothly-input-select name="dog.size">
								<span slot="label">Size</span>
								{["small", "medium", "large"].map(size => (
									<smoothly-item value={size}>{size}</smoothly-item>
								))}
							</smoothly-input-select>
							<smoothly-input-checkbox name="cat.neutered">Neutered</smoothly-input-checkbox> */}
						</smoothly-tab>
						<smoothly-tab label="Cat">
							<smoothly-input-select name="cat.environment">
								<span slot="label">Environment</span>
								{["indoor", "outdoor", "both"].map(environment => (
									<smoothly-item value={environment}>{environment}</smoothly-item>
								))}
							</smoothly-input-select>
							{/* <smoothly-input-checkbox name="cat.declawed">Declawed</smoothly-input-checkbox> */}
						</smoothly-tab>
						<smoothly-tab label="Bird">
							<smoothly-input-radio name="bird.talks">
								<span slot="label">Can talks</span>
								<smoothly-input-radio-item value="yes">Yes</smoothly-input-radio-item>
								<smoothly-input-radio-item value="no">No</smoothly-input-radio-item>
							</smoothly-input-radio>
							{/* <smoothly-input-range name="bird.wingspan" min={1} max={200} step={1}>
								Wingspan (cm)
							</smoothly-input-range> */}
						</smoothly-tab>
					</smoothly-tabs>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
			</Host>
		)
	}
}
