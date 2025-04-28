import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Listen, Prop, VNode } from "@stencil/core"
import { Color, Fill } from "../../../model"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-edit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputEdit implements ComponentWillLoad {
	private parent?: Editable
	@Prop() color?: Color = "tertiary"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true, mutable: true }) display = true
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type: "form" | "input" = "input"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop() toolTip = "Edit"
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(parent => {
			if (Editable.type.is(parent)) {
				this.parent = parent
				parent.listen(async p => {
					this.display = p.readonly
				})
			}
		})
	}
	@Listen("click")
	clickHandler() {
		this.parent?.edit(true)
	}

	render(): VNode | VNode[] {
		return (
			<Host title={this.toolTip}>
				<smoothly-button
					disabled={this.disabled}
					size={this.size}
					type={"button"}
					shape={this.shape}
					expand={this.expand}
					color={this.color}
					fill={this.fill ?? (this.type == "input" ? "clear" : undefined)}>
					<slot />
					<smoothly-icon class="default" name="create-outline" size="tiny" />
				</smoothly-button>
			</Host>
		)
	}
}
