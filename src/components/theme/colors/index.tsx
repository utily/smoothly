import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-theme-colors",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeColors {
	render() {
		return (
			<Host>
				{colors.map(color => (
					<smoothly-theme-color color={color}></smoothly-theme-color>
				))}
				<smoothly-button
					onClick={e => {
						console.log(`@import "./common.css";
						:root {
						${colors
							.map(color =>
								variants
									.map(variant => {
										const variableName = `--smoothly-${color}-${variant}`
										return `${variableName}: ${document.documentElement.style.getPropertyValue(variableName)};`
									})
									.join("\n\t")
							)
							.join("\n\n\t")}
						--smoothly-shadow: 0 0 4px 2px rgba(var(--smoothly-color-contrast), 0.25);
						--smoothly-shadow-strong: 0 0 4px 4px rgba(var(--smoothly-light-color), 0.25);
						--border-radius: 0.25rem;
						--input-width: 18rem;
						--table-width: 100%;
					}
					`)
					}}>
					<smoothly-icon name="cloud-download"></smoothly-icon>
				</smoothly-button>
			</Host>
		)
	}
}

const colors = [
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
const variants = ["tint", "color", "shade", "contrast"] as const
