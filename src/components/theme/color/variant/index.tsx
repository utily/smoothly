import { Component, h, Host, Listen, Prop } from "@stencil/core"
import { Color } from "../../../../model"

@Component({
	tag: "smoothly-theme-color-variant",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColorVariant {
	dialog?: HTMLSmoothlyDialogElement
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) variant: "shade" | "tint" | "color" = "color"
	@Listen("click")
	clickHandler() {
		this.dialog && (this.dialog.open = true)
	}
	render() {
		return (
			<Host>
				<smoothly-dialog header="Header" closable open={false} ref={element => (this.dialog = element)}>
					<h2>test</h2>
					<p>testar</p>
				</smoothly-dialog>
				Aa
			</Host>
		)
	}
}
