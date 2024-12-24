import { Component, h, Host, State } from "@stencil/core"
import { Color } from "../../../model"

@Component({
	tag: "smoothly-theme-dark-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeDarkToggle {
	private originalTheme: Record<string, string> = {}
	@State() darkMode = false
	@State() properties = {
		lightnessMin: 5,
		lightnessMax: 95,
	}

	collectOriginalTheme() {
		const computed = window.getComputedStyle(window.document.body)
		for (let i = 0; i < computed.length; i++) {
			const prop = computed[i]
			const value = computed.getPropertyValue(prop)
			const match = /^\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*$/.test(value)
			if (
				prop.includes("smoothly") &&
				(prop.endsWith("color") || prop.endsWith("tint") || prop.endsWith("shade") || prop.endsWith("contrast")) &&
				match
			) {
				this.originalTheme[prop] = value
			}
		}
	}

	setDarkMode() {
		this.darkMode = true
		for (const [prop, value] of Object.entries(this.originalTheme)) {
			const dark = this.toDarkTheme(value)
			console.log("setting dark mode", prop, value, dark)
			document.documentElement.style.setProperty(prop, `${dark.r}, ${dark.g}, ${dark.b}`)
		}
	}
	resetMode() {
		this.darkMode = false
		for (const [prop, value] of Object.entries(this.originalTheme)) {
			document.documentElement.style.setProperty(prop, value)
		}
	}
	toDarkTheme(commaRGB: string): Color.RGB {
		const [r, g, b] = commaRGB.split(",").map(Number)
		const { h, s, l } = Color.RGB.toHSL({ r, g, b })
		if (typeof h == "number" && typeof s == "number" && typeof l == "number") {
			const newS = s * 0.8
			const newL =
				l > 70
					? Math.max(this.properties.lightnessMin, (100 - l) * 0.8)
					: l < 30
					? Math.min(this.properties.lightnessMax, (100 - l) * 1.5)
					: 100 - l
			return Color.RGB.round(Color.HSL.toRGB({ h, s: Math.round(newS), l: Math.round(newL) }))
		} else {
			return { r, g, b }
		}
	}

	render() {
		return (
			<Host>
				<smoothly-form
					onSmoothlyFormInput={e => {
						console.log(e.detail)
						this.properties = { ...this.properties, ...e.detail }
						this.darkMode && this.setDarkMode()
					}}>
					<smoothly-input-range name="lightnessMin" value={this.properties.lightnessMin} min={0} max={40} step={1}>
						Lightness Min
					</smoothly-input-range>
					<smoothly-input-range name="lightnessMax" value={this.properties.lightnessMax} min={60} max={100} step={1}>
						Lightness Max
					</smoothly-input-range>
				</smoothly-form>
				<smoothly-toggle-switch
					onSmoothlyToggleSwitchChange={e =>
						e.detail ? (this.collectOriginalTheme(), this.setDarkMode()) : this.resetMode()
					}
				/>
			</Host>
		)
	}
}
