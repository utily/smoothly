import { Component, ComponentWillLoad, Event, EventEmitter, h, Listen, Prop, VNode } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-edit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputEdit implements ComponentWillLoad {
	private parent?: Editable
	@Prop({ reflect: true }) color?: Color = "tertiary"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true, mutable: true }) editable = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.type.is(parent)) {
				this.parent = parent
			}
		})
	}
	@Listen("click")
	clickHandler() {
		this.editable = !this.editable
		this.parent?.edit(this.editable)
	}

	render(): VNode | VNode[] {
		return (
			<Button disabled={this.disabled} type="button">
				<slot />
			</Button>
		)
	}
}
