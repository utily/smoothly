import { Component, h, Host, VNode } from "@stencil/core"
import { isoly } from "isoly"
import { Contact } from "./Contact"

@Component({
	tag: "smoothly-form-demo-typed",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFormDemoTyped {
	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Typed Contact</h2>
				<smoothly-form validator={Contact.type}>
					<smoothly-input name="name.first">First Name</smoothly-input>
					<smoothly-input name="name.middle">Middle Name (optional)</smoothly-input>
					<smoothly-input name="name.last">Last Name</smoothly-input>
					<smoothly-input name="age" type="integer">
						Age (18-120)
					</smoothly-input>
					<smoothly-input-select name="country">
						<span slot="label">Country</span>
						{isoly.CountryCode.Alpha2.types.map(country => (
							<smoothly-item value={country}>{isoly.CountryCode.Name.en.from(country)}</smoothly-item>
						))}
					</smoothly-input-select>
					<smoothly-input-date name="birthday">Date of birth</smoothly-input-date>
					<smoothly-input-reset slot={"reset"} type={"form"} size={"icon"} color={"warning"} />
					<smoothly-input-submit slot={"submit"} size={"icon"} color={"success"} />
				</smoothly-form>
			</Host>
		)
	}
}
