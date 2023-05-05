import { Component, Element, Event, EventEmitter, h, Listen, Prop, Watch } from "@stencil/core"
import { Clearable } from "../../form/Clearable"
@Component({
	tag: "smoothly-input-clear",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputClear {
	@Prop({ reflect: true }) display = true
	@Prop({ reflect: true }) name?: string
	@Element() hostElement: HTMLElement
	@Event() smoothlyInputClear: EventEmitter
	@Event() smoothlyInputClearDisplay: EventEmitter<{ name: string | undefined; display: boolean }>

	async componentWillLoad() {
		this.smoothlyInputClearDisplay.emit({ name: this.name, display: this.display })
	}

	@Watch("display")
	onChangeDisplay() {
		this.smoothlyInputClearDisplay.emit({ name: this.name, display: this.display })
	}

	@Listen("click")
	clickHandler() {
		const node = this.hostElement.parentElement
		if (Clearable.is(node))
			return node.clear()
		this.smoothlyInputClear.emit()
	}

	render() {
		return (
			<host>
				<slot />
			</host>
		)
	}
}
