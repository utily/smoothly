import { Component, h, Prop } from "@stencil/core"
import { Color, Fill } from "../../model"

@Component({
	tag: "smoothly-button",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyButton {
	@Prop({ reflect: true }) color?: Color
	@Prop({ reflect: true }) expand?: "block" | "full"
	@Prop({ reflect: true }) fill?: Fill
	@Prop({ reflect: true }) disabled = false
	@Prop({ reflect: true }) type: "link" | "button" = "button"
	@Prop({ reflect: true }) size: "small" | "large" | "icon"
	@Prop({ reflect: true }) shape?: "rounded"
	@Prop() link?: string
	@Prop() download?: boolean

	render() {
		return this.disabled && (this.link || this.type == "link") ? (
			<slot></slot>
		) : this.link ? (
			<a href={this.link} target="_blank" download={this.download}>
				<slot name="start"></slot>
				<slot></slot>
				<slot name="end"></slot>
			</a>
		) : this.type == "link" ? (
			<a href={this.link}>
				<slot name="start"></slot>
				<slot></slot>
				<slot name="end"></slot>
			</a>
		) : (
			<button disabled={this.disabled}>
				<slot name="start"></slot>
				<slot></slot>
				<slot name="end"></slot>
			</button>
		)
	}
}
