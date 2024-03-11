import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
	@State() isClicked = false
	@Prop({ mutable: true }) value = 0
	@Prop() min = 0
	@Prop() max = 100
	@Prop() name: string
	@Prop() labelText?: string
	@Prop() step: number | "any" = "any"
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: Event): void {
		this.isClicked = true
		event.target instanceof HTMLInputElement &&
			(this.value =
				this.step !== "any" ? event.target.valueAsNumber : Math.round(event.target.valueAsNumber * 100) / 100)
	}

	render() {
		return (
			<Host style={{ "--left-adjustment": `${(this.value / this.max) * 100}%` }}>
				<div>
					<output class={`output-left`} htmlFor={this.name}>
						{this.value}
					</output>
					<label htmlFor={this.name}>
						<slot />
					</label>
				</div>
				<input
					name={this.name}
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={this.step}
					onInput={event => this.inputHandler(event)}
					value={this.value}
				/>
			</Host>
		)
	}
}
