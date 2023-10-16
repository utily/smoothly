import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-spinner",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlySpinner {
	@Prop({ reflect: true }) active: boolean
	@Prop({ reflect: true }) size: "small" | "medium" | "large" = "large"

	render() {
		const factor = this.size == "large" ? 2 : this.size == "medium" ? 1 : 0.5
		return (
			<Host
				style={{
					"--color": `var(--spinner-color)`,
				}}>
				<svg
					version="1.1"
					class="spinner"
					width={70 * factor}
					height={70 * factor}
					viewBox={`0 0 ${70 * factor} ${70 * factor}`}
					xmlns="http://www.w3.org/2000/svg">
					<path
						id="path6930"
						fill="none"
						stroke="#8ae234"
						stroke-width={11.2334}
						stroke-linecap="round"
						stroke-miterlimit="4"
						stroke-dasharray="none"
						d="M 6.6173054,47.341988 26.0695,26.476534 c 4.620688,-4.919157 12.354263,-5.161114 17.273419,-0.540424 4.919158,4.620687 5.161115,12.354263 0.540425,17.273418 -4.620687,4.919159 -12.354263,5.161116 -17.273419,0.540426 C 21.690767,39.129265 21.448811,31.395691 26.0695,26.476534"
					/>
					<path
						id="path6932"
						fill="none"
						stroke="#8ae234"
						stroke-width={11.2334}
						stroke-linecap="round"
						stroke-miterlimit="4"
						stroke-dasharray="none"
						d="M 63.350623,22.273788 43.898427,43.139242 c -4.620688,4.919157 -12.354262,5.161114 -17.273419,0.540424 -4.919158,-4.620687 -5.161115,-12.354263 -0.540425,-17.273418 4.620688,-4.919159 12.354263,-5.161116 17.273419,-0.540426 4.919159,4.620689 5.161114,12.354263 0.540425,17.27342"
					/>
				</svg>
			</Host>
		)
	}
}
