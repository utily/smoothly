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
	@Prop() currency: isoly.Currency
	@State() state: Readonly<tidily.State> & Readonly<tidily.Settings>
	private formatter: tidily.Formatter & tidily.Converter<any>

	@Watch("type")
	typeChange(): void {
		let result: (tidily.Formatter & tidily.Converter<any>) | undefined
		switch (this.type) {
			case "price":
				result = tidily.get("price", this.currency)
				break
			default:
				result = tidily.get(this.type, getLocale())
				break
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.formatter = result || tidily.get("text")!
	}
	componentWillLoad() {
		this.typeChange()
		this.state = Action.newState(this.formatter, {
			value: "",
			selection: { start: 0, end: 0, direction: "none" },
		})
	}
	componentDidLoad() {
		this.inputElement.addEventListener("input", (e: InputEvent) => {
			console.log(e.inputType, e.data)
			// Get actual selection (can't selection event from all devices)
			const state = Action.newState(this.formatter, {
				value: this.state.value,
				selection: {
					start: this.inputElement.selectionStart ?? 0,
					end: this.inputElement.selectionEnd ?? 0,
					direction: this.inputElement.selectionDirection ?? undefined,
				},
			})
			if (e.inputType == "insertText" && typeof e.data == "string") {
				this.state = Action.insertText(this.formatter, state, e.data)
			} else if (e.inputType == "deleteContentBackward") {
				this.state = Action.deleteContentBackward(this.formatter, state)
			}
		})
	}

	render() {
		return <input ref={(e: HTMLInputElement) => (this.inputElement = e)} value={this.state.value}></input>
	}
}
