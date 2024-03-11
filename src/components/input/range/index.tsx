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
	inputHandler(e: Event): void {
		this.isClicked = true
		e.target instanceof HTMLInputElement &&
			(this.value = this.step !== "any" ? e.target.valueAsNumber : Math.round(e.target.valueAsNumber * 100) / 100)
	}

	render() {
		return (
			<Host
				class={{ "is-clicked": this.isClicked }}
				style={{ "--left-adjustment": `${(this.value / this.max) * 100}%` }}>
				<label htmlFor={this.name}>
					<slot />
				</label>
				<output class={`output-left`} htmlFor={this.name}>
					{this.value}
				</output>
				<input
					name={this.name}
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={this.step}
					onInput={e => this.inputHandler(e)}
					value={this.value}
				/>
			</Host>
		)
	}
}
