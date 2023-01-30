import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm {
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	render() {
		return (
			<form
				action="done"
				style={{
					position: "relative",
				}}>
				<fieldset>
					<slot></slot>
				</fieldset>
				<slot name="submit"></slot>
			</form>
		)
	}
}
