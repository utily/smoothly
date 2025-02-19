import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Button } from "../button/Button"
import { Editable } from "../input/Editable"
import { Submittable } from "../input/Submittable"

@Component({
	tag: "smoothly-submit",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlySubmit {
	@Prop({ reflect: true }) color?: Color = "success"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() prevent = true
	private parent?: Submittable
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Submittable.is(parent)) {
				this.parent = parent
			}
		})
	}

	@Listen("click")
	clickHandler() {
		this.parent?.submit()
	}

	render() {
		return (
			<Button disabled={this.disabled} type={this.type}>
				<slot />
			</Button>
		)
	}
}
