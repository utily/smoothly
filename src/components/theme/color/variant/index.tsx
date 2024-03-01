import { Component, Element, h, Host, Listen, Prop } from "@stencil/core"
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
	@Prop() immutable = false
	@Element() element: HTMLSmoothlyThemeColorVariantElement
	private get variableName(): string {
		return `--smoothly-${this.color}-${this.variant}`
	}
	@Listen("click")
	clickHandler() {
		if (!this.immutable)
			this.dialog && (this.dialog.open = true)
	}
	render() {
		const [red, green, blue] = window
			.getComputedStyle(this.element)
			.getPropertyValue(this.variableName)
			.split(",", 3)
			.map(e => Number.parseInt(e.trim()))
		console.log(red, green, blue)
		return (
			<Host>
				{!this.immutable && (
					<smoothly-dialog header="Header" closable open={false} ref={element => (this.dialog = element)}>
						<smoothly-theme-color-variant
							immutable
							color={this.color}
							variant={this.variant}></smoothly-theme-color-variant>
						<smoothly-form
							onSmoothlyFormInput={e => {
								document.documentElement.style.setProperty(
									this.variableName,
									[e.detail.red ?? red, e.detail.green ?? green, e.detail.blue ?? blue].join(", ")
								)
							}}>
							<smoothly-input name="red" type="price" value={red}>
								red
							</smoothly-input>
							<smoothly-input name="green" type="price" value={green}>
								green
							</smoothly-input>
							<smoothly-input name="blue" type="price" value={blue}>
								blue
							</smoothly-input>
						</smoothly-form>
					</smoothly-dialog>
				)}
				Aa
			</Host>
		)
	}
}
