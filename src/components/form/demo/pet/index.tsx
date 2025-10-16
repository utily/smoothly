import { Component, Fragment, h, Host, State, VNode } from "@stencil/core"
import { isoly } from "isoly"
import { RGB } from "../../../../model/Color/RGB"

@Component({
	tag: "smoothly-form-demo-pet",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoPet {
	@State() hasOwner = false
	@State() owner: {
		firstName?: string
		lastName?: string
		birthday?: string
		ownedRange?: isoly.DateRange
		height?: number
		favoriteHat?: string
		favoriteColor?: RGB
		favoritePizza?: string
		hasPet?: boolean
	} = {}
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
					<smoothly-input type="text" name="name.first" value="magnus">
						Name
						<smoothly-input-reset slot="end" size="icon" />
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
						<smoothly-input-reset slot="end" />
					</smoothly-input-checkbox>
					{this.hasOwner && (
						<Fragment>
							<smoothly-input
								type="text"
								name="owner.firstName"
								value={this.owner.firstName}
								onSmoothlyInput={e => (this.owner = { ...this.owner, firstName: e.detail["owner.firstName"] })}>
								Owner First Name
								<smoothly-input-reset slot="end" />
							</smoothly-input>
							<smoothly-input
								type="text"
								name="owner.lastName"
								value={this.owner.lastName}
								onSmoothlyInput={e => (this.owner = { ...this.owner, lastName: e.detail["owner.lastName"] })}>
								Owner Last Name
							</smoothly-input>
							<smoothly-input-file name="owner.picture">
								<span slot="label">Owner picture</span>
							</smoothly-input-file>
							<smoothly-input-date
								name="owner.birthday"
								value={this.owner.birthday}
								onSmoothlyInput={e => (this.owner = { ...this.owner, birthday: e.detail["owner.birthday"] })}>
								Owner birthday
								<smoothly-input-reset slot="end" />
							</smoothly-input-date>
							<smoothly-input-date-range
								name="owner.ownedRange"
								start={this.owner.ownedRange?.start}
								end={this.owner.ownedRange?.end}
								onSmoothlyInput={e => (this.owner = { ...this.owner, ownedRange: e.detail["owner.ownedRange"] })}>
								Owner ownedRange
								<smoothly-input-reset slot="end" />
							</smoothly-input-date-range>
							<smoothly-input-range
								name="owner.height"
								step={1}
								max={250}
								value={this.owner.height}
								onSmoothlyInput={e => (this.owner = { ...this.owner, height: e.detail["owner.height"] })}>
								Owner's Height
								<smoothly-input-reset slot="end" size="icon" />
							</smoothly-input-range>
							<smoothly-input-select name="owner.favoriteHat">
								<span slot="label">Owner's Favorite Hat</span>
								{["🎩 top hat", "🧢 cap", "👒 sun hat", "❌ none"].map((value, index) => (
									<smoothly-item value={value} key={index} selected={this.owner.favoriteHat == value}>
										{value}
									</smoothly-item>
								))}
								<smoothly-input-reset slot="end" size="icon" />
							</smoothly-input-select>
							<smoothly-input-color
								name="owner.favoriteColor"
								value={this.owner.favoriteColor ? RGB.toHex(this.owner.favoriteColor) : undefined}
								onSmoothlyInput={e => (this.owner = { ...this.owner, favoriteColor: e.detail["owner.favoriteColor"] })}>
								Owner's Favorite Color
								<smoothly-input-reset slot="end" size="icon" />
							</smoothly-input-color>
							<smoothly-input-radio
								name="owner.favoritePizza"
								value={this.owner.favoritePizza}
								onSmoothlyInput={e =>
									(this.owner = { ...this.owner, favoritePizza: e.detail["owner.favoritePizza"] as string })
								}>
								<span slot="label">Owner's Favorite Pizza</span>
								{["vesuvio", "capricciosa", "quattro formaggi"].map((value, index) => (
									<smoothly-input-radio-item value={value} key={index}>
										{value}
										<smoothly-input-reset slot="end" size="icon" />
									</smoothly-input-radio-item>
								))}
								<smoothly-input-reset slot="end" size="icon" />
							</smoothly-input-radio>
							<smoothly-input-checkbox
								name="owner.hasPet"
								checked={this.owner.hasPet}
								onSmoothlyInput={e => (this.owner = { ...this.owner, hasPet: e.detail["owner.hasPet"] as boolean })}>
								Has Pet
							</smoothly-input-checkbox>
						</Fragment>
					)}
					<smoothly-summary>
						<span slot="summary">Summary</span>
						<div slot="content">
							<smoothly-input type="price" name="summary.price" currency="EUR">
								Summary Price
							</smoothly-input>
							<smoothly-input-file name="summary.picture">
								<span slot="label">Summary picture</span>
								<smoothly-input-clear slot="end" size="icon" />
							</smoothly-input-file>
							<smoothly-input-date name="summary.birthday">Summary birthday</smoothly-input-date>
							<smoothly-input-date-range name="summary.ownedRange">Summary ownedRange</smoothly-input-date-range>
							<smoothly-input-range name="summary.height" label={"Height"} />
							<smoothly-input-select name="summary.favoriteHat">
								<span slot="label">Summary's Favorite Hat</span>
								{["🎩 top hat", "🧢 cap", "👒 sun hat", "❌ none"].map((value, index) => (
									<smoothly-item value={value} key={index}>
										{value}
									</smoothly-item>
								))}
							</smoothly-input-select>
							<smoothly-input-month name="summary.month">
								<span slot={"month-label"}>Summary month</span>
							</smoothly-input-month>
							<smoothly-input-color name="summary.color">Summary Color</smoothly-input-color>
							<smoothly-input-radio name="summary.favoritePizza">
								<span slot="label">Summary's Favorite Pizza</span>
								{["vesuvio", "capricciosa", "quattro formaggi"].map((value, index) => (
									<smoothly-input-radio-item value={value} key={index}>
										{value}
									</smoothly-input-radio-item>
								))}
							</smoothly-input-radio>
							<smoothly-input-checkbox name="summary.hasPet">Has Pet</smoothly-input-checkbox>
						</div>
					</smoothly-summary>
					<smoothly-tabs>
						<smoothly-tab label="Dog" name="dog">
							<smoothly-input type={"text"} name="dog.breed">
								Breed
							</smoothly-input>
							<smoothly-input-file name="dog.picture">
								<span slot="label">Dog picture</span>
							</smoothly-input-file>
							<smoothly-input-date-time name="dog.lastWalk">Time of last walk</smoothly-input-date-time>
							<smoothly-input-date name="dog.birthday">Dog birthday</smoothly-input-date>
							<smoothly-input-date-range name="dog.dateRange">Dog date range</smoothly-input-date-range>
							<smoothly-input-select name="dog.favoriteHat">
								<span slot="label">Dog's Favorite Hat</span>
								{["🎩 top hat", "🧢 cap", "👒 sun hat", "❌ none"].map((value, index) => (
									<smoothly-item value={value} key={index}>
										{value}
									</smoothly-item>
								))}
							</smoothly-input-select>
							<smoothly-input-color name="dog.favoriteColor">Dog's Favorite Color</smoothly-input-color>
							<smoothly-input-radio name="dog.favoritePizza">
								<span slot="label">Dog's Favorite Pizza</span>
								{["vesuvio", "capricciosa", "quattro formaggi"].map((value, index) => (
									<smoothly-input-radio-item value={value} key={index}>
										{value}
									</smoothly-input-radio-item>
								))}
							</smoothly-input-radio>
							<smoothly-input-checkbox name="dog.hasPet">Has Pet</smoothly-input-checkbox>
						</smoothly-tab>
						<smoothly-tab label="Cat" name="cat" open>
							<smoothly-input name={"cat.favoriteFood"}>Favorite Food</smoothly-input>
						</smoothly-tab>
					</smoothly-tabs>
					<smoothly-input-submit size="icon" slot="submit" color="success" fill="solid" />
				</smoothly-form>
				<smoothly-display type="json" value={this.value} />
			</Host>
		)
	}
}
