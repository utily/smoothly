import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../Button"
import { SmoothlyForm } from "../../form"
import { Editable } from "../Editable"
import { Input } from "../Input"

@Component({
	tag: "smoothly-input-reset",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputReset {
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "clear"
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	private parent?: Editable.Element
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.Element.type.is(parent)) {
				this.parent = parent
				parent.listen("changed", async p => {
					if (Input.is(p)) {
						this.disabled = p.readonly ? true : !p.changed
						this.display = p.readonly ? false : p.changed
					}
					if (p instanceof SmoothlyForm) {
						this.disabled = p.readonly ? true : !p.changed
						this.display = !p.readonly
					}
				})
			}
		})
	}
	@Listen("click")
	clickHandler() {
		this.parent?.reset()
	}
	render() {
		return (
			<Button disabled={this.disabled} type="button">
				<slot />
			</Button>
		)
	}
}
