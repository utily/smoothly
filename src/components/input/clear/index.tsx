import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
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
	@Prop() color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill = "clear"
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "small" | "large" | "icon" | "flexible" = "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	@Prop() tooltip = "Clear"
	private parent?: Clearable | (Clearable & Editable)
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Clearable.is(parent)) {
				this.parent = parent
				if (Editable.Element.is(parent)) {
					parent.listen("changed", async p => {
						if (Input.is(p)) {
							this.display = !p.readonly && (typeof p.defined == "boolean" ? p.defined : Boolean(await p.getValue()))
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
			<Host title={this.tooltip}>
				<smoothly-button
					disabled={this.disabled}
					size={this.size}
					type={"button"}
					shape={this.shape}
					expand={this.expand}
					color={this.color}
					fill={this.fill ?? (this.type == "input" ? "clear" : undefined)}>
					<slot />
					<smoothly-icon name="close" size="tiny" />
				</smoothly-button>
			</Host>
		)
	}
}
