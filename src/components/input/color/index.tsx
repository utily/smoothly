import { Component, h, Host, Prop, VNode } from "@stencil/core"
// import { Component, ComponentWillLoad, h, Host, VNode } from "@stencil/core"
// import { Clearable } from "../Clearable"
// import { Input } from "../Input"

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor {
	@Prop({ mutable: true, reflect: true }) value = "#333"
	render(): VNode | VNode[] {
		return (
			<Host style={{ "--value": this.value }}>
				<smoothly-input name="color" value={this.value}>
					Color
				</smoothly-input>
				<div class="color-sample"></div>
			</Host>
		)
	}
}
