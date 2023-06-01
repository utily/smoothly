import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-picker-tester",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerTester {
	@State() readonly = true
	private users: Record<string, string | undefined> = {
		"giovani@rocket.com": "giovani doe",
		"jessie@rocket.com": "jessie doe",
		"james@rocket.com": "james doe",
	}
	@State() data = {
		message: "hello world",
		emails: ["giovani@rocket.com", "jessie@rocket.com", "james@rocket.com"],
	}
	render() {
		return (
			<Host>
				{/* <div>
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
				</smoothly-form> */}
				{/* <smoothly-m>
					<smoothly-o value={"cube"}>
						<smoothly-icon name="cube-outline" />
					</smoothly-o>
					<smoothly-o value={"square"}>
						<smoothly-icon name="square-outline" />
					</smoothly-o>
				</smoothly-m> */}
				{/* <smoothly-form onSmoothlyFormInput={e => console.log("form input", e.detail)}>
					<smoothly-picker name="shapes" multiple mutable>
						<span slot="label">Shape</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={{ shape: "square" }}>
							<smoothly-icon name="square-outline" />
						</smoothly-picker-option2>
						<smoothly-picker-option value={{ shape: "cube" }}>
							<smoothly-icon name="cube-outline" />
						</smoothly-picker-option2>
						<smoothly-picker-option value={{ shape: "circle" }}>
							<smoothly-icon name="ellipse-outline" />
						</smoothly-picker-option2>
					</smoothly-picker2>
				</smoothly-form> */}
				<smoothly-form
					looks="line"
					onSmoothlyFormInput={e => {
						console.log("email form change", e.detail)
						this.data = { ...this.data, ...e.detail }
					}}>
					<smoothly-picker name="emails" mutable multiple>
						<span slot="label">Emails</span>
						<span slot="search">Search</span>
						<smoothly-icon size="tiny" slot="display" name="person-add-outline" />
						{this.data.emails.map(email => (
							<smoothly-picker-option value={email} selected search={[this.users[email] ?? []].flat()}>
								<span>{this.users[email]}</span>
								<span slot="label">{email}</span>
								<smoothly-icon size="tiny" slot="display" name="person-outline" />
							</smoothly-picker-option>
						))}
					</smoothly-picker>
				</smoothly-form>
			</Host>
		)
	}
}
