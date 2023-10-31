import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-skeleton",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySkeleton {
	@Prop() widths: string[] = ["8rem", "9rem", "10rem"]
	@Prop({ mutable: true }) width: string
	@Prop() color: string
	@Prop() period: number
	@Prop() distance: string
	@Prop({ reflect: true }) align: "left" | "center" | "right" = "left"
	componentWillLoad() {
		this.width = this.width ?? this.widths[Math.floor(Math.random() * this.widths.length)]
	}
	render() {
		const cssVariables = {
			"--width": this.width,
			"--distance": this.distance ?? "10rem",
			...(this.color ? { "--color": this.color } : undefined),
			...(this.period ? { "--period": this.period + "s" } : undefined),
		}
		return <Host style={cssVariables}></Host>
	}
}
