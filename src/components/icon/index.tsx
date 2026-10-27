import { Component, Element, h, Host, Prop, State, Watch } from "@stencil/core"
import { Color, Fill } from "../../model"
import { Icon } from "../../model"

@Component({
	tag: "smoothly-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyIcon {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) color: Color
	@Prop({ reflect: true }) fill: Fill = "solid"
	@Prop({ reflect: true }) name: Icon | "empty" = "empty"
	@Prop({ reflect: true }) size?: "tiny" | "small" | "medium" | "large" | "xlarge"
	@Prop({ reflect: true }) rotate?: number
	@Prop({ reflect: true }) flip?: "x" | "y"
	@Prop() tooltip?: string
	@State() latestPromise: Promise<Icon.Reference | undefined>
	@State() symbol?: Icon.Reference

	async componentWillLoad() {
		await this.nameChanged()
	}
	@Watch("tooltip")
	@Watch("name")
	async nameChanged() {
		if (this.name == "empty") {
			this.symbol = undefined
			return
		}

		const promise = (this.latestPromise = Icon.symbol(this.name))
		const result = await promise
		if (promise != this.latestPromise) {
			return
		}

		if (result) {
			this.symbol = result
		}
	}

	render() {
		// Each icon references its symbol in the shared sprite instead of carrying its own copy of the svg
		return (
			<Host title={this.tooltip} style={{ ["--rotation"]: `${this.rotate ?? 0}deg` }}>
				{this.name == "empty" ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<title>Empty</title>
					</svg>
				) : (
					this.symbol && (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox={this.symbol.viewBox} role="img">
							<use href={`#${this.symbol.id}`} />
						</svg>
					)
				)}
			</Host>
		)
	}
}
