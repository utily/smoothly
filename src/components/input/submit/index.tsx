import { Component, ComponentWillLoad, Event, EventEmitter, h, Listen, Prop, VNode } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"
import { Submittable } from "../Submittable"

@Component({
	tag: "smoothly-input-submit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSubmit implements ComponentWillLoad {
	private parent?: Submittable & Editable
	@Prop({ reflect: true }) color?: Color = "tertiary"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true, mutable: true }) display = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(parent => {
			if (Submittable.is(parent) && Editable.type.is(parent)) {
				this.parent = parent
				parent.listen("changed", async p => {
					this.display = !p.readonly
					this.disabled = p.readonly ? true : Object.values(p.value).filter(val => val).length < 1 ? true : !p.changed
				})
			}
		})
	}
	@Listen("click")
	clickHandler() {
		this.parent?.submit()
	}

	render(): VNode | VNode[] {
		return (
			<Button disabled={this.disabled} type="button">
				<slot />
			</Button>
		)
	}
}
