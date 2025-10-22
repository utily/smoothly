import { Component, Fragment, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-date-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateDemo {
	@State() date?: isoly.Date
	@State() alwaysShowGuide = false

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
					<smoothly-input-checkbox
						looks="transparent"
						onSmoothlyUserInput={e => {
							this.alwaysShowGuide = e.detail.value
							console.log(this.alwaysShowGuide)
						}}>
						Always Show Guide
					</smoothly-input-checkbox>
				</div>
				{(["en-US", "en-GB", "de-DE", "se-SE"] as isoly.Locale[]).map(locale => (
					<Fragment>
						<smoothly-input-date
							locale={locale}
							name={locale}
							looks="border"
							value={this.date}
							alwaysShowGuide={this.alwaysShowGuide}>
							{locale}
							<smoothly-input-clear slot="end" />
						</smoothly-input-date>
						<smoothly-input-date-range
							locale={locale}
							name={locale + "-range"}
							looks="border"
							start={this.date}
							end={this.date ? isoly.Date.next(this.date) : undefined}
							alwaysShowGuide={this.alwaysShowGuide}>
							{locale} Range
							<smoothly-input-clear slot="end" />
						</smoothly-input-date-range>
					</Fragment>
				))}
			</Host>
		)
	}
}
