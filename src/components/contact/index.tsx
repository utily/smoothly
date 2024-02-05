import { Component, h, Listen, Prop, State } from "@stencil/core"
import * as isoly from "isoly"
import { Fill, Icon } from "../../model"
import { SmoothlyInputClear } from "../input/clear"
import { Looks } from "../input/Looks"
import { SmoothlyInputSelect } from "../input/select"
import { SmoothlySubmit } from "../submit"
import { Address } from "./model"

@Component({
	tag: "smoothly-contact",
	scoped: true,
})
export class SmoothlyContact {
	@Prop({ mutable: true }) countryCode?: isoly.CountryCode.Alpha2
	@Prop({ mutable: true }) showPicker: boolean
	@Prop() readonly = false
	@Prop() address?: isoly.Address[Address.CountryCode]
	@Prop() looks?: Looks
	@Prop() buttons: {
		text?: { submit: string; clear: string }
		icon?: { submit: Icon; clear: Icon; size?: "tiny" | "small" | "medium" | "large" }
		size?: "flexible" | "small" | "large" | "icon" | undefined
		fill?: Fill
	} = { icon: { submit: "checkmark-circle", clear: "arrow-undo-circle" }, size: "flexible", fill: "clear" }
	@State() mapping: Address.Mapping
	@Listen("selected")
	selectedHandler(event: CustomEvent<isoly.CountryCode.Alpha2>) {
		event.stopPropagation()
		this.countryCode = event.detail
		!this.address && (this.mapping = Address.mapping[Address.getCountryCode(event.detail)])
	}
	componentWillLoad() {
		if (this.address) {
			this.showPicker = false
			this.mapping = Address.toMapping(this.address)
		} else {
			this.showPicker = !this.readonly && this.showPicker
			this.mapping = Address.mapping[this.countryCode ? Address.getCountryCode(this.countryCode) : "default"]
		}
	}
	clear() {
		this.address = undefined
		this.componentWillLoad()
	}
	picker(): SmoothlyInputSelect[] {
		return this.showPicker
			? [
					<smoothly-input-select initialValue={this.countryCode}>
						{isoly.CountryCode.Alpha2.types.map(code => (
							<smoothly-item value={code}>{isoly.CountryCode.Name.en.from(code)}</smoothly-item>
						))}
					</smoothly-input-select>,
			  ]
			: []
	}
	formButtons(): (SmoothlyInputClear | SmoothlySubmit)[] {
		let result: (SmoothlyInputClear | SmoothlySubmit)[]
		if (this.readonly)
			result = []
		else {
			result = [
				<smoothly-input-clear size={this.buttons.size} type="form" color="danger" slot="clear" fill={this.buttons.fill}>
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
		return result
	}
	render() {
		return (
			<smoothly-form looks={this.looks}>
				{[
					<slot></slot>,
					...this.mapping.map(([field, data]) => (
						<smoothly-input
							name={field}
							type={data.type}
							readonly={this.readonly}
							value={data.value}
							required={data.required}>
							{field}
						</smoothly-input>
					)),
					...this.picker(),
					...this.formButtons(),
				]}
			</smoothly-form>
		)
	}
}
