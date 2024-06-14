import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Listen,
	Method,
	Prop,
	Watch,
} from "@stencil/core"
import { Date, isoly } from "isoly"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-date",
	styleUrl: "style.css",
	scoped: true,
})
export class InputDate implements ComponentWillLoad, Clearable, Input {
	@Element() element: HTMLElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value?: Date
	@Prop({ mutable: true }) open: boolean
	@Prop({ mutable: true }) max: Date
	@Prop({ mutable: true }) min: Date
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) disabled: boolean
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyValueChange: EventEmitter<Date>
	@Event() smoothlyInput: EventEmitter<Record<string, isoly.Date | undefined>>
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>

	componentWillLoad(): void {
		this.smoothlyInputLoad.emit(() => {})
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	onStart(next: Date | undefined) {
		this.smoothlyValueChange.emit(next)
		this.smoothlyInput.emit({ [this.name]: next })
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>) {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyDateSet")
	dateSetHandler(event: CustomEvent<Date>) {
		this.open = false
		event.stopPropagation()
	}
	render() {
		return [
			<smoothly-input
				color={this.color}
				name={this.name}
				onFocus={() => (this.open = !this.open)}
				onClick={() => (this.open = !this.open)}
				disabled={this.disabled}
				type="date"
				value={this.value}
				looks={this.looks}
				showLabel={this.showLabel}
				onSmoothlyInput={e => (this.value = e.detail[this.name])}>
				<slot></slot>
			</smoothly-input>,
			this.open && !this.disabled
				? [
						<div onClick={() => (this.open = false)}></div>,
						<nav>
							<div class="arrow"></div>
							<smoothly-calendar
								doubleInput={false}
								value={this.value ?? Date.now()}
								onSmoothlyValueChange={event => {
									this.value = event.detail
									event.stopPropagation()
								}}
								max={this.max}
								min={this.min}></smoothly-calendar>
						</nav>,
				  ]
				: [],
		]
	}
}
