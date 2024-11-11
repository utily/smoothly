import { Component, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { Color, Data, Fill } from "../../model"
import { Editable } from "../input/Editable"

@Component({
	tag: "smoothly-button-confirm",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyButtonConfirm {
	timer?: number
	@Prop() color?: Color
	@Prop({ reflect: true }) name: string
	@Prop() doubleClickTime = 0.2
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop() fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop() shape?: "rounded"
	@Prop() size: "small" | "large" | "icon" | "flexible"
	@State() clickTimeStamp: number | undefined
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyConfirm: EventEmitter<Data>

	clickHandler(event: MouseEvent): void {
		if (this.clickTimeStamp && event.timeStamp - this.clickTimeStamp > this.doubleClickTime * 1000) {
			this.timer && window.clearTimeout(this.timer)
			this.clickTimeStamp = undefined
			this.smoothlyConfirm.emit({ [this.name]: true })
		} else {
			this.clickTimeStamp = event.timeStamp
			this.timer = window.setTimeout(() => {
				this.clickTimeStamp = undefined
			}, 2000)
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host warning={this.clickTimeStamp}>
				<smoothly-button
					fill={this.fill}
					expand={this.expand}
					size={this.size}
					shape={this.shape}
					color={"warning"}
					disabled={this.disabled}
					type={"button"}
					onClick={event => this.clickHandler(event)}>
					<smoothly-icon
						name={"alert-outline"}
						fill={this.fill}
						color="warning"
						size={this.size === "icon" ? "tiny" : "small"}
					/>
				</smoothly-button>
				<smoothly-button
					fill={this.fill}
					expand={this.expand}
					size={this.size}
					shape={this.shape}
					color={this.color}
					disabled={this.disabled}
					type={"button"}
					onClick={event => this.clickHandler(event)}>
					<slot />
				</smoothly-button>
			</Host>
		)
	}
}
