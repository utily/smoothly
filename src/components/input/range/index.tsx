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
	@Prop() labelText?: string
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Watch("value")
	valueChanged() {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	render() {
		return (
			<Host>
				<slot name="label">
					{typeof this.labelText === "string" && <label htmlFor={this.name}>{this.labelText}</label>}
				</slot>
				<div class="output-container">
					<output htmlFor={this.name} style={{ left: `${(this.value / this.max) * 100}%` }}>
						{this.value}
					</output>
				</div>
				<input
					name={this.name}
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={"any"}
					onInput={e => (this.value = Number.parseFloat((e.target as HTMLInputElement).value))}
					value={this.value}
				/>
				<p class="min">{this.min}</p>
				<p class="max">{this.max}</p>
			</Host>
		)
	}
}
