import { Component, h, Host, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
	@Prop({ mutable: true }) value = 0.5
	slide?: HTMLDivElement
	render() {
		console.log("render", this.value)
		return (
			<Host>
				<div
					part="slide"
					ref={e => (this.slide = e)}
					onClick={e => {
						console.log(e.offsetX, this.slide?.offsetWidth, (this.value = e.offsetX / (this.slide?.offsetWidth ?? 100)))
					}}>
					<div part="slider" style={{ left: `${this.value * 100}%` }}></div>
				</div>
			</Host>
		)
	}
}
