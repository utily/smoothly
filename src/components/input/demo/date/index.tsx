import { Component, Fragment, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-date-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateDemo {
	@State() date?: isoly.Date
	@State() alwaysShowFormat = false

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
							this.alwaysShowFormat = e.detail.value
							console.log(this.alwaysShowFormat)
						}}>
						Always Show Format
					</smoothly-input-checkbox>
				</div>
				{(["en-US", "en-GB", "de-DE", "se-SE"] as isoly.Locale[]).map(locale => (
					<Fragment>
						<smoothly-input-date
							locale={locale}
							name={locale}
							looks="border"
							value={this.date}
							alwaysShowFormat={this.alwaysShowFormat}>
							{locale}
							<smoothly-input-clear slot="end" />
						</smoothly-input-date>
						<smoothly-input-date-range
							locale={locale}
							name={locale + "-range"}
							looks="border"
							start={this.date}
							end={this.date ? isoly.Date.next(this.date) : undefined}
							alwaysShowFormat={this.alwaysShowFormat}>
							{locale} Range
							<smoothly-input-clear slot="end" />
						</smoothly-input-date-range>
					</Fragment>
				))}
			</Host>
		)
	}
}
