import { Component, Event, EventEmitter, h, Host, Prop, State, VNode } from "@stencil/core"
import { Color, Data, Fill } from "../../model"

@Component({
	tag: "smoothly-button-confirm",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyButtonConfirm {
	timer?: NodeJS.Timeout
	@Prop() color?: Color
	@Prop({ reflect: true, mutable: true }) name: string
	@Prop() doubleClickTime = 0.2
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop() fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop() shape?: "rounded"
	@Prop() type: "link" | "button" = "button"
	@Prop() size: "small" | "large" | "icon" | "flexible"
	@State() clicked: number | undefined
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyConfirm: EventEmitter<Data>

	clickHandler(event: MouseEvent) {
		if (this.clicked && event.timeStamp - this.clicked > this.doubleClickTime * 1000) {
			this.timer && clearTimeout(this.timer)
			this.clicked = undefined
			this.smoothlyConfirm.emit({ [this.name]: true })
		} else {
			this.clicked = event.timeStamp
			this.timer = setTimeout(() => {
				this.clicked = undefined
			}, 2000)
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host warning={this.clicked}>
				<smoothly-button
					fill={this.fill}
					expand={this.expand}
					size={this.size}
					shape={this.shape}
					color={"warning"}
					disabled={this.disabled}
					type={this.type}
					onClick={event => this.clickHandler(event)}>
					<smoothly-icon name={"alert-outline"} fill="solid" color="warning" size="small" />
				</smoothly-button>
				<smoothly-button
					fill={this.fill}
					expand={this.expand}
					size={this.size}
					shape={this.shape}
					color={this.color}
					disabled={this.disabled}
					type={this.type}
					onClick={event => this.clickHandler(event)}>
					<slot />
				</smoothly-button>
			</Host>
		)
	}
}
