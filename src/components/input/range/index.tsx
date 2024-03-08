import { Component, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyInputRange {
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

	render() {
		return (
			<Host style={{ "--left-adjustment": `${(this.value / this.max) * 100}%` }}>
				<slot name="label">
					{typeof this.labelText === "string" && <label htmlFor={this.name}>{this.labelText}</label>}
				</slot>
				<div class="output-container">
					<output htmlFor={this.name}>{this.value}</output>
				</div>
				<input
					name={this.name}
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={this.step}
					onInput={e =>
						e.target instanceof HTMLInputElement && (this.value = Math.trunc(e.target.valueAsNumber * 100) / 100)
					}
					value={this.value}
				/>
				<p class="min">{this.min}</p>
				<p class="max">{this.max}</p>
			</Host>
		)
	}
}
