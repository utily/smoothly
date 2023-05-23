import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-picker-tester",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerTester {
	@State() readonly = true
	@State() data = {
		message: "hello world",
		emails: ["giovani@rocket.com", "jessie@rocket.com", "james@rocket.com"],
	}
	render() {
		return (
			<Host>
				<div>
					<smoothly-button color="tertiary" onClick={() => (this.readonly = !this.readonly)}>
						Toggle readonly
					</smoothly-button>
					<span>Form is currently {this.readonly ? "readonly" : "writable"}</span>
				</div>

				<smoothly-form
					looks="grid"
					onSmoothlyFormInput={e => (this.data = { ...this.data, ...e.detail })}
					onSmoothlyFormSubmit={e => console.log("submit", { ...this.data, ...e.detail })}>
					<smoothly-input type="text" name="message" value={this.data.message}>
						Message
					</smoothly-input>
					<smoothly-picker readonly={this.readonly} name="emails" multiple mutable>
						<span slot="label">Emails</span>
						<span slot="search">Search</span>
						{this.data.emails.map(email => (
							// OBS using this key property is important with the mutable picker!
							// without it stencil may reuse a removed option for remaining options
							// causing a horrible de-sync
							//                       V
							<smoothly-picker-option key={email} value={email} selected>
								{email}
							</smoothly-picker-option>
						))}
					</smoothly-picker>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>
			</Host>
		)
	}
}
