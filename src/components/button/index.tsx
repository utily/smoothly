import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { Color, Expand, Fill } from "../../model"

@Component({
	tag: "smoothly-button",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyButton {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ reflect: true }) expand: Expand
	@Prop({ reflect: true }) fill: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop() link?: string
	@Prop() download?: boolean
	@Event() onClick: EventEmitter<UIEvent>

	@Listen("click")
	clicked(e: UIEvent) {
		this.onClick.emit(e)
	}
	render() {
		let result: HTMLElement
		switch (this.type) {
			case "link":
				result = this.disabled ? (
					<slot></slot>
				) : (
					<a onClick={e => this.clicked(e)} href={this.link}>
						<slot></slot>
					</a>
				)
				break
			case "button":
				result = this.link ? (
					<a href={this.link} target="_blank" download={this.download}>
						<slot></slot>
					</a>
				) : (
					<button disabled={this.disabled}>
						<slot></slot>
					</button>
				)
				break
		}
		return result
	}
}
