import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Changeable } from "../Changeable"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { SmoothlyFormNew } from "../form"

@Component({
	tag: "smoothly-clear",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyClear {
	@Prop({ reflect: true }) color?: Color = "danger"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "default"
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) reactive?: boolean
	@Event() smoothlyButtonLoad: EventEmitter<(parent: HTMLElement) => void>
	private parent?: Clearable | (Clearable & Changeable)

	async componentWillLoad() {
		this.smoothlyButtonLoad.emit(parent => {
			if (Clearable.is(parent)) {
				this.parent = parent
				if (Changeable.is(parent))
					parent.listen("changed", async p => {
						if (Editable.is(p) && p.readonly)
							this.disabled = true
						else
							this.disabled = !p.changed
					})
				if (parent instanceof SmoothlyFormNew && parent.reactive)
					this.reactive = true
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
				{this.reactive && <smoothly-icon size="tiny" name="close" />}
				<slot />
			</Button>
		)
	}
}