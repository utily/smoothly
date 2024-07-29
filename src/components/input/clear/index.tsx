import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Button } from "../../button/Button"
import { SmoothlyForm } from "../../form"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"

@Component({
	tag: "smoothly-input-clear",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputClear {
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "clear"
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	private parent?: Clearable | (Clearable & Editable)
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Clearable.is(parent)) {
				this.parent = parent
				if (Editable.Element.is(parent)) {
					parent.listen("changed", async p => {
						if (Input.is(p)) {
							this.display = !p.readonly && (typeof p.defined == "boolean" ? p.defined : Boolean(p.value))
						}
						if (p instanceof SmoothlyForm) {
							this.disabled = p.readonly || Object.values(p.value).filter(val => val).length < 1
							this.display = !p.readonly
						}
					})
				}
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
