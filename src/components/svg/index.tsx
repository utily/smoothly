import { Component, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-svg",
	styleUrl: "style.css",
})
export class SmoothlySvg {
	@Prop({ reflect: true }) url!: string
	@Prop({ reflect: true }) size?: "large" | "medium" | "small" | "tiny" | { height: string; width: string }
	private readonly defaultSizes: Record<"large" | "medium" | "small" | "tiny", { height: string; width: string }> = {
		large: { height: "50rem", width: "50rem" },
		medium: { height: "30rem", width: "30rem" },
		small: { height: "10rem", width: "10rem" },
		tiny: { height: "5rem", width: "5rem" },
	}
	render() {
		return (
			<object
				height={
					this.size ? (typeof this.size == "object" ? this.size.height : this.defaultSizes[this.size].height) : "50em"
				}
				width={
					this.size ? (typeof this.size == "object" ? this.size.width : this.defaultSizes[this.size].width) : "50em"
				}
				type="image/svg+xml"
				data={this.url}
			/>
		)
	}
}
