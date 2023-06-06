import { Component, h, Host, State } from "@stencil/core"

type Selected = "input" | "select" | "date" | "form"

@Component({
	tag: "smoothly-input-new-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNewDemo {
	@State() selected: Selected = "input"
	render() {
		return (
			<Host>
				<nav>
					{["input", "select", "date", "form"].map((link: Selected) => (
						<span onClick={() => (this.selected = link)} class={this.selected == link.toLowerCase() ? "selected" : ""}>
							{link.toLocaleUpperCase()}
						</span>
					))}
				</nav>
				{this.selected == "input" && <smoothly-input-new-preview />}
				{this.selected == "form" && <smoothly-form-new-preview />}
			</Host>
		)
	}
}
