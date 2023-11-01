import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-0-svg",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySvg {
	@Prop({ reflect: true }) url!: string
	@Prop({ reflect: true }) size?: "large" | "medium" | "small" | "tiny" | { height: string; width: string }
	@Prop() color: string
	private readonly defaultSizes: Record<"large" | "medium" | "small" | "tiny", { height: string; width: string }> = {
		large: { height: "50rem", width: "50rem" },
		medium: { height: "30rem", width: "30rem" },
		small: { height: "10rem", width: "10rem" },
		tiny: { height: "5rem", width: "5rem" },
	}
	render() {
		const height = this.size
			? typeof this.size == "object"
				? this.size.height
				: this.defaultSizes[this.size].height
			: "10rem"
		const width = this.size
			? typeof this.size == "object"
				? this.size.width
				: this.defaultSizes[this.size].width
			: "10rem"
		return (
			<Host
				style={{
					"min-height": height,
					"min-width": width,
					"--size-height": height,
					"--size-width": width,
					"--color": this.color,
				}}>
				<object height={height} width={width} type="image/svg+xml" data={this.url} />
			</Host>
		)
	}
}
