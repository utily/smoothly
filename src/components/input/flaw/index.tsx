import { Component, h, Host, Prop, VNode } from "@stencil/core"
import { isly } from "isly"
import { Color } from "../../../model"

@Component({
	tag: "smoothly-input-flaw",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFlaw {
	@Prop({ mutable: true }) value?: isly.Flaw
	@Prop({ reflect: true }) color: Color

	render(): VNode | VNode[] {
		console.log("input-flaw", this.value)
		return (
			<Host>
				<small>{this.value?.message}</small>
			</Host>
		)
	}
}
