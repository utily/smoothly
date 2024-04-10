import { Component, ComponentWillLoad, Event, EventEmitter, h, Listen, Prop, State, VNode } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-confirm",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputConfirm implements ComponentWillLoad {
	private parent?: Editable
	symbol: "checkmark-outline" | "alert-outline" = "checkmark-outline"
	@Prop({ reflect: true }) color?: Color = "success"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@State() clicked = false
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
		this.color = "warning"
		console.log("hej")
	}

	render(): VNode | VNode[] {
		return (
			<Button disabled={this.disabled} type="button">
				<smoothly-icon name={this.symbol} fill="solid" />
			</Button>
		)
	}
}
