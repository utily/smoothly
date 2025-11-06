import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"
import { isly } from "isly"
import { Color, Data, Fill, Icon } from "../../../model"
import { Editable } from "../Editable"
import { Submittable } from "../Submittable"

@Component({
	tag: "smoothly-input-submit",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputSubmit implements ComponentWillLoad {
	private parent?: Submittable & Editable
	@Prop({ reflect: true }) delete = false
	@Prop() color?: Color
	@Prop() icon: Icon | false = "checkmark-outline"
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true, mutable: true }) display = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon" = "icon"
	@Prop() tooltip = this.delete ? "Remove" : "Submit"
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(parent => {
			if (Submittable.is(parent) && Editable.type.is(parent)) {
				this.parent = parent
				parent.listen(async p => {
					this.display = !p.readonly
					this.disabled =
						!this.delete &&
						(p.readonly ||
							("validator" in p && p.validator instanceof isly.Type && !p.validator?.is(Data.convertArrays(p.value))) ||
							!p.isDifferentFromInitial)
				})
			}
		})
	}
	clickHandler() {
		this.parent?.submit(this.delete)
	}

	render(): VNode | VNode[] {
		return (
			<Host title={this.tooltip}>
				{this.delete == true ? (
					<smoothly-button-confirm
						size={this.size}
						shape={this.shape}
						expand={this.expand}
						color={this.color ?? "danger"}
						fill={this.fill}
						onSmoothlyConfirm={() => this.clickHandler()}>
						<slot />
						<smoothly-icon name="trash-outline" fill="solid" />
					</smoothly-button-confirm>
				) : (
					<smoothly-button
						disabled={this.disabled}
						size={this.size}
						type={"button"}
						shape={this.shape}
						expand={this.expand}
						color={this.color ?? "success"}
						fill={this.fill}
						onClick={() => this.clickHandler()}>
						<slot />
						{this.icon && <smoothly-icon name={this.icon} fill="solid" />}
					</smoothly-button>
				)}
			</Host>
		)
	}
}
