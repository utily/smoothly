import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-date-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateDemo {
	@State() date?: isoly.Date

	render() {
		return (
			<Host>
				<div>
					<h2>Date input</h2>
					<p>Different locales formatting the same date</p>
					<smoothly-button
						color="primary"
						onClick={() => (this.date = this.date ? isoly.Date.next(this.date) : isoly.Date.now())}>
						Set date
					</smoothly-button>
				</div>
				{(["en-US", "en-GB", "de-DE", "se-SE"] as isoly.Locale[]).map(locale => (
					<smoothly-input-date locale={locale} name={locale} looks="border" value={this.date}>
						{locale}
						<smoothly-input-clear slot="end" />
					</smoothly-input-date>
				))}
			</Host>
		)
	}
}
