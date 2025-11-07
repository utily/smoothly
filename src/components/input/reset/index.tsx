import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { SmoothlyForm } from "../../form"
import { Editable } from "../Editable"
import { Input } from "../Input"

@Component({
	tag: "smoothly-input-reset",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyInputReset {
	readonlyAtLoad: boolean
	@Prop() color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon" = "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	@Prop() tooltip = "Reset"
	private parent?: Editable.Element
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>

	async componentWillLoad() {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.Element.type.is(parent)) {
				this.parent = parent
				this.readonlyAtLoad = parent.readonly
				parent.listen(async p => {
					if (Input.is(p)) {
						const defined = typeof p.defined == "boolean" ? p.defined : Boolean(await p.getValue())
						this.display = p.readonly || !defined ? false : p.isDifferentFromInitial
					}
					if (p instanceof SmoothlyForm) {
						this.display = !p.readonly
						this.disabled = !this.readonlyAtLoad && !p.isDifferentFromInitial
					}
				})
			}
		})
	}
	@Listen("click")
	clickHandler(event: MouseEvent) {
		event.stopPropagation()
		this.parent?.reset()
		this.parent instanceof SmoothlyForm && this.readonlyAtLoad && this.parent?.edit(false)
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
					fill={this.fill ?? (this.type == "input" ? "clear" : undefined)}
					onClick={event => this.clickHandler(event)}>
					<slot />
					<smoothly-icon flip="x" name="refresh-outline" size="tiny" />
				</smoothly-button>
			</Host>
		)
	}
}
