import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-address-display",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAddressDisplay {
	@Prop() value: any
	//TODO: isoly.Address type
	@Prop({ mutable: true }) editable: boolean
	render() {
		return (
			<div>
				<span>
					<h4>Address</h4>
					<smoothly-icon name="create-outline" size="small" onClick={() => (this.editable = !this.editable)} />
				</span>
				{this.editable
					? [
							<smoothly-input type="text" name="street" value={this.value.street}>
								Street
							</smoothly-input>,
							<smoothly-input type="postal-code" name="zip" value={this.value.zipCode}>
								ZipCode
							</smoothly-input>,
							<smoothly-input type="text" name="city" value={this.value.city}>
								City
							</smoothly-input>,
							<smoothly-input type="text" name="countryCode" value={this.value.countryCode}>
								CountryCode
							</smoothly-input>,
					  ]
					: [
							<p>{this.value.street}</p>,
							<p>{this.value.zipCode}</p>,
							<p>{this.value.city}</p>,
							<p>{this.value.countryCode}</p>,
					  ]}
			</div>
		)
	}
}
