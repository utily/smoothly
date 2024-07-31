import { Component, ComponentWillLoad, h, Host, Prop, State, Watch } from "@stencil/core"
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
	private inputElement: HTMLInputElement
	@Prop({ reflect: true }) type: tidily.Type = "text"
	@Prop() currency?: isoly.Currency
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	private action: Action
	private enforceSelection = false // needed to know if selection should be kept

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
	componentDidLoad() {
		this.inputElement.addEventListener("beforeinput", (event: InputEvent) => {
			// Get actual selection (can't selection event from all devices)
			const state = this.action.createState({
				value: this.state.value,
				selection: {
					start: this.inputElement.selectionStart ?? 0,
					end: this.inputElement.selectionEnd ?? 0,
					direction: this.inputElement.selectionDirection ?? undefined,
				},
			})
			this.state = this.action.onBeforeInput(event, state)
			console.log(event.inputType, (event.target as HTMLInputElement).value, event, event.data, state)
			this.enforceSelection = event.defaultPrevented
		})
	}
	onInput(event: InputEvent) {
		console.log("onIput", event.inputType, (event.target as HTMLInputElement).value)
		this.state = this.action.onInput(event, this.state)
	}
	componentDidRender() {
		if (this.enforceSelection) {
			this.inputElement.selectionStart = this.state.selection.start
			this.inputElement.selectionEnd = this.state.selection.end
			this.inputElement.selectionDirection = this.state.selection.direction ?? null
			this.enforceSelection = false
		}
		// console.log("did render", this.state.selection.start, this.inputElement.selectionStart)
	}

	render() {
		return (
			<Host>
				<input
					ref={(e: HTMLInputElement) => (this.inputElement = e)}
					// value={this.state.value}
					type={this.state.type}
					inputMode={this.state.inputmode}
					placeholder={this.type}
					onInput={(e: InputEvent) => this.onInput(e)}
					onCompositionstart={e => (this.state = this.action.onCompositionStart(e, this.state))}
					onCompositionupdate={e => (this.state = this.action.onCompositionUpdate(e, this.state))}
					onCompositionend={e => (this.state = this.action.onCompositionEnd(e, this.state))}

					// selectionStart={this.state.selection.start} // TODO see if selection still works on phones
					// selectionEnd={this.state.selection.end}
					// selectionDirection={this.state.selection.direction}
				></input>
				<pre style={{ margin: "0" }}>{this.state.value}</pre>
				<pre style={{ margin: "0" }}>{this.action.composition?.data}</pre>
			</Host>
		)
	}
}
