import { Component, h, Host, State, VNode, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { SmoothlyFormCustomEvent } from "../../../../components"
import { Data } from "../../../../model"

@Component({
	tag: "smoothly-form-demo-controlled",
	scoped: true,
})
export class SmoothlyFormDemoControlled {
	@State() name = "Initial name"
	@State() currency: isoly.Currency = "EUR"
	@State() date: isoly.Date = isoly.Date.now()
	private currencies: isoly.Currency[] = ["GBP", "SEK", "EUR", "USD"]

	@Watch("name")
	nameChanged(current: string, previous: string): void {
		console.log(`updated name from '${previous}' to '${current}'`)
	}

	async submitHandler(
		event: SmoothlyFormCustomEvent<{ result: (result: boolean) => void; value: Data }>
	): Promise<void> {
		event.stopPropagation()
		console.log("Received event. Processing...", event.detail)
		if (!(typeof event.detail.value.name == "string")) {
			console.error("Bad input. Resolving false.")
		} else if (!(typeof event.detail.value.date == "string"))
			console.error("Bad input. Resolving false.")
		else if (!isoly.Currency.is(event.detail.value.currency))
			console.error("Bad input. Resolving false.")
		else {
			await new Promise(resolve => window.setTimeout(resolve, 1_000))
			this.name = event.detail.value.name
			this.date = event.detail.value.date
			this.currency = event.detail.value.currency
			console.log("Finished processing successfully. Resolving true.")
			event.detail.result(true)
		}
		event.detail.result(false)
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<h2>Controlled</h2>
				<smoothly-form readonly looks={"grid"} onSmoothlyFormSubmit={e => this.submitHandler(e)}>
					<smoothly-input type={"text"} name={"name"} value={this.name}>
						Name
					</smoothly-input>
					<smoothly-input-select name={"currency"}>
						<span slot={"label"}>Currency</span>
						{this.currencies.map(currency => (
							<smoothly-item selected={currency == this.currency} value={currency}>
								{currency}
							</smoothly-item>
						))}
					</smoothly-input-select>
					<smoothly-input>Dummy</smoothly-input>
					<smoothly-input-month name={"date"} value={this.date} next previous>
						<span slot={"year-label"}>Year</span>
						<span slot={"month-label"}>Month</span>
					</smoothly-input-month>
					<smoothly-input-edit slot={"edit"} size={"icon"} color={"primary"} fill={"default"} />
					<smoothly-input-reset slot={"reset"} size={"icon"} color={"warning"} fill={"default"} />
					<smoothly-input-submit slot={"submit"} size={"icon"} color={"success"} />
				</smoothly-form>
			</Host>
		)
	}
}
