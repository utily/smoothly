import { Component, h, Listen, Prop, State } from "@stencil/core"
import { isoly } from "isoly"
import { Fill, Icon } from "../../model"
import { Looks } from "../input/Looks"
import { Address } from "./model"

@Component({
	tag: "smoothly-address-form",
	scoped: true,
})
export class SmoothlyAddressForm {
	smoothlyForm?: HTMLSmoothlyFormElement
	@Prop({ mutable: true }) address?: isoly.Address[Address.Code.Type]
	@Prop({ mutable: true }) recipient?: Address.Recipient
	@Prop() countryCode?: isoly.CountryCode.Alpha2
	@Prop() readonly = false
	@Prop() looks?: Looks
	@Prop() buttons: {
		text?: { submit: string; clear: string }
		icon?: { submit: Icon; clear: Icon; size?: "tiny" | "small" | "medium" | "large" }
		size?: "flexible" | "small" | "large" | "icon" | undefined
		fill?: Fill
	} = { icon: { submit: "checkmark-circle", clear: "arrow-undo-circle" }, size: "flexible", fill: "clear" }
	@State() code?: isoly.CountryCode.Alpha2
	// @State() formData?: isoly.Address[Address.Code.Type]
	@Listen("smoothlyFormSubmit")
	onFormSubmit(event: CustomEvent<Record<string, any>>) {
		console.log("smoothlyFormSubmit", event.detail)
	}
	mapping() {
		return Address.toMapping(this.address ?? Address.Code.from(this.countryCode ?? this.code), this.recipient)
	}
	picker(): (HTMLSmoothlyPickerElement | HTMLSmoothlyInputElement)[] {
		const readonly = this.readonly || typeof this.countryCode == "string"
		const readonlyValue = this.address?.countryCode ?? this.countryCode
		return readonly
			? readonlyValue
				? [
						<smoothly-input name="country" type="text" readonly value={readonlyValue}>
							Country
						</smoothly-input>,
				  ]
				: []
			: [
					<smoothly-picker name="country" class="fullWidth">
						<span slot="label">Country</span>
						<span slot="search">Search</span>
						{isoly.CountryCode.Alpha2.types.map(code => (
							<smoothly-picker-option
								key={code}
								value={code}
								selected={code == this.address?.countryCode}
								search={[code, isoly.CountryCode.Name.en.from(code)]}>
								{`${code} - ${isoly.CountryCode.Name.en.from(code)}`}
							</smoothly-picker-option>
						))}
					</smoothly-picker>,
			  ]
	}
	formButtons(): (HTMLSmoothlyInputClearElement | HTMLSmoothlySubmitElement)[] {
		return this.readonly
			? []
			: [
					<smoothly-input-clear
						size={this.buttons.size}
						type="form"
						color="danger"
						slot="clear"
						fill={this.buttons.fill}>
						{this.buttons.icon && (
							<smoothly-icon
								name={this.buttons.icon.clear}
								size={this.buttons.icon.size ?? "medium"}
								color="danger"
								fill={this.buttons.fill}></smoothly-icon>
						)}
						{this.buttons.text?.clear ?? ""}
					</smoothly-input-clear>,
					<smoothly-submit size={this.buttons.size} slot="submit" color="success" fill={this.buttons.fill}>
						{this.buttons.icon && (
							<smoothly-icon
								name={this.buttons.icon.submit}
								size={this.buttons.icon.size ?? "medium"}
								color="success"
								fill={this.buttons.fill}></smoothly-icon>
						)}
						{this.buttons.text?.submit ?? ""}
					</smoothly-submit>,
			  ]
	}
	render() {
		return (
			<smoothly-form looks={this.looks} name="contact-address" ref={e => (this.smoothlyForm = e)}>
				<slot></slot>
				{this.mapping().map(([field, data]) => (
					<smoothly-input
						name={field}
						type={data.type}
						readonly={this.readonly}
						value={data.value}
						required={data.required}>
						{data.display}
					</smoothly-input>
				))}
				{this.picker()}
				{this.formButtons()}
			</smoothly-form>
		)
	}
}
