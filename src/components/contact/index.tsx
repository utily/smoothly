import { Component, Event, EventEmitter, h, Host, Listen, Prop, State } from "@stencil/core"
import { isoly } from "isoly"
import { Data } from "../../model"
@Component({
	tag: "smoothly-contact",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyContact {
	smoothlyForm?: HTMLSmoothlyFormElement
	@Prop({ mutable: true }) readonly = false
	// @Prop() contact?: TO ADD: To display existing contact
	@Event() contactForm: EventEmitter<Data>
	@State() country: isoly.CountryCode.Alpha2 | undefined
	@Listen("smoothlyFormSubmit")
	formSubmitHandler(event: CustomEvent<Data>) {
		event.stopPropagation()
		this.contactForm.emit(event.detail)
	}
	onFormEdited() {
		this.country = (this.smoothlyForm?.value?.countryCode as isoly.CountryCode.Alpha2) ?? undefined
	}
	getAddressInputs(): HTMLSmoothlyInputElement[] {
		const base: HTMLSmoothlyInputElement[] = [
			<smoothly-input type="text" name="street">
				Street
			</smoothly-input>,
			<smoothly-input type="text" name="zipCode">
				Zip code
			</smoothly-input>,
			<smoothly-input type="text" name="city">
				City
			</smoothly-input>,
		]
		const picker = (
			<smoothly-picker name="countryCode" class="fullWidth">
				<span slot="label">Country code</span>
				<span slot="search">Search</span>
				{isoly.CountryCode.Alpha2.types.map(countryCode => (
					<smoothly-picker-option
						key={countryCode}
						value={countryCode}
						selected={countryCode == this.country}
						search={[isoly.CountryCode.Alpha2.types.find(value => value == countryCode) ? countryCode : []].flat()}>
						<span>{isoly.CountryCode.Alpha2.types.find(value => value == countryCode)}</span>
					</smoothly-picker-option>
				))}
			</smoothly-picker>
		)
		let result: HTMLSmoothlyInputElement[] = []
		switch (this.country) {
			case "SE":
				result = base
				break
			case "GB":
				result = [
					...base,
					<smoothly-input type="text" name="building">
						Building
					</smoothly-input>,
				]
				break
			default:
				result = [
					...base,
					<smoothly-input type="text" name="county" required={false}>
						County
					</smoothly-input>,
					<smoothly-input type="text" name="state" required={false}>
						State
					</smoothly-input>,
				]
				break
		}
		return [...result, picker]
	}
	render() {
		return (
			<Host>
				<smoothly-form
					readonly={this.readonly}
					onSmoothlyFormInput={() => this.onFormEdited()}
					looks={!this.readonly ? "border" : "line"}
					name="contact"
					ref={e => (this.smoothlyForm = e)}>
					<smoothly-input type="text" name="first">
						First name
					</smoothly-input>
					<smoothly-input type="text" name="last">
						Last name
					</smoothly-input>
					<smoothly-input type="text" name="email">
						E-mail
					</smoothly-input>
					<smoothly-input type="text" name="phone">
						Phone number
					</smoothly-input>
					{...this.getAddressInputs()}
					<smoothly-input-clear slot="clear" type="form" color="danger" fill="solid">
						<smoothly-icon size="small" name="refresh-outline" toolTip="Clear all fields" />
					</smoothly-input-clear>
					<smoothly-submit slot="submit" color="success">
						<smoothly-icon size="small" name="checkmark-outline" toolTip="Submit changes" />
					</smoothly-submit>
				</smoothly-form>
			</Host>
		)
	}
}
