import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-editable",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyEditable {
	@Prop({ reflect: true }) color?: Color = "light"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type?: "input" | "form" = "form"
	@Event() smoothlyEditable: EventEmitter<(parent: HTMLElement) => void>
	private parent: Editable

	componentWillLoad() {
		this.smoothlyEditable.emit(parent => {
			if (Editable.is(parent)) {
				this.parent = parent
			}
		})
	}

	@Listen("click")
	handleClick() {
		this.parent.setReadonly(!this.parent.readonly)
	}

	render() {
		return (
			<Button disabled={this.disabled} type="button">
				<slot />
			</Button>
		)
	}
}
