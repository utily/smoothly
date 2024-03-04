import { Component, h, Host, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
	slide?: HTMLDivElement
	slider?: HTMLDivElement
	private set ratio(value: number) {
		this.value = Math.max(this.min, Math.min(this.max, value * (this.max - this.min) + this.min))
	}
	private get ratio(): number {
		return (this.value - this.min) / (this.max - this.min)
	}
	private get sliderWidth(): number {
		return (this.slider?.offsetWidth && this.slider?.offsetWidth + this.padding * 2) ?? 1
	}
	private get slideWidth(): number {
		return this.slide?.offsetWidth ?? 10
	}
	private get slideStart(): number {
		return this.sliderWidth / 2
	}
	private get slideLength(): number {
		return this.slideWidth - this.sliderWidth
	}
	@Prop({ mutable: true }) value = 0
	@Prop() min = 0
	@Prop() max = 1
	@Prop() padding = 4
	@Prop({ mutable: true }) isDragging = false
	@Listen("mousemove", { target: "window" })
	handleMouseMove(e: MouseEvent) {
		if (this.isDragging) {
			this.ratio = (e.offsetX - this.slideStart) / this.slideLength
		}
	}
	@Listen("mouseup", { target: "window" })
	handleMouseUp() {
		this.isDragging = false
	}

	handleSlideClick(e: MouseEvent | DragEvent): void {
		this.ratio = (e.offsetX - this.slideStart) / this.slideLength
	}
	handleSliderClick(e: MouseEvent): void {
		e.stopPropagation()
		this.ratio += (e.offsetX - this.slideStart) / this.slideLength
	}

	render() {
		return (
			<Host>
				<div
					part="slide"
					ref={e => (this.slide = e)}
					style={{ padding: `${this.padding}px` }}
					onClick={e => this.handleSlideClick(e)}>
					<div
						onClick={e => this.handleSliderClick(e)}
						ref={e => (this.slider = e)}
						onMouseDown={() => (this.isDragging = true)}
						part="slider"
						style={{
							left: `${this.ratio * this.slideLength}px`,
						}}></div>
				</div>
			</Host>
		)
	}
}
