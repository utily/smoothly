import { Component, h, State } from "@stencil/core"

@Component({
	tag: "smoothly-picker-tester",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerTester {
	@State() data = {
		message: "hello world",
		emails: ["giovani@rocket.com", "jessie@rocket.com", "james@rocket.com"],
	}
	render() {
		return (
			<smoothly-form
				looks="grid"
				onSmoothlyFormInput={e => console.log("input", (this.data = { ...this.data, ...e.detail }))}
				onSmoothlyFormSubmit={e => console.log("submit", { ...this.data, ...e.detail })}>
				<smoothly-input type="text" name="message" value={this.data.message}>
					Message
				</smoothly-input>
				<smoothly-picker name="type" multiple mutable>
					<span slot="label">Emails</span>
					<span slot="search">Search</span>
					{this.data.emails.map(email => (
						<smoothly-picker-option value={email} selected>
							{email}
						</smoothly-picker-option>
					))}
				</smoothly-picker>
				<smoothly-submit slot="submit">Submit</smoothly-submit>
			</smoothly-form>
		)
	}
}
