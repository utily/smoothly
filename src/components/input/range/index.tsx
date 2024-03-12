import { Component, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRange implements Input, Clearable {
	@Prop({ mutable: true, reflect: true }) value: number | undefined = undefined
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop() min = 0
	@Prop() max = 100
	@Prop() name: string
	@Prop() labelText?: string
	@Prop() step: number | "any" = "any"
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	componentWillLoad() {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
	}
	inputHandler(event: Event): void {
		event.target instanceof HTMLInputElement &&
			(this.value =
				this.step !== "any" ? event.target.valueAsNumber : Math.round(event.target.valueAsNumber * 100) / 100)
	}

	render() {
		return (
			<Host style={{ "--left-adjustment": `${this.value ? (this.value / this.max) * 100 : 0}%` }}>
				<div>
					<output htmlFor={this.name}>{this.value ?? "—"}</output>
					<label htmlFor={this.name}>
						<slot />
					</label>
				</div>
				<input
					color={this.color}
					name={this.name}
					part="range"
					type="range"
					min={this.min}
					max={this.max}
					step={this.step}
					onInput={event => this.inputHandler(event)}
					value={this.value ?? this.min}
				/>
			</Host>
		)
	}
}
