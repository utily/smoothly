import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
	slide?: HTMLDivElement
	slider?: HTMLDivElement
	isDragging = false
	private set ratio(value: number) {
		this.value = Math.floor(Math.max(this.min, Math.min(this.max, value * (this.max - this.min) + this.min)))
	}
	private get ratio(): number {
		return (this.value - this.min) / (this.max - this.min)
	}
	private get sliderWidth(): number {
		return (this.slider?.offsetWidth && this.slider?.offsetWidth + this.padding * 2) ?? 28
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
	@Prop() max = 100
	@Prop() padding = 4
	@Prop() name: string
	@Listen("mousemove", { target: "window" })
	handleMouseMove(e: MouseEvent) {
		if (this.isDragging) {
			this.updateRatio(e)
		}
	}
	@Listen("mouseup", { target: "window" })
	handleMouseUp() {
		this.isDragging = false
	}
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Watch("value")
	valueChanged() {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	updateRatio(e: MouseEvent): void {
		this.ratio = (e.offsetX - this.slideStart) / this.slideLength
	}
	handleSliderClick(e: MouseEvent): void {
		e.stopPropagation()
		this.ratio += (e.offsetX - this.slideStart) / this.slideLength
	}

	render() {
		return (
			<Host>
				<p
					part="value"
					style={{
						left: `${this.ratio * this.slideLength + this.sliderWidth / 2}px`,
					}}>
					{this.value}
				</p>
				<div
					part="slide"
					ref={e => (this.slide = e)}
					style={{ padding: `${this.padding}px` }}
					onClick={e => this.updateRatio(e)}>
					<div
						onClick={e => this.handleSliderClick(e)}
						ref={e => (this.slider = e)}
						onMouseDown={() => (this.isDragging = true)}
						part="slider"
						style={{
							left: `${this.ratio * this.slideLength}px`,
						}}></div>
				</div>
				<div class="min-max">
					<p
						part="min"
						style={{
							left: `${this.sliderWidth / 2 - this.padding}px`,
						}}>
						{this.min}
					</p>
					<p part="max">{this.max}</p>
				</div>
			</Host>
		)
	}
}
