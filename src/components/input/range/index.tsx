import { Component, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
	@Prop({ mutable: true }) value = 0
	@Prop() min = 0
	@Prop() max = 1
	@Prop() name: string
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Watch("value")
	valueChanged() {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	getInput(e: Event): void {
		this.value = (e.target as HTMLInputElement).valueAsNumber
	}
	render() {
		return (
			<Host>
				<input
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={"any"}
					onInput={e => (this.value = Number.parseFloat((e.target as HTMLInputElement).value))}
					value={this.value}
				/>
			</Host>
		)
	}
}

// @Component({
// 	tag: "smoothly-input-range",
// 	styleUrl: "style.css",
// 	shadow: true,
// })
// export class SmoothlyInputRange {
// 	slide?: HTMLDivElement
// 	slider?: HTMLDivElement
// 	isDragging = false
// 	private set ratio(value: number) {
// 		this.value = Math.max(this.min, Math.min(this.max, value * (this.max - this.min) + this.min))
// 	}
// 	private get ratio(): number {
// 		return (this.value - this.min) / (this.max - this.min)
// 	}
// 	private get sliderWidth(): number {
// 		return (this.slider?.offsetWidth && this.slider?.offsetWidth + this.padding * 2) ?? 1
// 	}
// 	private get slideWidth(): number {
// 		return this.slide?.offsetWidth ?? 10
// 	}
// 	private get slideStart(): number {
// 		return this.sliderWidth / 2
// 	}
// 	private get slideLength(): number {
// 		return this.slideWidth - this.sliderWidth
// 	}
// 	@Prop({ mutable: true }) value = 0
// 	@Prop() min = 0
// 	@Prop() max = 1
// 	@Prop() padding = 4
// 	@Prop() name: string
// 	@Listen("mousemove", { target: "window" })
// 	handleMouseMove(e: MouseEvent) {
// 		if (this.isDragging) {
// 			this.updateRatio(e)
// 		}
// 	}
// 	@Listen("mouseup", { target: "window" })
// 	handleMouseUp() {
// 		this.isDragging = false
// 	}
// 	@Event() smoothlyInput: EventEmitter<Record<string, any>>
// 	@Watch("value")
// 	valueChanged() {
// 		this.smoothlyInput.emit({ [this.name]: this.value })
// 	}

// 	updateRatio(e: MouseEvent): void {
// 		this.ratio = (e.offsetX - this.slideStart) / this.slideLength
// 	}
// 	handleSliderClick(e: MouseEvent): void {
// 		e.stopPropagation()
// 		this.ratio += (e.offsetX - this.slideStart) / this.slideLength
// 	}

// 	render() {
// 		return (
// 			<Host>
// 				<div
// 					part="slide"
// 					ref={e => (this.slide = e)}
// 					style={{ padding: `${this.padding}px` }}
// 					onClick={e => this.updateRatio(e)}>
// 					<div
// 						onClick={e => this.handleSliderClick(e)}
// 						ref={e => (this.slider = e)}
// 						onMouseDown={() => (this.isDragging = true)}
// 						part="slider"
// 						style={{
// 							left: `${this.ratio * this.slideLength}px`,
// 						}}></div>
// 				</div>
// 			</Host>
// 		)
// 	}
// }
