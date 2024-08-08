import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	VNode,
	Watch,
} from "@stencil/core"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-range",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRange implements Input, Clearable, Editable, ComponentWillLoad {
	@Element() element: HTMLSmoothlyInputRangeElement
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) value: number | undefined = undefined
	private initialValue = this.value
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() min = 0
	@Prop() max = 100000
	@Prop() name = "range"
	@Prop() labelText?: string
	@Prop() valueText?: string
	@Prop() step: number | "any" = "any"
	@Prop() outputSide: "right" | "left" = "left"
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.value
		this.valueChanged()
	}
	@Watch("value")
	valueChanged(): void {
		this.changed = this.initialValue !== this.value
		this.listener.changed?.(this)
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: Event): void {
		event.target instanceof HTMLInputElement &&
			(this.value =
				this.step !== "any" ? event.target.valueAsNumber : Math.round(event.target.valueAsNumber * 100) / 100)
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: unknown) => void>) {
		if (event.target != this.element) {
			event.stopPropagation()
			event.detail(this)
		}
	}

	render(): VNode | VNode[] {
		return (
			<Host class={{ "output-side-right": this.outputSide === "right" }}>
				<slot name="start" />
				<div>
					<label htmlFor={this.name}>
						<slot />
					</label>
					<output htmlFor={this.name}>{this.valueText ? this.valueText : this.value ?? "—"}</output>
					<input
						name={this.name}
						part="range"
						type="range"
						min={this.min}
						max={this.max}
						step={this.step}
						disabled={this.readonly}
						onInput={event => this.inputHandler(event)}
						value={this.value ?? this.min}
					/>
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
