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
						</smoothly-tab>
						<smoothly-tab label="Cat">
							<smoothly-input name={"cat.favoriteFood"}>Favorite Food</smoothly-input>
						</smoothly-tab>
						<smoothly-tab label="Bird">
							<smoothly-input name={"bird.species"}>Species</smoothly-input>
						</smoothly-tab>
					</smoothly-tabs>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
			</Host>
		)
	}
}
