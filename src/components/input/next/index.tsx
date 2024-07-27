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
		this.inputElement.addEventListener("beforeinput", (e: InputEvent) => {
			console.log(e.inputType, e.data)
			if (e.inputType == "insertText" && typeof e.data == "string") {
				e.preventDefault()
				this.state = Action.insertText(this.formatter, this.state, e.data)
			}
		})
	}

	render() {
		return <input ref={(e: HTMLInputElement) => (this.inputElement = e)} value={this.state.value}></input>
	}
}
