import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-theme-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemePicker {
	@Prop() element = "smoothly-css"
	render() {
		return (
			<Host>
				<smoothly-input-select
					name="theme"
					onSmoothlyInput={e => {
						const element = document.querySelector(`#${this.element}`)
						if (element instanceof HTMLLinkElement && typeof e.detail.theme == "string")
							element.href = e.detail.theme
					}}>
					<slot></slot>
				</smoothly-input-select>
			</Host>
		)
	}
}