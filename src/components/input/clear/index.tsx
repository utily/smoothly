import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { SmoothlyForm } from "../../form"
import { SmoothlyInput } from ".."
import { Changeable } from "../Changeable"
import { Clearable } from "../Clearable"

@Component({
	tag: "smoothly-input-clear",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputClear {
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "clear"
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	private parent?: Clearable | (Clearable & Changeable)
	@Event() smoothlyInputClearLoad: EventEmitter<(parent: HTMLElement) => void>

	async componentWillLoad() {
		this.smoothlyInputClearLoad.emit(parent => {
			if (Clearable.is(parent)) {
				this.parent = parent
				if (Changeable.is(parent))
					parent.listen("changed", async p => {
						if (p instanceof SmoothlyForm)
							this.disabled = !p.changed
						if (p instanceof SmoothlyInput)
							this.display = p.changed
					})
			}
		})
	}
	@Listen("click")
	clickHandler() {
		this.parent?.clear()
	}
	render() {
		return (
			<Button disabled={this.disabled} type="button">
				<slot />
			</Button>
		)
	}
}
