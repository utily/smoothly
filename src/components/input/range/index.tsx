import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Method, Prop, VNode, Watch } from "@stencil/core"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRange implements Input, Clearable, ComponentWillLoad {
	@Prop({ mutable: true }) value: number | undefined = undefined
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop() min = 0
	@Prop() max = 100000
	@Prop() name: string
	@Prop() labelText?: string
	@Prop() step: number | "any" = "any"
	@Prop() outputSide: "right" | "left" = "left"
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: Event): void {
		event.target instanceof HTMLInputElement &&
			(this.value =
				this.step !== "any" ? event.target.valueAsNumber : Math.round(event.target.valueAsNumber * 100) / 100)
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ "output-side-right": this.outputSide === "right" }}>
				<slot name="start" />
				<div>
					<label htmlFor={this.name}>
						<slot />
					</label>
					<output htmlFor={this.name}>{this.value ?? "—"}</output>
					<input
						name={this.name}
						part="range"
						type="range"
						min={this.min}
						max={this.max}
						step={this.step}
						onInput={event => this.inputHandler(event)}
						value={this.value ?? this.min}
					/>
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
