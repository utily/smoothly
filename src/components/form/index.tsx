import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm {
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	@Prop({ reflect: true, attribute: "colums" }) columns?: number
	@Prop({ reflect: true, attribute: "rows" }) rows?: number
	render() {
		return (
			<form
				action="done"
				style={{
					position: "relative",
					gridTemplateColumns: `repeat(${this.columns}, auto)`,
					gridTemplateRows: `repeat(${this.rows}, auto)`,
				}}>
				<fieldset>
					<slot></slot>
				</fieldset>
				<slot name="submit"></slot>
			</form>
		)
	}
}
