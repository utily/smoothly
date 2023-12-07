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
	@State() counter = 3
	@State() data = {
		message: "hello world",
		emails: ["jessie@rocket.com", "james@rocket.com"],
		options: [
			"giovani@rocket.com",
			"john@example.com",
			"jane@example.com",
			"jack@example.com",
			"jessica@example.com",
			"julia@example.com",
			"jayden@example.com",
			"jake@example.com",
			"jamie@example.com",
			"jasmine@example.com",
		],
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
				<div>
					<smoothly-button onClick={() => (this.counter += 1)}>Add one</smoothly-button>
					<smoothly-button onClick={() => (this.counter -= 1)}>Remove one</smoothly-button>
					<smoothly-picker
						class={"counter"}
						key={Array.from({ length: this.counter }).toString()}
						name="counter"
						multiple
						onSmoothlyInput={e => console.log("demo counter input", e.detail)}>
						{Array.from({ length: this.counter }).map((_, index) => (
							<smoothly-picker-option key={index.toString()} value={index} selected={index < this.counter - 1}>
								{index}
							</smoothly-picker-option>
						))}
						<span slot="search">Search</span>
						<button slot="child" class={"counter-button"}>
							<smoothly-icon name={"add-outline"} />
						</button>
					</smoothly-picker>
				</div>
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
					<smoothly-picker
						multiple
						readonly
						name="animals"
						onSmoothlyInput={e => console.log("demo picker animals input", e.detail)}>
						<span slot="label">Animals</span>
						<span slot="search">Search</span>
						<smoothly-picker-option selected value={"cat"}>
							Cat
						</smoothly-picker-option>
						<smoothly-picker-option value={"dog"}>Dog</smoothly-picker-option>
						<smoothly-picker-option value={"fish"}>Fish</smoothly-picker-option>
					</smoothly-picker>
				</smoothly-form>
				<smoothly-picker looks="border" name="icon" multiple>
					<span slot="label">Icon</span>
					<span slot="search">Search</span>
					<smoothly-picker-option value={"circle"} required>
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
					<smoothly-picker-option value={"airplane"}>
						<span slot={"label"}>Airplane</span>
						<smoothly-icon size="tiny" name="airplane-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"alarm"}>
						<span slot={"label"}>Alarm</span>
						<smoothly-icon size="tiny" name="alarm-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"archive"}>
						<span slot={"label"}>Archive</span>
						<smoothly-icon size="tiny" name="archive-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"bag"}>
						<span slot={"label"}>Bag</span>
						<smoothly-icon size="tiny" name="bag-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"cafe"}>
						<span slot={"label"}>Cafe</span>
						<smoothly-icon size="tiny" name="cafe-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"disc"}>
						<span slot={"label"}>Disc</span>
						<smoothly-icon size="tiny" name="disc-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"earth"}>
						<span slot={"label"}>Earth</span>
						<smoothly-icon size="tiny" name="earth-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option value={"fast-food"}>
						<span slot={"label"}>Fast food</span>
						<smoothly-icon size="tiny" name="fast-food-outline" />
					</smoothly-picker-option>
				</smoothly-picker>
				<smoothly-picker></smoothly-picker>
			</Host>
		)
	}
}
