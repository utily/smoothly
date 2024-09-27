import { Component, ComponentWillLoad, h, Host, Listen, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { tidily } from "tidily"
import { Action } from "./Action"
import { getLocale } from "./getLocale"

@Component({
	tag: "smoothly-input-next",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputNext implements ComponentWillLoad {
	@Prop({ reflect: true }) type: tidily.Type = "text"
	@Prop() currency?: isoly.Currency
	@Prop({ mutable: true }) value: any
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	private action: Action

	@Watch("type")
	typeChange(): void {
		switch (this.type) {
			case "price":
				this.action = Action.create("price", this.currency)
				break
			default:
				this.action = Action.create(this.type, getLocale())
				break
		}
	}
	componentWillLoad() {
		this.typeChange()
		this.state = this.action.createState({
			value: "",
			selection: { start: 0, end: 0, direction: "none" },
		})
	}
	@Listen("input")
	@Listen("beforeinput")
	onEvent(event: InputEvent) {
		this.state = this.action.onInputEvent(event, this.state)
		if (event.type == "beforeinput")
			console.log(event.inputType, (event.target as HTMLInputElement).value, event, event.data, this.state)
	}

	render() {
		return (
			<Host>
				<input
					type={this.state.type}
					inputMode={this.state.inputmode}
					placeholder={this.type}
					onFocus={event => (this.state = this.action.onFocus(event, this.state))}
					onBlur={event => (this.state = this.action.onBlur(event, this.state))}
				/>
				<pre style={{ margin: "0" }}>
					{this.state.value}
					<span class="remainder">{this.action.formattedRemainder(this.state)}</span>
				</pre>
			</Host>
		)
	}
}
