import { Component, h, Host, Listen, State } from "@stencil/core"
import { Data, Notice } from "../../../model"
import { Controls } from "../menu"

function validateEmail(email: string) {
	return email.match(/^.+@.+/) ? true : { result: false, notice: Notice.failed("That is not an email") }
}

@Component({
	tag: "smoothly-picker-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPickerDemo {
	private controls?: Controls
	private users: Record<string, string | undefined> = {
		"giovani@rocket.com": "giovani doe",
		"jessie@rocket.com": "jessie doe",
		"james@rocket.com": "james doe",
	}
	@State() data = {
		message: "hello world",
		emails: ["jessie@rocket.com", "james@rocket.com"],
		options: ["giovani@rocket.com"],
	}
	@State() change?: SmoothlyPickerDemo["data"]
	inputHandler(event: CustomEvent<Data>) {
		if (this.change) {
			this.change = {
				...this.change,
				...event.detail,
			}
			console.log("demo input", this.change)
		}
	}
	@Listen("smoothlyFormSubmit")
	submitHandler(event: CustomEvent<Data>) {
		console.log("submitted", event.detail)
	}
	clickHandler() {
		if (!this.change)
			this.controls?.remember()
		else
			this.controls?.restore()
		this.change = this.change ? undefined : { ...this.data, emails: [...this.data.emails] }
	}
	loadedHandler(event: CustomEvent<Controls>) {
		this.controls = event.detail
	}
	render() {
		return (
			<Host>
				<smoothly-button onClick={() => this.clickHandler()}>
					{!this.change ? "start edit" : "end edit"}
				</smoothly-button>
				<h5>Controlled input</h5>
				<smoothly-form looks="line" onSmoothlyFormInput={e => this.inputHandler(e as any)}>
					<smoothly-input readonly={!this.change} name="message" value={this.data.message}>
						Message
					</smoothly-input>
					<smoothly-picker
						name="emails"
						mutable
						multiple
						readonly={!this.change}
						validator={validateEmail}
						onSmoothlyPickerLoaded={e => this.loadedHandler(e)}>
						<span slot="label">Emails</span>
						<span slot="search">Search</span>
						<smoothly-icon size="tiny" slot="display" name="person-add-outline" />
						{(this.change?.emails ?? this.data.emails).map(email => (
							<smoothly-picker-option key={email} value={email} selected search={[this.users[email] ?? []].flat()}>
								<span>{this.users[email]}</span>
								<span slot="label">{email}</span>
								<smoothly-icon size="tiny" slot="display" name="person-outline" />
							</smoothly-picker-option>
						))}
						{this.data.options.map(email => (
							<smoothly-picker-option key={email} value={email} search={[this.users[email] ?? []].flat()}>
								<span>{this.users[email]}</span>
								<span slot="label">{email}</span>
								<smoothly-icon size="tiny" slot="display" name="person-outline" />
							</smoothly-picker-option>
						))}
					</smoothly-picker>
					<smoothly-submit size="icon" slot="submit">
						<smoothly-icon name="checkmark-circle" />
					</smoothly-submit>
					<smoothly-input-clear type="form" color="danger" fill="solid" slot="clear">
						Clear
					</smoothly-input-clear>
				</smoothly-form>
				<h5>uncontrolled inputs</h5>
				<smoothly-form onSmoothlyFormSubmit={e => console.log("submitted", e.detail)} looks="line">
					<smoothly-input name="purpose" type="text">
						Purpose
					</smoothly-input>
					<smoothly-picker multiple mutable name="emails" validator={validateEmail}>
						<span slot="label">Emails</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={"james@rocket.com"}>james@rocket.com</smoothly-picker-option>
						<smoothly-picker-option selected value={"jessie@rocket.com"}>
							jessie@rocket.com
						</smoothly-picker-option>
						<smoothly-picker-option value={"giovanni@rocket.com"}>giovanni@rocket.com</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
					<smoothly-input-clear type="form" color="danger" fill="solid" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-picker name="shape">
						<span slot="label">Shape</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={"circle"}>
							<span slot="label">Circle</span>
							<smoothly-icon size="tiny" name="ellipse-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"cube"}>
							<span slot={"label"}>Cube</span>
							<smoothly-icon size="tiny" name="cube-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"square"} selected>
							<span slot={"label"}>Square</span>
							<smoothly-icon size="tiny" name="square-outline" />
						</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-picker multiple readonly name="animals">
						<span slot="label">Animals</span>
						<span slot="search">Search</span>
						<smoothly-picker-option selected value={"cat"}>
							Cat
						</smoothly-picker-option>
						<smoothly-picker-option value={"dog"}>Dog</smoothly-picker-option>
						<smoothly-picker-option value={"fish"}>Fish</smoothly-picker-option>
					</smoothly-picker>
				</smoothly-form>
			</Host>
		)
	}
}
