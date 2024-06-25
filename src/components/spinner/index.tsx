import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-spinner",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySpinner {
	@Prop({ reflect: true }) size: "small" | "icon" | "medium" | "large" = "large"
	@Prop({ reflect: true }) overlay: boolean

	render() {
		const strokeWidth = this.size == "large" ? 6 : this.size == "medium" ? 8 : this.size == "icon" ? 8 : 12
		return (
			<Host
				style={{
					"--spinner-size":
						this.size == "large" ? "5em" : this.size == "medium" ? "3em" : this.size == "icon" ? "1.8em" : "1.2em",
				}}>
				<svg class="spinner" viewBox={`0 0 ${60 + strokeWidth} ${60 + strokeWidth}`} xmlns="http://www.w3.org/2000/svg">
					<circle
						class="path"
						fill="none"
						stroke-width={strokeWidth}
						stroke-linecap="round"
						cx={`${30 + strokeWidth / 2}`}
						cy={`${30 + strokeWidth / 2}`}
						r="30"></circle>
				</svg>
			</Host>
		)
	}
}
