import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Prop, VNode } from "@stencil/core"
import { Color, Fill } from "../../../model"
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
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true, mutable: true }) disabled = false
	@Prop({ reflect: true, mutable: true }) display = false
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "flexible" | "small" | "large" | "icon"
	@Prop() toolTip = this.delete ? "Remove" : "Submit"
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(parent => {
			if (Submittable.is(parent) && Editable.type.is(parent)) {
				this.parent = parent
				parent.listen("changed", async p => {
					this.display = !p.readonly
					this.disabled = p.readonly ? true : Object.values(p.value).filter(val => val).length < 1 ? true : !p.changed
				})
			}
		})
	}
	clickHandler() {
		!this.disabled && this.parent?.submit(this.delete)
	}

	render(): VNode | VNode[] {
		return (
			<Host title={this.toolTip}>
				{this.delete == true ? (
					<smoothly-button-confirm
						disabled={this.disabled}
						size={this.size}
						shape={this.shape}
						expand={this.expand}
						type={this.type}
						color={this.color ?? "danger"}
						fill={this.fill}
						onSmoothlyConfirm={() => this.clickHandler()}>
						<slot />
						<smoothly-icon name="trash-outline" fill="solid" size="tiny" />
					</smoothly-button-confirm>
				) : (
					<smoothly-button
						disabled={this.disabled}
						size={this.size}
						type={this.type}
						shape={this.shape}
						expand={this.expand}
						color={this.color ?? "success"}
						fill={this.fill}
						onClick={() => this.clickHandler()}>
						<slot />
						<smoothly-icon name="checkmark-outline" fill="solid" size="tiny" />
					</smoothly-button>
				)}
			</Host>
		)
	}
}
