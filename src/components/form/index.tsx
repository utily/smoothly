import { Component, Event, EventEmitter, h, Listen, Method, Prop } from "@stencil/core"
import { Data } from "./Data"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm {
	@Prop({ reflect: true, attribute: "looks" }) looks: "plain" | "grid" | "border" | "line" = "plain"
	value: Data = {}
	@Prop() name?: string
	@Event() smoothlyInput: EventEmitter<{ name: string; value: Data }>
	clearables = new Set<Clearable>()

	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		event.stopPropagation()
		this.value = Object.entries(event.detail).reduce(
			(r, [name, value]) => Data.set(r, name.split("."), value),
			this.value
		)
		if (Clearable.is(event.target))
			this.clearables.add(event.target)
	}
	@Method()
	async clear(): Promise<void> {
		this.clearables.forEach(c => c.clear())
	}
	render() {
		return (
			<form
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

interface Clearable {
	clear(): Promise<void>
}
namespace Clearable {
	export function is(value: Clearable | any): value is Clearable {
		return value && typeof value == "object" && typeof value.clear == "function"
	}
}
