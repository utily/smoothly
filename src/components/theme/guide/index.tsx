import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-theme-guide",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColors {
	render() {
		return [
			<smoothly-display>
				Tint is used as background to highlight, for example hovering an item in the select menu.
			</smoothly-display>,
			<br />,
			<smoothly-display>
				Color is used as a normal background or as a background to show that something is selected, for example a
				selected item in the select menu.
			</smoothly-display>,
			<br />,
			<smoothly-display>
				Shade is used as border and for symbols in buttons. It works as a semi-low contrast against color and tint.
			</smoothly-display>,
			<br />,
			<smoothly-display>
				One can use the {"<smoothly-color>"} component to switch between what color set is used.{" "}
			</smoothly-display>,
			<br />,
		]
	}
}
