import {
	Component,
	ComponentWillLoad,
	Event,
	EventEmitter,
	h,
	Host,
	Method,
	Prop,
	State,
	VNode,
	Watch,
} from "@stencil/core"
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
		this.inputElement.addEventListener("beforeinput", (e: InputEvent) => {
			// Get actual selection (can't selection event from all devices)
			const state = this.action.createState({
				value: this.state.value,
				selection: {
					start: this.inputElement.selectionStart ?? 0,
					end: this.inputElement.selectionEnd ?? 0,
					direction: this.inputElement.selectionDirection ?? undefined,
				},
			})
			console.log(e.inputType, e.data, state.selection.start, state.selection.end)
			if (e.inputType == "insertText" && typeof e.data == "string") {
				e.preventDefault()
				this.state = this.action.insertText(state, e.data)
			} else if (e.inputType == "deleteContentBackward") {
				e.preventDefault()
				this.state = this.action.deleteContentBackward(state)
			}
		})
	}

	render() {
		return (
			<input
				ref={(e: HTMLInputElement) => (this.inputElement = e)}
				value={this.state.value}
				selectionStart={this.state.selection.start} // TODO see if this still works on android phones
				selectionEnd={this.state.selection.end}
				selectionDirection={this.state.selection.direction}></input>
		)
	}
}
