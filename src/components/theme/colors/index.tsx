import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-theme-colors",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColors {
	render() {
		return (
			[
				"primary",
				"secondary",
				"tertiary",
				"success",
				"warning",
				"danger",
				"light",
				"medium",
				"dark",
				"default",
			] as const
		).map(color => <smoothly-theme-color color={color} />)
	}
}
