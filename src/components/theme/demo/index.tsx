import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-theme-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyThemeDemo {
	render() {
		return (
			<Host>
				<h2>Theme</h2>
				<smoothly-theme-picker>
					<smoothly-item selected value="assets/style/smoothly.css">
						Smoothly
					</smoothly-item>
					<smoothly-item value="https://app.issuefab.com/assets/style/index.css">Issuefab</smoothly-item>
					<smoothly-item value="https://app.proquse.com/assets/style/index.css">Proquse</smoothly-item>
					<smoothly-item value="https://app.weekmeter.com/assets/style/index.css">Weekmeter</smoothly-item>
					<smoothly-item value="https://dash.pax2pay.app/p2pdash.css">Pax2Pay Dashboard</smoothly-item>
					<smoothly-item value="https://ui.pax2pay.app/assets/style/pax2pay.css">Pax2Pay Portal</smoothly-item>
					<smoothly-item value="https://theme.payfunc.com/intergiro/index.css">Intergiro Monitor</smoothly-item>
					<smoothly-item value="https://theme.payfunc.com/light/index.css">Payfunc Light</smoothly-item>
					<smoothly-item value="https://theme.payfunc.com/dark/index.css">Payfunc Dark</smoothly-item>
				</smoothly-theme-picker>
				<div>
					<smoothly-theme-colors />
					<smoothly-theme-guide />
				</div>
				<smoothly-button type="link" link="/redirect">
					To redirect
				</smoothly-button>
				<smoothly-button type="link" link="/redirect">
					To /redirect
				</smoothly-button>
				<smoothly-button type="link" link={new URL("/redirect", window.location.origin).href}>
					To new URL("redirect")
				</smoothly-button>
				<smoothly-button type="link" link="redirect/nested">
					To redirect nested
				</smoothly-button>
			</Host>
		)
	}
}
