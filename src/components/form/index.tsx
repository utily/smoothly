import { Component, Event, EventEmitter, h, Listen, Method, Prop } from "@stencil/core"
import { Clearable } from "./Clearable"
import { Data } from "./Data"
@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm {
	private value: Data = {}
	private clearables = new Map<string, Clearable>()
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	@Prop() name?: string
	@Event() smoothlyInput: EventEmitter<{ name: string; value: Data }>

	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		event.stopPropagation()
		this.value = Object.entries(event.detail).reduce(
			(r, [name, value]) => Data.set(r, name.split("."), value),
			this.value
		)
		if (Clearable.is(event.target)) {
			const clearable = event.target
			console.log(this.clearables)
			Object.keys(event.detail).forEach(key => this.clearables.set(key, clearable))
		}
	}
	@Method()
	async clear(): Promise<void> {
		console.log(this.clearables)
		new Set(this.clearables.values()).forEach(clearable => clearable.clear())
	}
	render() {
		return (
			<form
				onSubmit={event => (event.preventDefault(), this.clear())}
				action="done"
				style={{
					position: "relative",
				}}>
				<fieldset>
					<slot></slot>
				</fieldset>
				<slot name="submit"></slot>
			</form>
		)
	}
}
