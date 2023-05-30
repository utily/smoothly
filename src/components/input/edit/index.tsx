import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-edit",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputEdit {
	@Prop({ reflect: true }) color?: Color = "light"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "default"
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	private parent: Editable

	componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.is(parent))
				this.parent = parent
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
