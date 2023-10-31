import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-spinner",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlySpinner {
	@Prop({ reflect: true }) active: boolean
	@Prop({ reflect: true }) size: "small" | "medium" | "large" = "large"

	render() {
		const strokeWidth = this.size == "large" ? 6 : this.size == "medium" ? 8 : 12
		return (
			<Host
				style={{
					"--color": `var(--spinner-color)`,
					"--size": this.size == "large" ? "5em" : this.size == "medium" ? "3em" : "1.2em",
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
