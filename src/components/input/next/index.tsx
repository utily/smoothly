import { Component, ComponentWillLoad, h, Prop, State, Watch } from "@stencil/core"
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
			console.log(event.inputType, event.data, state)
			this.enforceSelection = event.defaultPrevented
		})
	}
	componentDidRender() {
		if (this.enforceSelection) {
			this.inputElement.selectionStart = this.state.selection.start
			this.inputElement.selectionEnd = this.state.selection.end
			this.inputElement.selectionDirection = this.state.selection.direction ?? null
			this.enforceSelection = false
		}
		console.log("did render", this.state.selection.start, this.inputElement.selectionStart)
	}

	render() {
		return (
			<input
				ref={(e: HTMLInputElement) => (this.inputElement = e)}
				value={this.state.value}
				type={this.type}
				placeholder={this.type}
				onCompositionstart={e => this.action.onCompositionStart(e, this.state)}
				onCompositionupdate={e => this.action.onCompositionUpdate(e, this.state)}
				onCompositionend={e => this.action.onCompositionEnd(e, this.state)}
				selectionStart={this.state.selection.start} // TODO see if selection still works on phones
				selectionEnd={this.state.selection.end}
				selectionDirection={this.state.selection.direction}></input>
		)
	}
}
